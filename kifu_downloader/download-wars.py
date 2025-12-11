import os
import time
import requests
import re
from playwright.sync_api import sync_playwright

USER_ID = "hashiryoma"
BASE_URL = f"https://www.shogi-extend.com/swars/search?query={USER_ID}"
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), "kifu")

# Realistic User-Agent to avoid bot detection
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def download_file(url, save_path):
    try:
        headers = {"User-Agent": USER_AGENT}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {os.path.basename(save_path)}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def run():
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent=USER_AGENT)

        print(f"Navigating to {BASE_URL}...")
        page.goto(BASE_URL, wait_until="networkidle")
        
        # Wait for results to load (increased timeout for CI environments)
        try:
            page.wait_for_selector("table", timeout=30000)
            # Additional wait for JavaScript to fully render
            time.sleep(3)
        except:
            print("Could not find table. The page might not have loaded correctly or no results found.")
            # Save screenshot for debugging
            screenshot_path = os.path.join(os.path.dirname(__file__), "debug_screenshot.png")
            page.screenshot(path=screenshot_path)
            print(f"Debug screenshot saved to: {screenshot_path}")
            browser.close()
            return

        page_num = 1
        while True:
            print(f"Processing page {page_num}...")
            
            # Find all detail links (ShowButton)
            # These links look like /swars/battles/Ifsixwasnine69-hashiryoma-20251129_200135/?viewpoint=white
            detail_links = page.locator("a.ShowButton").all()
            
            print(f"Found {len(detail_links)} game links on page {page_num}")
            
            if not detail_links:
                print("No game links found on this page.")
                # Save screenshot for debugging
                screenshot_path = os.path.join(os.path.dirname(__file__), "debug_no_games.png")
                page.screenshot(path=screenshot_path)
                print(f"Debug screenshot saved to: {screenshot_path}")
                break
            
            new_downloads_count = 0
            
            for link in detail_links:
                href = link.get_attribute("href")
                if not href:
                    continue
                
                # Extract Game ID
                # href example: /swars/battles/Ifsixwasnine69-hashiryoma-20251129_200135/?viewpoint=white
                # Game ID: Ifsixwasnine69-hashiryoma-20251129_200135
                match = re.search(r'/swars/battles/([^/?]+)', href)
                if match:
                    game_id = match.group(1)
                    
                    # Construct download URL for KIF format
                    # URL: https://www.shogi-extend.com/w/{game_id}.kif?body_encode=UTF-8&disposition=attachment&format=kif
                    download_url = f"https://www.shogi-extend.com/w/{game_id}.kif?body_encode=UTF-8&disposition=attachment&format=kif"
                    filename = f"{game_id}.kif"
                    save_path = os.path.join(DOWNLOAD_DIR, filename)
                    
                    if os.path.exists(save_path):
                        # print(f"Skipping {filename} (already exists)")
                        continue
                    
                    if download_file(download_url, save_path):
                        new_downloads_count += 1
                        time.sleep(0.5) # Be polite to the server

            print(f"Page {page_num} complete. {new_downloads_count} new files downloaded.")

            # Pagination handling
            # Selector: a.pagination-link.pagination-next
            next_link = page.locator("a.pagination-link.pagination-next").first
            
            # Check if it exists and is visible
            if next_link.count() > 0 and next_link.is_visible():
                # Check if disabled
                if next_link.get_attribute("disabled") is not None or "is-disabled" in (next_link.get_attribute("class") or ""):
                    print("Next page button is disabled. Reached last page.")
                    break

                try:
                    print("Navigating to next page...")
                    # Get current first game to check if page changed
                    first_game_before = page.locator("a.ShowButton").first.get_attribute("href")
                    
                    next_link.click()
                    
                    # Wait for the first game link to change
                    # This is a bit tricky if the next page has the same first game (unlikely)
                    # or if the page load is slow.
                    # Better to wait for network idle or a short sleep.
                    page.wait_for_load_state("networkidle")
                    time.sleep(3) # Give it time to render
                    
                    first_game_after = page.locator("a.ShowButton").first.get_attribute("href")
                    
                    if first_game_before == first_game_after:
                        print("Page did not change. Assuming end of results.")
                        break
                        
                    page_num += 1
                except Exception as e:
                    print(f"Could not click next page: {e}")
                    break
            else:
                print("No next page found (or end of results).")
                break

        browser.close()
        print("Done!")

if __name__ == "__main__":
    run()

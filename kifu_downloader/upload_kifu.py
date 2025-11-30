#!/usr/bin/env python3
"""
棋譜ファイルをパースしてSupabaseにアップロードするCLIツール
"""
import argparse
import os
import sys
from pathlib import Path

from kif_parser import parse_kif
from db_uploader import get_supabase_client, upload_game


def main():
    parser = argparse.ArgumentParser(description="棋譜ファイルをSupabaseにアップロード")
    parser.add_argument(
        "path",
        nargs="?",
        default="kifu",
        help="アップロードする棋譜ファイルまたはディレクトリのパス (デフォルト: kifu)",
    )
    parser.add_argument(
        "--user-id",
        help="ユーザーID (環境変数 UPLOAD_USER_ID でも指定可能)",
    )
    parser.add_argument(
        "--skip-duplicate-check",
        action="store_true",
        help="重複チェックをスキップ",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="実際にはアップロードせず、パースのみ行う",
    )
    
    args = parser.parse_args()
    
    # ユーザーIDの取得
    user_id = args.user_id or os.environ.get("UPLOAD_USER_ID")
    
    # パスの解決
    script_dir = Path(__file__).parent
    target_path = Path(args.path)
    if not target_path.is_absolute():
        target_path = script_dir / target_path
    
    if not target_path.exists():
        print(f"エラー: パスが存在しません: {target_path}")
        sys.exit(1)
    
    # 棋譜ファイルの収集
    kif_files: list[Path] = []
    if target_path.is_file():
        kif_files.append(target_path)
    else:
        kif_files.extend(sorted(target_path.glob("*.kif")))
    
    if not kif_files:
        print(f"棋譜ファイルが見つかりません: {target_path}")
        sys.exit(1)
    
    print(f"対象ファイル数: {len(kif_files)}")
    print(f"ユーザーID: {user_id or '(匿名)'}")
    print(f"重複チェック: {'スキップ' if args.skip_duplicate_check else '有効'}")
    print(f"ドライラン: {'はい' if args.dry_run else 'いいえ'}")
    print()
    
    # Supabaseクライアントの初期化
    client = None
    if not args.dry_run:
        try:
            client = get_supabase_client()
        except ValueError as e:
            print(f"エラー: {e}")
            sys.exit(1)
    
    # 各ファイルを処理
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for kif_file in kif_files:
        print(f"処理中: {kif_file.name}")
        
        try:
            # ファイル読み込み
            content = kif_file.read_text(encoding="utf-8")
            
            # パース
            metadata, moves = parse_kif(content)
            
            if args.dry_run:
                print(f"  パース成功: {len(moves)}手")
                print(f"  先手: {metadata.black_player}")
                print(f"  後手: {metadata.white_player}")
                print(f"  結果: {metadata.result}")
                success_count += 1
            else:
                # アップロード
                if upload_game(
                    client,
                    moves,
                    metadata,
                    user_id=user_id,
                    skip_duplicate_check=args.skip_duplicate_check,
                ):
                    success_count += 1
                else:
                    skip_count += 1
        
        except Exception as e:
            print(f"  エラー: {e}")
            error_count += 1
    
    print()
    print(f"完了: 成功={success_count}, スキップ={skip_count}, エラー={error_count}")
    
    if error_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()

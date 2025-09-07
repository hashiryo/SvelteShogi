import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "happy-dom",
      include: ["src/test/**/*.{test,spec}.{js,ts}"],
      exclude: ["node_modules", "dist"],
    },
  })
);

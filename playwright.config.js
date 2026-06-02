import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 45000,
  retries: 0,
  use: {
    headless: true,
    locale: "ko-KR",
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "node server.js",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120000
  }
});

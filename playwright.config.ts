import { defineConfig } from "@playwright/test";

/** 冒烟 E2E：跑在静态导出产物 out/ 上（python http.server，零依赖）。本机已装 Chrome，用 channel:"chrome" 免下载浏览器。 */
const PORT = Number(process.env.E2E_PORT ?? 43126);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  workers: 1, // 静态站 python http.server 并发下会重置连接；4 条冒烟顺序跑更稳定
  fullyParallel: false,
  use: { baseURL: `http://127.0.0.1:${PORT}`, channel: "chrome" },
  webServer: {
    command: `python3 -m http.server ${PORT} --directory out`,
    url: `http://127.0.0.1:${PORT}/zh/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "mobile-375", use: { viewport: { width: 375, height: 812 } } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
  ],
});

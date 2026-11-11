import type { NextConfig } from "next";

/** 历象官网：Next 静态导出（无 DB / 无服务端 / 无 pm2）。安全头由 nginx 下发。 */
const nextConfig: NextConfig = {
  output: "export",
  /**
   * 固定 buildId：让同 commit + 同依赖的 out/ 与 tar 字节可复现（默认 buildId 随机 → 每次重建 tar sha 不同）。
   * 视觉/内容变更时改版本号（v2.2 → v3 → … → v3.4 → v3.5）即可。
   */
  generateBuildId: async () => "lixiang-static-v3.5",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

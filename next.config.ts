import type { NextConfig } from "next";

/** 历象官网：Next 静态导出（无 DB / 无服务端 / 无 pm2）。安全头由 nginx 下发。 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

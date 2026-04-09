import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

import type { NextConfig } from "next";
import { NormalModuleReplacementPlugin } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        readline: false,
        child_process: false,
        os: false,
        path: false,
        url: false,
        zlib: false,
      };

      // Handle `node:` scheme
      config.plugins.push(
        new NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
    }
    return config;
  },
};

export default nextConfig;

import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ["@measured/puck", "lucide-react", "ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "appwrite.biso.no" },
      { protocol: "https", hostname: "biso.no" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist/node_modules/canvas": false,
      };
    }
    return config;
  },
  experimental: {
    turbo: { rules: {} },
    optimizePackageImports: ["lucide-react", "@radix-ui"],
  },
};

export default withNextIntl(nextConfig);

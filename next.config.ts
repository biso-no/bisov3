import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const baseConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  swcMinify: process.env.DISABLE_MINIFY === '1' ? false : true,

  transpilePackages: ["lucide-react", "ui"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appwrite.biso.no",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "biso.no",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      // Disable source maps in production to reduce memory usage
      config.devtool = false;
    }
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist/legacy": false,
        "pdfjs-dist/build/pdf.worker": false,
      };
    }
    return config;
  },

  experimental: {
    optimizePackageImports: process.env.DISABLE_MINIFY === '1' ? [] : ["lucide-react", "@radix-ui"],
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withNextIntl(withAnalyzer(baseConfig));

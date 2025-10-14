import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const baseConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  swcMinify: process.env.DISABLE_MINIFY === '1' ? false : true,

  transpilePackages: [],

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
    // Avoid polyfilling large Node modules in client bundles
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      crypto: false,
      canvas: false,
      buffer: false,
      stream: false,
      zlib: false,
    };
    
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist/legacy": false,
        "pdfjs-dist/build/pdf.worker": false,
      };
    }

    if (isServer) {
      const heavyPkgs = [
        'pdfjs-dist',
        'pdfjs-dist/legacy/build/pdf.mjs',
        'tesseract.js',
        'jimp',
        'mammoth',
        'jszip',
        'xml2js',
        '@react-pdf/renderer',
        'xlsx',
        '@microsoft/microsoft-graph-client',
        '@azure/msal-node',
        '@pinecone-database/pinecone',
        'gpt-tokenizer',
      ];
      const originalExternals = config.externals || [];
      config.externals = [
        ...originalExternals,
        ({ request }: { request?: string }, callback: (err?: any, result?: any) => void) => {
          if (request && heavyPkgs.some((name) => request === name || request.startsWith(name))) {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    }
    return config;
  },

  experimental: {
    optimizePackageImports: [],
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withNextIntl(withAnalyzer(baseConfig));

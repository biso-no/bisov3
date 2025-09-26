import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ["@measured/puck", "lucide-react", "ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'appwrite.biso.no',
      },
      {
        protocol: 'https',
        hostname: 'biso.no',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to handle the canvas dependency
    if (!isServer) {
      // Don't resolve 'canvas' package on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist/node_modules/canvas': false,
        '@webdock/sdk': false
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
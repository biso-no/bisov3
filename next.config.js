/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ["@measured/puck", "lucide-react", "ui"],
};

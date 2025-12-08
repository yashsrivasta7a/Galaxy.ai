import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'auth-cdn.oaistatic.com',
      },
    ],
  },
};

export default nextConfig;

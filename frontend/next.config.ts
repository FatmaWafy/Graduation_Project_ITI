import type { NextConfig } from "next";
const origin = process.env.NEXT_PUBLIC_API_URL;


const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
      },
    ];
  },
};


export default nextConfig;

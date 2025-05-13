import withPWA from 'next-pwa';
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration, ResolveOptions } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // Static Export
  images: {
    domains: ['biuqxuvacrwdlyzlsimj.supabase.co'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  webpack(config: WebpackConfiguration, { isServer }: { isServer: boolean }) {
    if (!isServer) {
      // تأكد إن config.resolve موجود، لو مفيش خلّيه object فارغ
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}), // استخدم optional chaining و default إن كان undefined
          fs: false,
        },
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
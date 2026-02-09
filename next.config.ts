import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  turbopack: {},
  // Exclude API routes from static export - they will be handled by Cloudflare Workers
  // The workers/ directory is deployed separately as Cloudflare Workers
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed for Vercel (Serverless)
  distDir: '.next',
  images: {
    unoptimized: true, // Keep if using external loader or verify Vercel limits
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    // optimizeCss: true, // Requires 'critters' package
  },
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_API_URL || 'https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev'}/api/:path*`,
      },
    ];
  },
  // Custom domain configuration
  // Primary: 1319.tryambakam.space
  // Fallback: somatic-canticles.pages.dev
};

export default nextConfig;

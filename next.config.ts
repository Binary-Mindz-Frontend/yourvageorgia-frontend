import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Next.js 16: Cache Components (PPR + use cache) — static shell streamed instantly,
  // dynamic content streams in via Suspense. SPA-like navigation courtesy of <Activity>.
  cacheComponents: true,

  turbopack: {},

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@/components',
      '@/services',
    ],
    turbopackFileSystemCacheForBuild: true,
    // Enable React <ViewTransition> integration. Native View Transitions API.
    viewTransition: true,
  },

  // Image optimization
  images: {
    qualities: [40, 50, 60, 75, 85],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "solenneuae.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.solenneuae.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maps.google.com",
        pathname: "/**",
      },
    ],
  },

  // Enable compression
  compress: true,

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Note: Turbopack handles bundling automatically
  // Webpack config is not needed with Turbopack
};

export default nextConfig;
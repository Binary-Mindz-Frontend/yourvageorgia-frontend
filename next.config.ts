import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@/components',
      '@/services',
    ],
  },

  // IMPORTANT: Empty turbopack config to silence error
  turbopack: {},

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
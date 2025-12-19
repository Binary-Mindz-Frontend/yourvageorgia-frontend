import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // optional if using default
        pathname: "/**", // allow all paths
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.solenneuae.com",
        pathname: "/**",
      },

      {  protocol: "https",
        hostname: "maps.google.com",
        pathname: "/**",
      },
      
    ],
  },
// --- ADD THIS SECTION ---
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/admin/login',
        permanent: true, 
      },
    ];
  },

};

export default nextConfig;

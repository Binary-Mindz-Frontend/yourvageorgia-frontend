import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
     domains: ["localhost"],
 remotePatterns: [
      { protocol: "https", hostname: "d1csarkz8obe9u.cloudfront.net" },
      { protocol: "https", hostname: "i.ibb.co.com" },
      { protocol: "https", hostname: "static.vecteezy.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      
    ],
},


};

export default nextConfig;

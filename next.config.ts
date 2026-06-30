import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to load from Supabase Storage.
    // Replace the wildcard host with your project ref for tighter security,
    // e.g. { protocol: "https", hostname: "abcdefgh.supabase.co" }.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

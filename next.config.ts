import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/**"
      ),
    ],
  },
};

export default nextConfig;

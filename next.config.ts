import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

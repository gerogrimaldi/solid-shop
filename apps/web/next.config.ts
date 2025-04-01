import type { NextConfig } from "next";

// este proxy permite que las peticiones a /api sean redirigidas a http://localhost:8000/api
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Redirige todo lo de /api
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/150',
        search: '',
      },
      {
        protocol: 'https',
        hostname: `${process.env.BUCKET_URL}`,
      },
    ],
  },
};

export default nextConfig;

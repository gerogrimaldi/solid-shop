import type { NextConfig } from "next";

// este proxy permite que las peticiones a /api sean redirigidas a http://localhost:8000/api
const nextConfig = {
  async rewrites() {
    return [
      //Proxys para el backend
      // rutas de next Auth
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      // Rutas de backend Api
      {
        source: "/api/authorization/:path*",
        destination: `${process.env.BACKEND_URL}/authorization/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
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

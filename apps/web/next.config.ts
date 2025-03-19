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
};

export default nextConfig;

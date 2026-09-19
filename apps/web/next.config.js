/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  allowedDevOrigins: ["http://localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;

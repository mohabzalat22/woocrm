/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(appDirectory, "../../.env");

dotenv.config({ path: envPath });

const nextConfig = {
  distDir: "dist",
  allowedDevOrigins: ["http://localhost:3000"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
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

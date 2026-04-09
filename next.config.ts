import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/InvoicePro",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // Tells Next.js to build static HTML/JS files
  images: {
    unoptimized: true,     // Required for static exports on GitHub Pages
  },
  // If your GitHub URL is https://github.io, 
  // uncomment the lines below and insert your repo name:
  // basePath: "/your-repo-name",
};

export default nextConfig;

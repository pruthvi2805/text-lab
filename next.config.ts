import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages deploys to /text-lab/, Cloudflare uses root
  basePath: isGitHubPages ? "/text-lab" : "",
  assetPrefix: isGitHubPages ? "/text-lab/" : "",
  experimental: {
    // Restore scroll position when navigating back/forward
    scrollRestoration: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = 'bietnetwork.org';

// Set base path and asset prefix for GitHub Pages
const basePath = isGithubActions ? `/${repository}` : '';
const assetPrefix = isGithubActions ? `/${repository}/` : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // This enables static exports
  distDir: 'docs', // Output directory for the static export
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true, // Required for static exports
  },
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;

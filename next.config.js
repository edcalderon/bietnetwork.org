/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = 'bietnetwork.org';

// For GitHub Pages, we'll use an empty basePath and assetPrefix
// and handle the repository name in the GitHub Pages settings
const basePath = '';
const assetPrefix = '';

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

// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/biet-network' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/biet-network/' : '',
};

// Remove the basePath and assetPrefix in development
if (process.env.NODE_ENV !== 'production') {
  delete nextConfig.basePath;
  delete nextConfig.assetPrefix;
}

export default nextConfig;

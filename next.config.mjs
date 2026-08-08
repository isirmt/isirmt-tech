/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  images: {
    minimumCacheTTL: 1200,
  },
}

export default nextConfig;

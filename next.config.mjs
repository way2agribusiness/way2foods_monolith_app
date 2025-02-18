/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.way2foods.in/api/:path*', // Add :path* to the destination URL
      },
    ];
  },
};

export default nextConfig;

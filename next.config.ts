/** @type {import('next').NextConfig} */
const nextConfig = {
  // Wymuszamy Webpack zamiast Turbopack
  experimental: {
    webpackBuildWorker: false
  }
};

module.exports = nextConfig;

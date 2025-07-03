/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Suppress NPM-related warnings on client side
    NPM_RC: undefined,
    NPM_TOKEN: undefined,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress specific environment variable warnings
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Only include environment variables that start with NEXT_PUBLIC_ on client side
  publicRuntimeConfig: {},
  serverRuntimeConfig: {},
}

export default nextConfig

import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // Keep tracing rooted on this folder when the monorepo has another lockfile.
  outputFileTracingRoot: path.join(__dirname),
  // This package has no ESLint setup of its own; avoid the parent Nuxt config.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

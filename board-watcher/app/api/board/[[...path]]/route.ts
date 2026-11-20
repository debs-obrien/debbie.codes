import { team } from '@/lib/board'

/** Mount path required by @vercel/board so Vercel can wake this deployment. */
export const GET = team.fetch
export const POST = team.fetch

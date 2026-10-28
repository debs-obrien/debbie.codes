/** Shared contact form limits and enums — used by client and Netlify Function. */

export const CONTACT_FORM_NAME = 'contact'

export const CONTACT_REASONS = ['hiring', 'collaboration', 'speaking', 'other'] as const
export type ContactReason = (typeof CONTACT_REASONS)[number]

export const CONTACT_REASON_LABELS: Record<ContactReason, string> = {
  hiring: 'Hiring',
  collaboration: 'Collaboration',
  speaking: 'Speaking',
  other: 'Something else',
}

export const CONTACT_LIMITS = {
  nameMax: 80,
  emailMax: 254,
  messageMin: 20,
  messageMax: 1000,
  /** Reject bodies larger than this (bytes). */
  bodyMaxBytes: 8 * 1024,
  /** Minimum seconds between challenge issue and submit. */
  minSubmitSeconds: 3,
  /** Challenge older than this is rejected. */
  maxChallengeAgeSeconds: 60 * 60,
  /** Soft warning when message length reaches this. */
  messageNearLimit: 900,
  maxLinks: 3,
  rateLimitBurst: 3,
  rateLimitBurstWindowMs: 10 * 60 * 1000,
  rateLimitDay: 10,
  rateLimitDayWindowMs: 24 * 60 * 60 * 1000,
  rateLimitGlobalDay: 100,
} as const

export const LINKEDIN_URL = 'https://www.linkedin.com/in/debbie-obrien'
export const X_URL = 'https://x.com/debs_obrien'
export const GITHUB_URL = 'https://github.com/debs-obrien'

/** Allowed form field names (extra keys are rejected). */
export const CONTACT_ALLOWED_FIELDS = [
  'form-name',
  'name',
  'email',
  'reason',
  'message',
  'company-website',
  'challenge',
] as const

export type ContactErrorCode
  = | 'validation'
    | 'honeypot'
    | 'timing'
    | 'rate_limit'
    | 'spam'
    | 'payload_too_large'
    | 'method_not_allowed'
    | 'forward_failed'
    | 'blobs_unavailable'
    | 'server_error'

import type { ContactErrorCode, ContactReason } from './constants'
import {
  CONTACT_ALLOWED_FIELDS,
  CONTACT_LIMITS,
  CONTACT_REASONS,
} from './constants'
import { countLinks, looksLikeSpam } from './spam'

export interface ContactFieldErrors {
  name?: string
  email?: string
  reason?: string
  message?: string
}

export interface ContactInput {
  name: string
  email: string
  reason: string
  message: string
  /** Honeypot — must be empty. */
  companyWebsite: string
  challenge: string
}

export interface ContactValidationOk {
  ok: true
  value: {
    name: string
    email: string
    reason: ContactReason
    message: string
  }
}

export interface ContactValidationErr {
  ok: false
  code: ContactErrorCode
  fields?: ContactFieldErrors
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

export function isContactReason(value: string): value is ContactReason {
  return (CONTACT_REASONS as readonly string[]).includes(value)
}

/** Client-side field checks (mirrors server messages). */
export function validateContactFields(input: {
  name: string
  email: string
  reason: string
  message: string
}): ContactFieldErrors {
  const errors: ContactFieldErrors = {}
  const name = input.name.trim()
  const email = input.email.trim()
  const reason = input.reason.trim()
  const message = input.message.trim()

  if (!name)
    errors.name = 'Please add your name.'
  else if (name.length > CONTACT_LIMITS.nameMax)
    errors.name = 'Please keep it under 80 characters.'

  if (!email || !EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.emailMax)
    errors.email = 'That email doesn\'t look right. Check for a typo?'

  if (!reason || !isContactReason(reason))
    errors.reason = 'Please pick what it\'s about.'

  if (!message || message.length < CONTACT_LIMITS.messageMin)
    errors.message = 'Please write a short message.'
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = 'Please keep it under 1000 characters.'

  return errors
}

export function rejectExtraFields(
  keys: Iterable<string>,
): ContactValidationErr | null {
  const allowed = new Set<string>(CONTACT_ALLOWED_FIELDS)
  for (const key of keys) {
    if (!allowed.has(key)) {
      return {
        ok: false,
        code: 'validation',
        message: 'Unexpected fields.',
      }
    }
  }
  return null
}

export function validateContactSubmission(
  input: ContactInput,
): ContactValidationOk | ContactValidationErr {
  if (input.companyWebsite.trim() !== '') {
    return { ok: false, code: 'honeypot', message: 'Rejected.' }
  }

  const fields = validateContactFields(input)
  if (Object.keys(fields).length > 0) {
    return { ok: false, code: 'validation', fields }
  }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const reason = input.reason.trim() as ContactReason
  const message = input.message.trim()

  if (countLinks(message) > CONTACT_LIMITS.maxLinks || looksLikeSpam(message, name, email)) {
    return { ok: false, code: 'spam', message: 'Rejected.' }
  }

  return {
    ok: true,
    value: { name, email, reason, message },
  }
}

/** Parse a raw body object (form or JSON) into ContactInput. */
export function parseContactBody(
  raw: Record<string, unknown>,
): ContactInput {
  const str = (key: string) => {
    const v = raw[key]
    return typeof v === 'string' ? v : ''
  }
  return {
    name: str('name'),
    email: str('email'),
    reason: str('reason'),
    message: str('message'),
    companyWebsite: str('company-website'),
    challenge: str('challenge'),
  }
}

const LINK_RE = /https?:\/\/|www\./gi

const SPAM_PHRASES = [
  'buy now',
  'click here',
  'crypto',
  'viagra',
  'casino',
  'make money fast',
  'seo service',
  'weight loss',
  'free trial',
  'act now',
]

export function countLinks(text: string): number {
  const matches = text.match(LINK_RE)
  return matches ? matches.length : 0
}

export function looksLikeSpam(message: string, name: string, email: string): boolean {
  const lower = message.toLowerCase()
  if (SPAM_PHRASES.some(p => lower.includes(p)))
    return true

  // Extreme ALL CAPS (ignoring short messages)
  const letters = message.replace(/[^a-z]/gi, '')
  if (letters.length >= 40) {
    const caps = message.replace(/[^A-Z]/g, '').length
    if (caps / letters.length > 0.7)
      return true
  }

  // Name that looks like a URL or keyword stuffing
  if (/https?:\/\//i.test(name) || countLinks(name) > 0)
    return true

  // Disposable-looking: too many digits in email local part
  const local = email.split('@')[0] || ''
  const digits = (local.match(/\d/g) || []).length
  if (local.length > 0 && digits / local.length > 0.6 && digits > 5)
    return true

  return false
}

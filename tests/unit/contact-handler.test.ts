import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'vitest'
import { createChallenge } from '../../utils/contact/challenge'
import { CONTACT_LIMITS } from '../../utils/contact/constants'
import {
  handleContactSubmit,
  issueContactChallenge,
  sanitizePlainText,
} from '../../utils/contact/handler'
import {
  createMemoryRateLimitStore,
} from '../../utils/contact/rate-limit'

const SECRET = 'test-secret-hmac'
const IP_SALT = 'test-ip-salt'

function deps(overrides: Partial<Parameters<typeof handleContactSubmit>[0]> = {}) {
  const store = createMemoryRateLimitStore()
  const forwards: Array<{ url: string, body: string }> = []
  const fetchFn = (async (input: RequestInfo | URL, init?: RequestInit) => {
    forwards.push({
      url: String(input),
      body: String(init?.body || ''),
    })
    return new Response(null, { status: 200 })
  }) as typeof fetch

  return {
    deps: {
      secret: SECRET,
      ipSalt: IP_SALT,
      siteOrigin: 'https://example.com',
      rateLimitStore: store,
      fetchFn,
      nowMs: () => 1_700_000_000_000,
      ...overrides,
    },
    forwards,
    store,
  }
}

function validBody(extra: Record<string, string> = {}) {
  const issued = 1_700_000_000_000 - (CONTACT_LIMITS.minSubmitSeconds + 1) * 1000
  const challenge = createChallenge(SECRET, issued)
  return JSON.stringify({
    'form-name': 'contact',
    'name': 'Alex Rivera',
    'email': 'alex@company.com',
    'reason': 'other',
    'message': 'QA test from engineer bot, please ignore this message.',
    'company-website': '',
    'challenge': challenge,
    ...extra,
  })
}

describe('contact handler', () => {
  afterEach(() => {
    // no-op placeholder for future cleanup
  })

  it('issues a challenge on GET', () => {
    const { deps: d } = deps()
    const result = issueContactChallenge(d)
    assert.equal(result.status, 200)
    assert.equal(result.body.ok, true)
    assert.equal(typeof result.body.challenge, 'string')
  })

  it('rejects validation errors with 400 and field codes', async () => {
    const { deps: d } = deps()
    const issued = 1_700_000_000_000 - 5000
    const challenge = createChallenge(SECRET, issued)
    const result = await handleContactSubmit(d, {
      rawBody: JSON.stringify({
        'name': '',
        'email': 'not-an-email',
        'reason': '',
        'message': 'short',
        'company-website': '',
        challenge,
      }),
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'validation')
    assert.ok((result.body.fields as Record<string, string>).name)
    assert.ok((result.body.fields as Record<string, string>).email)
    assert.ok((result.body.fields as Record<string, string>).reason)
    assert.ok((result.body.fields as Record<string, string>).message)
  })

  it('rejects honeypot fills', async () => {
    const { deps: d } = deps()
    const result = await handleContactSubmit(d, {
      rawBody: validBody({ 'company-website': 'http://spam.test' }),
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'honeypot')
  })

  it('rejects too-fast submissions (timing)', async () => {
    const { deps: d } = deps()
    const now = 1_700_000_000_000
    const challenge = createChallenge(SECRET, now) // just issued
    const result = await handleContactSubmit({
      ...d,
      nowMs: () => now + 500,
    }, {
      rawBody: JSON.stringify({
        'name': 'Alex Rivera',
        'email': 'alex@company.com',
        'reason': 'other',
        'message': 'QA test from engineer bot, please ignore this message.',
        'company-website': '',
        'challenge': challenge,
      }),
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'timing')
  })

  it('rejects extra fields', async () => {
    const { deps: d } = deps()
    const issued = 1_700_000_000_000 - 5000
    const challenge = createChallenge(SECRET, issued)
    const result = await handleContactSubmit(d, {
      rawBody: JSON.stringify({
        'name': 'Alex',
        'email': 'alex@company.com',
        'reason': 'other',
        'message': 'QA test from engineer bot, please ignore this message.',
        'company-website': '',
        challenge,
        'unexpected': 'nope',
      }),
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'validation')
  })

  it('rejects oversized bodies', async () => {
    const { deps: d } = deps()
    const big = 'x'.repeat(CONTACT_LIMITS.bodyMaxBytes + 10)
    const result = await handleContactSubmit(d, {
      rawBody: big,
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'payload_too_large')
  })

  it('rejects link spam', async () => {
    const { deps: d } = deps()
    const result = await handleContactSubmit(d, {
      rawBody: validBody({
        message: 'See https://a.com and https://b.com and https://c.com and https://d.com please',
      }),
      contentType: 'application/json',
      clientIp: '1.2.3.4',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'spam')
  })

  it('returns 429 when rate limited', async () => {
    const { deps: d } = deps()
    for (let i = 0; i < CONTACT_LIMITS.rateLimitBurst; i++) {
      const result = await handleContactSubmit(d, {
        rawBody: validBody(),
        contentType: 'application/json',
        clientIp: '9.9.9.9',
      })
      assert.equal(result.status, 200, `submit ${i} should succeed`)
    }
    const blocked = await handleContactSubmit(d, {
      rawBody: validBody(),
      contentType: 'application/json',
      clientIp: '9.9.9.9',
    })
    assert.equal(blocked.status, 429)
    assert.equal(blocked.body.code, 'rate_limit')
  })

  it('forwards accepted submissions to Netlify Forms without echoing HTML', async () => {
    const { deps: d, forwards } = deps()
    const result = await handleContactSubmit(d, {
      rawBody: validBody({
        name: 'Alex <script>alert(1)</script>',
        message: 'QA test from engineer bot, please ignore. <b>hi</b>',
      }),
      contentType: 'application/json',
      clientIp: '5.5.5.5',
    })
    assert.equal(result.status, 200)
    assert.equal(result.body.ok, true)
    assert.equal(result.body.firstName, 'Alex')
    assert.equal(forwards.length, 1)
    assert.equal(forwards[0]!.url, 'https://example.com')
    assert.match(forwards[0]!.body, /form-name=contact/)
    assert.doesNotMatch(forwards[0]!.body, /<script>/)
    assert.doesNotMatch(forwards[0]!.body, /<b>/)
  })

  it('sanitizePlainText strips angle brackets', () => {
    assert.equal(sanitizePlainText('a<b>c'), 'abc')
  })

  it('rejects name longer than 80 and message under 20', async () => {
    const { deps: d } = deps()
    const issued = 1_700_000_000_000 - 5000
    const challenge = createChallenge(SECRET, issued)
    const result = await handleContactSubmit(d, {
      rawBody: JSON.stringify({
        'name': 'N'.repeat(81),
        'email': 'alex@company.com',
        'reason': 'hiring',
        'message': 'too short',
        'company-website': '',
        challenge,
      }),
      contentType: 'application/json',
      clientIp: '1.1.1.1',
    })
    assert.equal(result.status, 400)
    assert.equal(result.body.code, 'validation')
  })
})

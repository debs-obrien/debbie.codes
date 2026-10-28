<script setup lang="ts">
import type { ContactFieldErrors } from '~/utils/contact/validate'
import {
  CONTACT_FORM_NAME,
  CONTACT_LIMITS,
  CONTACT_REASON_LABELS,
  CONTACT_REASONS,
  LINKEDIN_URL,
} from '~/utils/contact/constants'
import { contactApiEndpoint } from '~/utils/contact/endpoint'
import { validateContactFields } from '~/utils/contact/validate'

type FormStatus = 'idle' | 'submitting' | 'success' | 'rate_limited' | 'send_failed'

const route = useRoute()

const name = ref('')
const email = ref('')
const reason = ref('')
const message = ref('')
const companyWebsite = ref('')
const challenge = ref('')

const status = ref<FormStatus>('idle')
const fieldErrors = ref<ContactFieldErrors>({})
const showErrors = ref(false)
const successFirstName = ref('')
const statusMessage = ref('')

const errorSummaryRef = ref<HTMLElement | null>(null)
const successHeadingRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLFormElement | null>(null)

const preselectedHiring = computed(() => {
  const q = String(route.query.reason || '').toLowerCase()
  return q === 'hiring'
})

const errorCount = computed(() => Object.keys(fieldErrors.value).length)

const nameCount = computed(() => name.value.length)
const emailCount = computed(() => email.value.length)
const messageCount = computed(() => message.value.length)

const messageNearLimit = computed(
  () => messageCount.value >= CONTACT_LIMITS.messageNearLimit
    && messageCount.value < CONTACT_LIMITS.messageMax,
)
const messageAtLimit = computed(
  () => messageCount.value >= CONTACT_LIMITS.messageMax,
)
const messageCharsLeft = computed(
  () => CONTACT_LIMITS.messageMax - messageCount.value,
)

const counterLive = computed(() => {
  if (messageNearLimit.value || messageAtLimit.value)
    return `${messageCharsLeft.value} characters left.`
  return ''
})

const isReadOnly = computed(() => status.value === 'submitting')

function applyReasonFromQuery() {
  const q = String(route.query.reason || '').toLowerCase()
  if ((CONTACT_REASONS as readonly string[]).includes(q))
    reason.value = q
}

async function fetchChallenge() {
  try {
    const res = await fetch(contactApiEndpoint(), { method: 'GET' })
    if (!res.ok)
      return
    const data = await res.json() as { challenge?: string }
    if (data.challenge)
      challenge.value = data.challenge
  }
  catch {
    // Challenge will be missing; submit will fail closed on the server.
  }
}

function revalidateIfNeeded() {
  if (!showErrors.value)
    return
  fieldErrors.value = validateContactFields({
    name: name.value,
    email: email.value,
    reason: reason.value,
    message: message.value,
  })
}

watch([name, email, reason, message], revalidateIfNeeded)

watch(() => route.query.reason, () => {
  applyReasonFromQuery()
}, { immediate: true })

onMounted(() => {
  applyReasonFromQuery()
  fetchChallenge()
})

function focusSummary() {
  nextTick(() => {
    errorSummaryRef.value?.focus()
  })
}

async function onSubmit(event: Event) {
  event.preventDefault()
  if (status.value === 'submitting')
    return

  status.value = 'idle'
  showErrors.value = true
  fieldErrors.value = validateContactFields({
    name: name.value,
    email: email.value,
    reason: reason.value,
    message: message.value,
  })

  if (Object.keys(fieldErrors.value).length > 0) {
    focusSummary()
    return
  }

  if (!challenge.value)
    await fetchChallenge()

  status.value = 'submitting'
  statusMessage.value = 'Sending your message'

  const payload = {
    'form-name': CONTACT_FORM_NAME,
    'name': name.value,
    'email': email.value,
    'reason': reason.value,
    'message': message.value,
    'company-website': companyWebsite.value,
    'challenge': challenge.value,
  }

  try {
    const res = await fetch(contactApiEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({})) as {
      ok?: boolean
      code?: string
      fields?: ContactFieldErrors
      firstName?: string
    }

    if (res.status === 429 || data.code === 'rate_limit' || data.code === 'spam' || data.code === 'honeypot') {
      status.value = 'rate_limited'
      statusMessage.value = ''
      await fetchChallenge()
      return
    }

    if (res.status === 400 && data.code === 'validation' && data.fields) {
      status.value = 'idle'
      fieldErrors.value = data.fields
      showErrors.value = true
      focusSummary()
      await fetchChallenge()
      return
    }

    if (res.status === 400 && (data.code === 'timing' || data.code === 'payload_too_large')) {
      status.value = 'rate_limited'
      statusMessage.value = ''
      await fetchChallenge()
      return
    }

    if (!res.ok || !data.ok) {
      status.value = 'send_failed'
      statusMessage.value = ''
      await fetchChallenge()
      return
    }

    successFirstName.value = data.firstName || ''
    status.value = 'success'
    statusMessage.value = successFirstName.value
      ? `Thanks, ${successFirstName.value}. I'll get back to you soon.`
      : 'Thanks. I\'ll get back to you soon.'
    nextTick(() => successHeadingRef.value?.focus())
  }
  catch {
    status.value = 'send_failed'
    statusMessage.value = ''
    await fetchChallenge()
  }
}

function resetForm() {
  name.value = ''
  email.value = ''
  message.value = ''
  companyWebsite.value = ''
  fieldErrors.value = {}
  showErrors.value = false
  successFirstName.value = ''
  status.value = 'idle'
  statusMessage.value = ''
  applyReasonFromQuery()
  fetchChallenge()
  nextTick(() => {
    formRef.value?.querySelector<HTMLInputElement>('#contact-name')?.focus()
  })
}

function fieldDescribedBy(id: string, errorKey: keyof ContactFieldErrors, extra?: string) {
  const parts: string[] = []
  if (extra)
    parts.push(extra)
  if (showErrors.value && fieldErrors.value[errorKey])
    parts.push(`${id}-error`)
  return parts.length ? parts.join(' ') : undefined
}
</script>

<template>
  <div class="contact-form-card" data-testid="contact-form-card">
    <!-- Screen-reader / aria-live status -->
    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ statusMessage }}
    </p>
    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ counterLive }}
    </p>

    <div v-if="status === 'success'" class="contact-success" data-testid="contact-success">
      <div class="contact-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2
        ref="successHeadingRef"
        tabindex="-1"
        class="contact-success-title"
      >
        <template v-if="successFirstName">
          Thanks, {{ successFirstName }}. I'll get back to you soon.
        </template>
        <template v-else>
          Thanks. I'll get back to you soon.
        </template>
      </h2>
      <p class="contact-success-body">
        Your message is with me, and I read every one myself. If it's about a
        role, you can also find me on LinkedIn.
      </p>
      <a
        :href="LINKEDIN_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-btn contact-btn-secondary contact-btn-block"
        aria-label="Message me on LinkedIn (opens in a new tab)"
      >
        <svg class="contact-btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Message me on LinkedIn
      </a>
      <button
        type="button"
        class="contact-text-btn"
        data-testid="contact-send-another"
        @click="resetForm"
      >
        Send another message
      </button>
    </div>

    <template v-else>
      <h2 id="contact-form-heading" class="contact-form-title">
        Send me a message
      </h2>
      <p class="contact-form-intro">
        I read every message myself. Fields marked
        <span aria-hidden="true">*</span> are required.
      </p>

      <p
        v-if="preselectedHiring"
        class="contact-preselect"
        data-testid="contact-preselect-note"
      >
        <span class="contact-preselect-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        </span>
        Coming from my hire-me page? I've picked <strong>Hiring</strong> for you.
      </p>

      <div
        v-if="showErrors && errorCount > 0"
        ref="errorSummaryRef"
        class="contact-banner contact-banner-error"
        role="alert"
        tabindex="-1"
        data-testid="contact-error-summary"
      >
        Please fix {{ errorCount }}
        {{ errorCount === 1 ? 'thing' : 'things' }} below and send it again.
      </div>

      <div
        v-if="status === 'rate_limited'"
        class="contact-banner contact-banner-warn"
        role="alert"
        data-testid="contact-rate-limit"
      >
        <strong>Too many messages from here.</strong>
        Please try again later, or reach me on
        <a :href="LINKEDIN_URL" target="_blank" rel="noopener noreferrer" class="contact-inline-link">LinkedIn</a>.
      </div>

      <div
        v-if="status === 'send_failed'"
        class="contact-banner contact-banner-error"
        role="alert"
        data-testid="contact-send-failed"
      >
        <strong>Sorry, that didn't send.</strong>
        Your message is still here, so you can try again, or message me on
        <a :href="LINKEDIN_URL" target="_blank" rel="noopener noreferrer" class="contact-inline-link">LinkedIn</a>
        instead.
      </div>

      <!--
        Static registration for Netlify Forms (data-netlify + honeypot).
        JS submits to the Netlify Function; no-JS falls back to a plain POST.
      -->
      <form
        ref="formRef"
        name="contact"
        method="POST"
        action="/"
        data-netlify="true"
        data-netlify-honeypot="company-website"
        netlify-honeypot="company-website"
        class="contact-form"
        :class="{ 'contact-form-busy': isReadOnly }"
        data-testid="contact-form"
        novalidate
        @submit="onSubmit"
      >
        <input type="hidden" name="form-name" :value="CONTACT_FORM_NAME">
        <input type="hidden" name="challenge" :value="challenge">

        <div class="sr-only" aria-hidden="true">
          <label for="company-website">Leave this empty</label>
          <input
            id="company-website"
            v-model="companyWebsite"
            name="company-website"
            type="text"
            tabindex="-1"
            autocomplete="off"
            data-testid="contact-honeypot"
          >
        </div>

        <div class="contact-field">
          <div class="contact-label-row">
            <label for="contact-name" class="contact-label">
              Name <span class="contact-req" aria-hidden="true">*</span>
            </label>
            <span
              id="contact-name-count"
              class="contact-counter"
              :class="{ 'contact-counter-error': showErrors && fieldErrors.name }"
            >{{ nameCount }} / {{ CONTACT_LIMITS.nameMax }}</span>
          </div>
          <input
            id="contact-name"
            v-model="name"
            name="name"
            type="text"
            class="contact-input"
            :class="{ 'contact-input-error': showErrors && fieldErrors.name }"
            placeholder="Your name"
            autocomplete="name"
            required
            aria-required="true"
            :maxlength="CONTACT_LIMITS.nameMax"
            :readonly="isReadOnly"
            :aria-invalid="showErrors && !!fieldErrors.name ? 'true' : undefined"
            :aria-describedby="fieldDescribedBy('contact-name', 'name', 'contact-name-count')"
            data-testid="contact-name"
          >
          <p
            v-if="showErrors && fieldErrors.name"
            id="contact-name-error"
            class="contact-field-error"
          >
            {{ fieldErrors.name }}
          </p>
        </div>

        <div class="contact-field">
          <div class="contact-label-row">
            <label for="contact-email" class="contact-label">
              Email <span class="contact-req" aria-hidden="true">*</span>
            </label>
            <span
              id="contact-email-count"
              class="contact-counter"
              :class="{ 'contact-counter-error': showErrors && fieldErrors.email }"
            >{{ emailCount }} / {{ CONTACT_LIMITS.emailMax }}</span>
          </div>
          <input
            id="contact-email"
            v-model="email"
            name="email"
            type="email"
            inputmode="email"
            class="contact-input"
            :class="{ 'contact-input-error': showErrors && fieldErrors.email }"
            placeholder="you@company.com"
            autocomplete="email"
            required
            aria-required="true"
            :maxlength="CONTACT_LIMITS.emailMax"
            :readonly="isReadOnly"
            :aria-invalid="showErrors && !!fieldErrors.email ? 'true' : undefined"
            :aria-describedby="fieldDescribedBy('contact-email', 'email', 'contact-email-count contact-email-help')"
            data-testid="contact-email"
          >
          <p id="contact-email-help" class="contact-help">
            Only used to reply to you.
          </p>
          <p
            v-if="showErrors && fieldErrors.email"
            id="contact-email-error"
            class="contact-field-error"
          >
            {{ fieldErrors.email }}
          </p>
        </div>

        <div class="contact-field">
          <label for="contact-reason" class="contact-label">
            What's it about? <span class="contact-req" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-reason"
            v-model="reason"
            name="reason"
            class="contact-input contact-select"
            :class="{ 'contact-input-error': showErrors && fieldErrors.reason }"
            required
            aria-required="true"
            :disabled="isReadOnly"
            :aria-invalid="showErrors && !!fieldErrors.reason ? 'true' : undefined"
            :aria-describedby="fieldDescribedBy('contact-reason', 'reason')"
            data-testid="contact-reason"
          >
            <option value="" disabled>
              Choose one
            </option>
            <option
              v-for="r in CONTACT_REASONS"
              :key="r"
              :value="r"
            >
              {{ CONTACT_REASON_LABELS[r] }}
            </option>
          </select>
          <p
            v-if="showErrors && fieldErrors.reason"
            id="contact-reason-error"
            class="contact-field-error"
          >
            {{ fieldErrors.reason }}
          </p>
        </div>

        <div class="contact-field">
          <div class="contact-label-row">
            <label for="contact-message" class="contact-label">
              Message <span class="contact-req" aria-hidden="true">*</span>
            </label>
            <span
              id="contact-message-count"
              class="contact-counter"
              :class="{
                'contact-counter-warn': messageNearLimit,
                'contact-counter-error': messageAtLimit || (showErrors && fieldErrors.message),
              }"
            >{{ messageCount }} / {{ CONTACT_LIMITS.messageMax }}</span>
          </div>
          <textarea
            id="contact-message"
            v-model="message"
            name="message"
            class="contact-input contact-textarea"
            :class="{ 'contact-input-error': showErrors && fieldErrors.message }"
            placeholder="Tell me about the role, the team, or what you have in mind."
            rows="6"
            required
            aria-required="true"
            :maxlength="CONTACT_LIMITS.messageMax"
            :readonly="isReadOnly"
            :aria-invalid="showErrors && !!fieldErrors.message ? 'true' : undefined"
            :aria-describedby="fieldDescribedBy('contact-message', 'message', messageNearLimit || messageAtLimit ? 'contact-message-count contact-message-near' : 'contact-message-count')"
            data-testid="contact-message"
          />
          <p
            v-if="messageNearLimit || messageAtLimit"
            id="contact-message-near"
            class="contact-near-limit"
            :class="{ 'contact-field-error': messageAtLimit }"
          >
            <template v-if="messageAtLimit">
              Please keep it under 1000 characters.
            </template>
            <template v-else>
              {{ messageCharsLeft }} characters left.
            </template>
          </p>
          <p
            v-if="showErrors && fieldErrors.message"
            id="contact-message-error"
            class="contact-field-error"
          >
            {{ fieldErrors.message }}
          </p>
        </div>

        <button
          type="submit"
          class="contact-btn contact-btn-primary contact-btn-block"
          :disabled="isReadOnly"
          data-testid="contact-submit"
        >
          <span v-if="status === 'submitting'" class="contact-spinner" aria-hidden="true" />
          {{ status === 'submitting' ? 'Sending…' : 'Send message' }}
        </button>

        <p class="contact-form-footer">
          Prefer LinkedIn?
          <a
            :href="LINKEDIN_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-inline-link contact-tap-link"
          >Message me there.</a>
        </p>
      </form>
    </template>
  </div>
</template>

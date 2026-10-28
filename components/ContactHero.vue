<script setup lang="ts">
import { GITHUB_URL, LINKEDIN_URL, X_URL } from '~/utils/contact-links'
</script>

<template>
  <div class="contact-hero">
    <p class="contact-eyebrow" aria-hidden="true">
      Contact
    </p>
    <h1 class="contact-h1">
      Hiring? Let's talk.
    </h1>
    <p class="contact-lead">
      I'm Debbie, an Independent Developer Educator. I teach developers to build
      with AI agents, MCP and Playwright, and I'm looking for my next role.
      LinkedIn is the quickest way to reach me.
    </p>

    <div class="contact-cta-row">
      <a
        :href="LINKEDIN_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-btn contact-btn-primary"
        aria-label="Message me on LinkedIn (opens in a new tab)"
        data-testid="contact-linkedin-cta"
      >
        <svg class="contact-btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Message me on LinkedIn
      </a>
      <div class="contact-cta-secondary">
        <a
          :href="X_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-btn contact-btn-secondary"
          aria-label="@debs_obrien on X (opens in a new tab)"
          data-testid="contact-x-cta"
        >
          <svg class="contact-btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @debs_obrien
        </a>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-btn contact-btn-secondary"
          aria-label="My GitHub (opens in a new tab)"
          data-testid="contact-github-cta"
        >
          <svg class="contact-btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>

    <aside class="contact-voice-callout" aria-label="Voice assistant on hire-me">
      <span class="contact-voice-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 9a1 1 0 01-1-1v-2.1a7.01 7.01 0 01-1-.2V19a1 1 0 001 1h2a1 1 0 001-1v-2.3c-.33.1-.66.17-1 .22V19a1 1 0 01-1 1z" />
        </svg>
      </span>
      <p class="contact-voice-text">
        <strong>Want the short version first?</strong>
        My hire-me page has a voice assistant that answers questions about my
        work, my numbers and the roles I'm looking for.
        <NuxtLink to="/hire-me" class="contact-inline-link" data-testid="contact-hire-me-link">
          Ask about my work →
        </NuxtLink>
      </p>
    </aside>
  </div>
</template>

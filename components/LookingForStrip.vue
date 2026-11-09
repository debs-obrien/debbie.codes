<template>
  <section class="looking-for" aria-labelledby="looking-for-heading">
    <div class="looking-for-header">
      <h2 id="looking-for-heading" class="looking-for-title">
        What I'm looking for
      </h2>
      <NuxtLink to="/hire-me" class="looking-for-link contact-inline-link">
        See my work and numbers →
      </NuxtLink>
    </div>

    <ul class="looking-for-grid">
      <li class="looking-for-card">
        <span class="looking-for-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        </span>
        <h3 class="looking-for-card-title">
          Roles
        </h3>
        <p class="looking-for-card-text">
          Developer relations and advocacy, developer and product education, and
          developer experience around AI agents, testing and MCP.
        </p>
      </li>
      <li class="looking-for-card">
        <span class="looking-for-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
          </svg>
        </span>
        <h3 class="looking-for-card-title">
          How I work
        </h3>
        <p class="looking-for-card-text">
          Remotely from Spain, with overlap into US hours. I'm not looking to
          relocate.
        </p>
      </li>
      <li class="looking-for-card">
        <span class="looking-for-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
          </svg>
        </span>
        <h3 class="looking-for-card-title">
          Languages and travel
        </h3>
        <p class="looking-for-card-text">
          I work in English and Spanish, and I'm happy to travel to conferences
          and meetups.
        </p>
      </li>
    </ul>
  </section>
</template>

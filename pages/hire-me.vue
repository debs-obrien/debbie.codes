<script setup lang="ts">
import type { HireMePart } from '~/components/HireMeParts.vue'

const config = useRuntimeConfig()
const hireMeAgentId = computed(() => String(config.public.hireMeAgentId || '').trim())
const showVoiceAgent = computed(() => Boolean(hireMeAgentId.value))

const urls = {
  learnAgentSkills: 'https://github.com/debs-obrien/learn-agent-skills',
  moviesApp: 'https://github.com/debs-obrien/playwright-movies-app',
  moviesDemo: 'https://debs-obrien.github.io/playwright-movies-app/',
  playwrightMcp: 'https://github.com/microsoft/playwright-mcp',
  mcpPrompts: 'https://github.com/debs-obrien/playwright-mcp-prompts',
  weatherDemo: 'https://github.com/debs-obrien/mcp-weather-server-demo',
  site: 'https://github.com/debs-obrien/debbie.codes',
  mcpTutorial180k: 'https://www.youtube.com/watch?v=IixdI2bTR1g',
  mcpTutorial140k: 'https://www.youtube.com/watch?v=AaCj939XIQ4',
  mcpWorkshopSpanish: 'https://www.youtube.com/watch?v=erqdtkd1GNg',
} as const

function link(text: string, href: string): HireMePart {
  return { text, href }
}

const mcpTutorialViews: HireMePart[] = [
  'My Playwright MCP tutorials on the official channel passed ',
  link('180K', urls.mcpTutorial180k),
  ' and ',
  link('140K', urls.mcpTutorial140k),
  ' views.',
]

const mcpWorkshopSpanishViews: HireMePart[] = [
  link('A live MCP workshop I co-taught in Spanish', urls.mcpWorkshopSpanish),
  ' has about 16k views.',
]

const stats: Array<string | HireMePart[]> = [
  'Weekly npm downloads of playwright grew from under 1M to over 20M while I led its developer education (May 2022 to Dec 2025).',
  [
    'I pushed for ',
    link('the official Playwright MCP server', urls.playwrightMcp),
    '. It launched on 21 Mar 2025 and got about 5k GitHub stars in roughly its first week. By Dec 2025 it had about 24k stars and about 1M weekly npm downloads. On 27 Oct 2026 it had over 38k stars. It became one of the fastest-adopted parts of Playwright.',
  ],
  'Community channels when I left in Dec 2025: 44K LinkedIn followers, 18K Discord members and 27K YouTube subscribers. Playwright\'s dev.to posts reached 269K views.',
  'I ran a Playwright ambassador program with 10 people in 5 countries and 4 languages.',
  'Developer feedback led to accessible locators shipping in v1.27 within three weeks (7 Oct 2022), and later shaped UI Mode in v1.32.',
  mcpTutorialViews,
  mcpWorkshopSpanishViews,
  'I have spoken at conferences since 2018 and gave 20+ conference talks and workshops as Playwright\'s external voice.',
  'I wrote 55 pages of end-user docs with 59 screenshots in four days, using an AI agent and three agent skills I built.',
  [
    'I still maintain a teaching demo app I built, ',
    link('playwright-movies-app', urls.moviesApp),
    '. It has over 100 GitHub stars.',
  ],
]

const experience = [
  'I have been an Independent Developer Educator since Oct 2026.',
  'I was Platform Engineer, Applied AI, at Zephyr from Apr 2026 to Sep 2026.',
  'I was Senior Staff Developer Relations Engineer, Applied AI, at Block in Feb 2026.',
  'I led Playwright developer education and community at Microsoft from May 2022 to Dec 2025. The Playwright Ambassador program later became part of the Microsoft MVP program.',
  'I was Head of Developer Advocacy at Bit in 2021, leading advocacy strategy and content and growing the community through talks, demos and educational content.',
  'I was Developer Advocate at Nuxt from 2020 to 2021, covering content, talks, community, courses and videos for the Nuxt ecosystem.',
  'Earlier I worked as a tech lead, consultant and educator from 2008 to 2020 on frontend and performance, leading teams, delivering workshops, and teaching at Vue School and Jamstack Explorers.',
]

const recruiterQuestions: Array<{ question: string, answer: Array<string | HireMePart[]> }> = [
  {
    question: 'Tell me about yourself',
    answer: [
      [
        'I\'m an Independent Developer Educator in Palma, Spain. I teach AI coding agents, MCP and agent skills through my site, YouTube, an open source ',
        link('learn-agent-skills', urls.learnAgentSkills),
        ' repo, talks and live workshops.',
      ],
      'Before that I led developer education and community for Playwright for three and a half years. Weekly downloads grew from under 1M to over 20M during that time. I pushed for the official Playwright MCP server and taught it to developers.',
      'After that I worked in applied AI, first in developer relations and then in platform engineering, where I built a Playwright agent inside a company\'s AI platform. It drives Playwright over CDP, takes test requests in the app, runs them in an embedded browser and returns an HTML report and trace.',
      'I\'ve spoken at conferences since 2018, in English and Spanish.',
    ],
  },
  {
    question: 'What are you looking for?',
    answer: [
      'I care about developers getting unstuck on real work, and I teach by building. I want to turn agentic AI into practical guidance builders can use on Monday: narrow tools, clear contracts and honest failure modes. Then I want to bring what I hear from developers back into the product. My bar is whether a builder ships faster.',
    ],
  },
  {
    question: 'Tell me about a program you owned end to end',
    answer: [
      'Playwright release videos used to be recorded after a release shipped, so bugs showed up on camera after users already had them. In early 2023 I wrote a release video strategy that changed the order. We recorded first, got a technical check, reported bugs, re-recorded and then posted to social. I also listed what every release video must include. My manager signed off, and the whole team followed that process. Recording first caught many bugs before users hit them.',
      'I also built the Playwright ambassador program from the start. More on that below.',
    ],
  },
  {
    question: 'Tell me about a time you did more with less',
    answer: [
      'I needed 55 pages of end-user documentation with screenshots and had no docs team. I built three reusable agent skills and worked with an AI agent to write 55 pages with 59 screenshots in four days.',
    ],
  },
  {
    question: 'Tell me about a time you disagreed with a team',
    answer: [
      'Community Playwright MCP servers already existed, and people inside the company kept asking me which one to use. The core engineers didn\'t think we needed MCP. Over several meetings I brought the community servers, the internal questions and the risk of giving no answer. I framed it as a choice for the team, not a demand. When interest stayed low, I built a demo with a Blender MCP server where an agent made a leprechaun with a rainbow and a pot of gold.',
      'The team agreed, then built and shipped the official Playwright MCP on 21 Mar 2025. It got about 5k GitHub stars in roughly its first week. I own the push and the early demos, not every star. What I learned is that with engineers, a working demo beats a slide deck.',
    ],
  },
  {
    question: 'Tell me about a time you failed',
    answer: [
      'I once led a team of engineers and failed that room at first. They talked over me and ignored my decisions, because I was defending my idea before I had heard theirs. I asked my manager to sit in. They coached me to listen first, stand up when it mattered, and guide the team so they felt ownership while I still set the direction. After that I ran those meetings on my own, and I still lead that way when a room gets loud or stuck.',
    ],
  },
  {
    question: 'How have you turned developer feedback into product changes?',
    answer: [
      'At a conference in Sep 2022 I sat with a well-known testing educator while he tried Playwright for the first time. He wanted role-based accessible locators and a visual UI mode. He also went looking for a plugin for a web server feature we already had, which showed me we weren\'t telling people about what had shipped.',
      'The week I got back I took his feedback to the engineers and got him talking to the team directly. Accessible locators shipped in v1.27 less than three weeks later, on 7 Oct 2022. UI Mode followed in v1.32. The web server got its own docs page, and he later became a Playwright ambassador.',
    ],
  },
  {
    question: 'How do you grow people you don\'t manage?',
    answer: [
      'I built the Playwright ambassador program. The ambassadors didn\'t report to me. I picked people already teaching in their own communities and languages, gave them a stage and direct feedback, and nominated them for recognition. The public roster reached 10 ambassadors in 5 countries and 4 languages. Several went on to write books and courses. One ambassador in Argentina now teaches Playwright in Spanish across South America. The program later became part of a larger, long-running developer recognition program, which let us grow more Playwright ambassadors and reach a much wider community.',
    ],
  },
  {
    question: 'How do you learn something new fast enough to teach it?',
    answer: [
      [
        'When MCP was brand new, I built and broke MCP servers myself before writing a single slide. Then I co-taught ',
        link('a live beginner workshop in Spanish', urls.mcpWorkshopSpanish),
        '. We covered the mental model first, then real server demos, then a live build of ',
        link('a weather MCP server', urls.weatherDemo),
        ' that viewers could copy in about 20 minutes. The recording has about 16k views.',
      ],
    ],
  },
  {
    question: 'What have you kept going after a job changed?',
    answer: [
      [
        'I built ',
        link('playwright-movies-app', urls.moviesApp),
        ' as a teaching demo in Jan 2025. When I moved on, its cloud backend was no longer available, so I replaced it with a mock API and a simple hosted login. The live demo and the learn site still work, and the repo has over 100 stars.',
      ],
    ],
  },
]

const moreQuestions: Array<{ question: string, answer: Array<string | HireMePart[]> }> = [
  {
    question: 'What kind of reach can you bring?',
    answer: [
      'When I left Playwright in Dec 2025, the community channels had 44K LinkedIn followers, 18K Discord members and 27K YouTube subscribers, and Playwright\'s dev.to posts had 269K views. Those are community numbers I helped build, not my personal following.',
    ],
  },
  {
    question: 'How do you know your content lands?',
    answer: [
      [
        'I look at what people watch and use. My Playwright MCP tutorials on the official channel passed ',
        link('180K', urls.mcpTutorial180k),
        ' and ',
        link('140K', urls.mcpTutorial140k),
        ' views. ',
        link('A live MCP workshop I co-taught in Spanish', urls.mcpWorkshopSpanish),
        ' has about 16k views. A demo app I built for teaching has over 100 GitHub stars and still runs.',
      ],
    ],
  },
  {
    question: 'Can you get developers to adopt something new?',
    answer: [
      'The official Playwright MCP server got about 5k GitHub stars in roughly its first week. By Dec 2025 it had about 24k stars and about 1M weekly npm downloads, and on 27 Oct 2026 it had over 38k stars. I pushed for it and made the launch tutorials, demos and workshops. The engineers built it.',
    ],
  },
  {
    question: 'What growth have you been part of?',
    answer: [
      'While I led developer education and community for Playwright, from May 2022 to Dec 2025, weekly npm downloads of the playwright package grew from under 1M to over 20M. That\'s the whole ecosystem, not my personal credit. My part was the docs, videos, talks, workshops, community and ambassador program around it.',
    ],
  },
  {
    question: 'Can you build a community that grows beyond you?',
    answer: [
      'Yes. The Playwright ambassador program reached 10 people in 5 countries and 4 languages: English, Spanish, French and Hebrew. Each ambassador teaches in their own community and language, so the program reaches people I couldn\'t reach alone.',
    ],
  },
  {
    question: 'How fast can you get feedback to the engineering team?',
    answer: [
      'The week I got back from a conference, I took one developer\'s feedback to the engineers. Accessible locators shipped in v1.27 less than three weeks later. A visual UI Mode followed in v1.32.',
    ],
  },
]

const projects: Array<string | HireMePart[]> = [
  [
    link('learn-agent-skills', urls.learnAgentSkills),
    ', an open source repo for learning agent skills.',
  ],
  [
    link('playwright-movies-app', urls.moviesApp),
    ', a teaching demo app I still maintain ',
    link('(live demo)', urls.moviesDemo),
    '.',
  ],
  [
    link('playwright-mcp-prompts', urls.mcpPrompts),
    ', a collection of Playwright MCP prompt files for automated and manual testing.',
  ],
  [
    link('mcp-weather-server-demo', urls.weatherDemo),
    ', the weather MCP server from my live workshop.',
  ],
  [
    link('This site, built with Nuxt and Nuxt Content, is open source', urls.site),
    '.',
  ],
  'An agent that explores a real desktop app every hour with Playwright and files bug reports for a second agent to fix.',
  'Small voice projects: a release-video agent skill that narrates in my cloned voice, a two-voice podcast made from one of my blog posts, and an earlier voice assistant for a course.',
]

const askExamples = [
  'What has Debbie done with Playwright and MCP?',
  'What roles is she looking for?',
  'What results has she had with developer content?',
]

const widgetActionText = 'Ask about Debbie'
const widgetStartCallText = 'Start a call'
const widgetEndCallText = 'End call'

useHead(() => ({
  title: 'Hire me',
  meta: [
    {
      name: 'description',
      content: 'I\'m Debbie, an Independent Developer Educator in Palma, Spain. I teach developers to build with AI agents, MCP and Playwright.',
    },
  ],
  script: showVoiceAgent.value
    ? [{
        src: 'https://unpkg.com/@elevenlabs/convai-widget-embed',
        async: true,
        type: 'text/javascript',
      }]
    : [],
}))
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
      Hire me
    </h1>

    <div class="prose dark:prose-invert max-w-none space-y-4 mb-10">
      <p>
        I'm Debbie, an Independent Developer Educator in Palma, Spain. I teach developers to build with AI agents, MCP and Playwright, and I build it myself first.
      </p>
      <p>
        For three and a half years I led developer education and community for Playwright. During that time weekly npm downloads of the playwright package grew from under 1M to over 20M. I pushed for the official Playwright MCP server and taught it through docs, videos, talks and workshops.
      </p>
      <p>
        I treat developer education like a product. Docs, videos, workshops, talks and an ambassador program all feed back into the tool, and developer feedback has shipped as features within weeks. Today I teach AI coding agents, MCP and agent skills on this site, on YouTube, in my open source
        <a
          :href="urls.learnAgentSkills"
          rel="noopener"
          class="text-primary font-medium hover:underline"
        >learn-agent-skills</a>
        repo and in live workshops in English and Spanish.
      </p>
      <p>
        I meet developers where they are, in their editors, coding agents and frameworks. I live in the product. I build the demo, then teach from what actually worked.
      </p>
      <p>
        There is a voice assistant on this page. It answers from the questions and numbers below.
      </p>
    </div>

    <section
      v-if="showVoiceAgent"
      class="mb-12"
      aria-labelledby="hire-me-assistant-heading"
    >
      <h2
        id="hire-me-assistant-heading"
        class="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white"
      >
        Ask about Debbie
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        A voice assistant that answers questions from recruiters, hiring managers and future teammates about my work, numbers and the roles I'm looking for. It needs your microphone.
      </p>
      <p class="font-semibold text-gray-900 dark:text-white mb-2">
        Try asking:
      </p>
      <ul class="list-disc pl-5 mb-6 space-y-1 text-gray-700 dark:text-gray-200">
        <li v-for="example in askExamples" :key="example">
          {{ example }}
        </li>
      </ul>
      <ClientOnly>
        <elevenlabs-convai
          :agent-id="hireMeAgentId"
          :action-text="widgetActionText"
          :start-call-text="widgetStartCallText"
          :end-call-text="widgetEndCallText"
        />
      </ClientOnly>
    </section>

    <section class="mb-12" aria-labelledby="numbers-heading">
      <h2
        id="numbers-heading"
        class="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white"
      >
        Numbers at a glance
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        These are team and community numbers from my time on each project. I was part of the growth. I don't claim all of it.
      </p>
      <ul class="grid gap-4 sm:grid-cols-2">
        <li
          v-for="(stat, index) in stats"
          :key="index"
          class="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200"
        >
          <HireMeParts :content="stat" />
        </li>
      </ul>
    </section>

    <section
      class="mb-12"
      aria-labelledby="experience-heading"
      data-testid="hire-me-experience"
    >
      <h2
        id="experience-heading"
        class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
      >
        Experience
      </h2>
      <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
        <li v-for="(item, index) in experience" :key="index">
          {{ item }}
        </li>
      </ul>
    </section>

    <div data-testid="hire-me-questions">
      <section class="mb-12" aria-labelledby="recruiter-qa-heading">
        <h2
          id="recruiter-qa-heading"
          class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          Questions from recruiters, hiring managers and future teammates
        </h2>
        <ul class="space-y-3">
          <li v-for="item in recruiterQuestions" :key="item.question">
            <details class="group border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 open:bg-white dark:open:bg-gray-800">
              <summary class="cursor-pointer list-none px-4 py-3 font-semibold text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {{ item.question }}
              </summary>
              <div class="px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p v-for="(paragraph, index) in item.answer" :key="index">
                  <HireMeParts :content="paragraph" />
                </p>
              </div>
            </details>
          </li>
        </ul>
      </section>

      <section class="mb-12" aria-labelledby="more-qa-heading">
        <h2
          id="more-qa-heading"
          class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          More questions people ask before hiring me
        </h2>
        <ul class="space-y-3">
          <li v-for="item in moreQuestions" :key="item.question">
            <details class="group border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 open:bg-white dark:open:bg-gray-800">
              <summary class="cursor-pointer list-none px-4 py-3 font-semibold text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {{ item.question }}
              </summary>
              <div class="px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p v-for="(paragraph, index) in item.answer" :key="index">
                  <HireMeParts :content="paragraph" />
                </p>
              </div>
            </details>
          </li>
        </ul>
      </section>
    </div>

    <section class="mb-12" aria-labelledby="projects-heading">
      <h2
        id="projects-heading"
        class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
      >
        Projects
      </h2>
      <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
        <li v-for="(item, index) in projects" :key="index">
          <HireMeParts :content="item" />
        </li>
      </ul>
    </section>

    <section class="mb-12" aria-labelledby="roles-heading">
      <h2
        id="roles-heading"
        class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
      >
        Roles I'm looking for
      </h2>
      <p class="text-gray-700 dark:text-gray-200 leading-relaxed">
        Developer relations and developer advocacy, developer and product education, and developer experience around AI agents, testing and MCP. I work remotely from Palma, Spain, can overlap with US hours, travel to conferences and meetups, and speak English and Spanish.
      </p>
    </section>

    <section class="mb-4" aria-labelledby="contact-heading">
      <h2
        id="contact-heading"
        class="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
      >
        Get in touch
      </h2>
      <p class="text-gray-700 dark:text-gray-200 leading-relaxed">
        If you'd like to talk,
        <NuxtLink to="/contact" class="text-primary font-medium hover:underline">
          get in touch through my contact page
        </NuxtLink>.
        You can also
        <NuxtLink to="/videos" class="text-primary font-medium hover:underline">
          watch me teach
        </NuxtLink>
        or
        <NuxtLink to="/about" class="text-primary font-medium hover:underline">
          read more about me
        </NuxtLink>.
      </p>
    </section>
  </main>
</template>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}

summary::before {
  content: '+';
  display: inline-block;
  width: 1.25rem;
  margin-right: 0.5rem;
  color: var(--color-primary);
  font-weight: 700;
}

details[open] > summary::before {
  content: '−';
}
</style>

<!--
  Mobile: reserve space for the fixed voice widget (sheet + small footer)
  so the last page content and site footer are not covered. Widget stays visible.
-->
<style>
@media (max-width: 639px) {
  body:has(elevenlabs-convai) {
    padding-bottom: 10rem;
  }
}
</style>

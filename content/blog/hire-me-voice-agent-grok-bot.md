---
title: "I Gave My Hire Me Page a Voice with Grok Bot and ElevenLabs"
date: 2026-10-27
description: "I built a hire me page that answers what recruiters, hiring managers and future teammates ask, and Grok Bot set up a voice agent on it that answers out loud from the same facts."
tags: [ai, agents, grok-bot]
published: true
image: /images/blog/covers/hire-me-voice-agent-grok-bot.png
ogImage: /images/blog/covers/hire-me-voice-agent-grok-bot.png
---

I've been doing lots of interviews lately, and the same questions keep coming up.

I lose a lot of time when hiring managers and recruiters are on calls asking me the same things, when the information is already online.

So the idea is that someone looking to hire me can read this page and get the insight they need. Then the call with the recruiter can focus on their questions, their doubts and the process.

I added the voice agent because nobody reads the whole page. You want to sift through it. So you can ask, in your own voice, about something specific, like MCP or AI agents, and the agent answers based on the content I've provided. It's true to what I would say.

I think it's a nice way to improve the hiring process. More people are applying with AI, and recruiters have endless CVs to get through. Personal time is valuable. So if you had an agent that could review, and I have an agent that can receive, one agent is talking to the other. It sounds crazy, but it saves time. And I want a company to know quickly if I'm a good fit or not.

I'd do the same on their company website, researching the culture and whether the role is a fit. So why not let agents take on the repetitive stuff and automate it, so the human call is more valuable?

I'm just testing things out, so give it a try and tell me what you think. I'd love your feedback. Just don't burn all my credits, because it costs per call, and please don't all call at once.

Think about the possibilities beyond customer service call agents. How can we give humans time back, improve processes, and use voice AI agents to help with the things we struggle with?

![The top of my hire me page on desktop, with the intro.](/images/blog/hire-me-voice-agent-grok-bot/01-desktop-hero.png)

## Why I built a hire me page

I have been independent since October 2026 and I'm looking for my next role in developer relations and developer advocacy, developer and product education, and developer experience around AI agents, testing and MCP.

A CV doesn't answer the follow up questions. What did you actually do on that project? What numbers can you back up? What are you looking for next?

I also teach AI agents. So it made sense for the page itself to show an agent built carefully, with clear rules, honest numbers and an assistant that says it's an AI assistant.

The page is live at [debbie.codes/hire-me](https://debbie.codes/hire-me), and "Hire me" is now in the main menu.

![The site menu with Hire me at the end.](/images/blog/hire-me-voice-agent-grok-bot/02-desktop-nav.png)

![The mobile menu with Hire me.](/images/blog/hire-me-voice-agent-grok-bot/03-mobile-menu.png)

## What's on the page

The page is one long read, written in my own words:

- A short intro about who I am and what I teach.
- **Ask about Debbie**, the voice assistant, with three questions you can try.
- **Numbers at a glance**, 10 cards with team and community numbers. I say plainly on the page that I was part of the growth and I don't claim all of it.
- **Experience**, my roles over the years. This is the only part that names the companies I've worked for.
- 16 common questions with real answers, split into "Questions from recruiters, hiring managers and future teammates" and "More questions people ask before hiring me". Each one opens when you click it.
- **Projects** with links to my open source work.
- **Roles I'm looking for** and **Get in touch**, which points to my [contact page](https://debbie.codes/contact).

I didn't repeat all the numbers here. They live on the page, so go and [read them there](https://debbie.codes/hire-me).

![The Experience section with my roles.](/images/blog/hire-me-voice-agent-grok-bot/04-desktop-experience.png)

![The questions section with the first answer open.](/images/blog/hire-me-voice-agent-grok-bot/05-desktop-questions.png)

## Meet "Ask about Debbie"

On the page there's a voice assistant called "Ask about Debbie". You press "Start a call", allow your microphone, and ask a question out loud. It answers out loud from the same facts that are on the page.

When you start a call it says: "Hi, I'm Debbie's assistant. I can tell you about Debbie's work, her numbers, and the roles she's looking for. What would you like to know?"

It uses a premade voice called Alice, not a clone of my voice. If you ask whether it's me, it tells you it's my AI assistant. It talks about me in the third person and keeps its answers short, because nobody wants a list read out to them. A call can last up to 10 minutes.

You can try one of the suggested questions:

- What has Debbie done with Playwright and MCP?
- What roles is she looking for?
- What results has she had with developer content?

![The Ask about Debbie section with three questions to try and the voice widget in the corner.](/images/blog/hire-me-voice-agent-grok-bot/06-desktop-widget.png)

## The rules I gave it, and why

An assistant that talks about you to people who might hire you needs clear rules. These are the ones I care about most:

- **It only answers from what it knows.** All of its facts come from the same content as the page. If you ask something that isn't there, it says it doesn't have that and points you to my contact page.
- **It never makes up a number.** No estimating and no rounding up. Growth numbers are team and community numbers, the same framing as the page.
- **It's honest about what it is.** It's my AI assistant, not me.
- **Some topics are for a real conversation.** It politely declines questions about salary, other job processes, why a role ended, health, family or my personal life, and points you to my contact page instead.
- **No promises.** It won't commit to availability, start dates or contract terms. That's a conversation for me.
- **It's told to keep its rules** even if someone tries to talk it out of them.

## How I built it

I didn't build this one on my own. I worked with my Grok Bot.

### What Grok Bot did

- **The page.** Grok Bot drafted the page content and I edited it until it sounded like me. The code was written by Cursor cloud agents that Grok Bot launched and reviewed, in [PR #674](https://github.com/debs-obrien/debbie.codes/pull/674) and [PR #675](https://github.com/debs-obrien/debbie.codes/pull/675). I approved the merges. You can also just [visit the live page](https://debbie.codes/hire-me).
- **The spec.** Grok Bot wrote a Markdown spec for the agent with two parts: the first message and the system prompt. The facts in the prompt were written from the same notes as the page.
- **The agent.** Grok Bot created the agent from that spec through the ElevenLabs Agents API, then set the allowed site and the widget labels through the API too. I reviewed it and told it what to change.

![The agent in the ElevenLabs dashboard with the start of the system prompt, the first message, the Alice voice and English. The model name is blurred.](/images/blog/hire-me-voice-agent-grok-bot/09-elevenlabs-agent-overview.png)

### How the agent gets its data

Everything the agent knows is in its system prompt, about 9,000 characters, built from the facts on the page. There's no knowledge base and there are no tools. Every rule lives in the prompt too. ElevenLabs has its own built-in guardrails, but I have them turned off, so the prompt is the only place the rules come from.

![The "Never do these" rules in the system prompt.](/images/blog/hire-me-voice-agent-grok-bot/10-elevenlabs-prompt-rules.png)

That also means there's no automatic sync. When the page changes, the prompt has to change by hand. On the day I built it, the prompt and first message were edited six times, and each edit matched a change on the page:

1. I took a story out of the page, so it came out of the prompt too.
2. I stopped naming a program on the page, so the prompt stopped naming it.
3. I removed a time frame from one of the stories, on the page and in the prompt.
4. I removed an extra sentence from the first message, and a matching line at the start of the prompt, that labelled the assistant in a way I didn't want.
5. I widened the audience to recruiters, hiring managers and future teammates.
6. I reworded the line describing an earlier course assistant, on the page and in the prompt.

### How I tested it

Honestly, the testing was thin. The agent's history shows 3 test calls: an 80 second voice call, a 60 second voice call and a 14 second typed chat.

- In the first call it gave my Playwright MCP numbers exactly as they are in the prompt, and when it was asked whether it would hire me, it said it's just my assistant and pointed to my contact page.
- In the second call it was asked about a specific company, and it didn't talk about specific companies.
- The typed chat asked about my voice agent work. It answered with wording I changed later on the page and in the prompt.

The site itself has Playwright tests that run in CI. They check that the page renders and that certain words never appear on it, and that "Hire me" is in the menus and the sitemap.

I haven't tested every rule in a real call yet, so treat the rules above as what the agent is told to do.

### The embed

The page uses the ElevenLabs web widget. My site is built with Nuxt, so the widget sits inside `<ClientOnly>` and the widget script is only added on the hire me page. The Nuxt config also marks `elevenlabs-convai` as a custom element so Vue doesn't try to treat it as a component.

Here's a simplified version of the embed:

```vue
<ClientOnly>
  <elevenlabs-convai
    :agent-id="hireMeAgentId"
    action-text="Ask about Debbie"
    start-call-text="Start a call"
    end-call-text="End call"
  />
</ClientOnly>
```

- **Locking it down.** The widget needs a public agent, so the agent is locked to debbie.codes with an allowlist.
- **Mobile.** On phones the widget floats at the bottom of the screen and doesn't cover the footer.

![The Security settings with authentication off and debbie.codes as the only host on the allowlist.](/images/blog/hire-me-voice-agent-grok-bot/11-elevenlabs-allowlist.png)

The widget shows a small "Powered by ElevenAgents" line, and I'm keeping it.

![The widget text settings with Ask about Debbie, Start a call and End call, and a preview of the widget.](/images/blog/hire-me-voice-agent-grok-bot/12-elevenlabs-widget-labels.png)

### Privacy settings

- Visitors can't upload files to the agent.
- Call audio isn't stored.
- Transcripts are kept for 30 days.

![The hire me page on a phone.](/images/blog/hire-me-voice-agent-grok-bot/07-mobile-top.png)

![On a phone the widget sits below the footer instead of covering it.](/images/blog/hire-me-voice-agent-grok-bot/08-mobile-widget.png)

## What are ElevenLabs Agents

ElevenAgents is the ElevenLabs platform for building agents that talk with people. The [overview docs](https://elevenlabs.io/docs/eleven-agents/overview) describe an agent as four parts working together: a speech to text model, a language model you choose, a text to speech model, and a turn taking model that handles the timing of the conversation.

You can configure an agent in the dashboard, with their CLI or through the API, and then put it on the web, in a mobile app or on a phone line. For websites there's a widget you can drop into any page.

## How to get started building one

These steps follow the official docs:

1. **Create an agent.** Sign in and create a new agent in the dashboard. The [quickstart](https://elevenlabs.io/docs/eleven-agents/quickstart) walks you through it.
2. **Write the first message and the system prompt.** The first message is what the agent says when a call starts. The system prompt guides what it does and how it behaves. The [prompting guide](https://elevenlabs.io/docs/eleven-agents/best-practices/prompting-guide) has tips. My tip: put the facts in the prompt, tell it never to invent a number, and tell it to say it's an AI assistant.
3. **Pick a voice and test it.** Choose a voice, then test the agent in the dashboard before it goes anywhere near your site.
4. **Add the widget to your site.** Add the `<elevenlabs-convai>` element with your agent's ID and the widget script to your page. The [widget docs](https://elevenlabs.io/docs/eleven-agents/customization/widget) show the code and all the options, like changing the button text.
5. **Lock it down.** The widget needs a public agent, so add your site to the agent's allowlist. The [authentication docs](https://elevenlabs.io/docs/eleven-agents/customization/authentication) say you can add up to 10 hostnames.
6. **Check your privacy settings.** The [privacy docs](https://elevenlabs.io/docs/eleven-agents/customization/privacy) cover how long transcripts are kept and whether call audio is saved.
7. **Optional: manage it from code.** If you want your agent in version control or want an AI agent to set it up for you, like I did with Grok Bot, you can use the Agents API to [get](https://elevenlabs.io/docs/api-reference/agents/get) and [update](https://elevenlabs.io/docs/api-reference/agents/update) an agent.

## What I learned

- **Keep the agent's facts the same as the page.** Today there's no automatic sync, so when the page changes, the prompt has to change too.
- **Rules are product decisions.** No salary talk, no company names in the answers and "I'm her AI assistant" were all choices about how I want to come across.
- **Honest numbers beat big numbers.** Saying "I was part of the growth" is better than claiming all of it.
- **Accept the vendor's branding.** The "Powered by" line stays.
- **Test the questions people might worry about.** Before you share your own agent, ask it about salary, ask if it's you, ask something that isn't on the page, and check what it says.

## Try it

Go to [debbie.codes/hire-me](https://debbie.codes/hire-me), press "Start a call" and ask one of the suggested questions. And if you'd like to talk to the real me, [get in touch](https://debbie.codes/contact).

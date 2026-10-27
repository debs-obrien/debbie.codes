---
title: "I Gave My Hire Me Page a Voice with Grok Bot and ElevenLabs"
date: 2026-10-27
description: "I built a hire me page that answers what recruiters, hiring managers and future teammates ask, and Grok Bot set up a voice agent on it that answers out loud from the same facts."
tags: [ai, agents, grok-bot]
published: true
image: /images/blog/covers/hire-me-voice-agent-grok-bot.png
ogImage: /images/blog/covers/hire-me-voice-agent-grok-bot.png
---

Recruiters, hiring managers and future teammates ask me the same questions in every first call. So I answered them once, on one page, and then I gave that page a voice.

![The top of my hire me page on desktop, with the intro.](/images/blog/hire-me-voice-agent-grok-bot/01-desktop-hero.png)

## Why I built a hire me page

I have been independent since October 2026 and I'm looking for my next role in developer relations and developer advocacy, developer and product education, and developer experience around AI agents, testing and MCP.

A CV doesn't answer the follow up questions. What did you actually do on that project? What numbers can you back up? What are you looking for next? The same questions come up every time, so one page with honest answers saves everyone time.

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
- **It keeps its rules** even if someone tries to talk it out of them.

## How I built it

I didn't build this one on my own. I worked with my Grok Bot.

- **The page.** Grok Bot drafted the page content and I edited it until it sounded like me. The code was written by Cursor cloud agents that Grok Bot launched and reviewed, in [PR #674](https://github.com/debs-obrien/debbie.codes/pull/674) and [PR #675](https://github.com/debs-obrien/debbie.codes/pull/675). I approved the merges. You can also just [visit the live page](https://debbie.codes/hire-me).
- **The agent.** Grok Bot created and set up the voice agent through the ElevenLabs Agents API, from a Markdown spec with the first message and system prompt, then set the allowed site and widget labels through the API. I reviewed it and told it what to change.
- **The prompt.** All of the agent's facts live in its system prompt, about 9,000 characters. There are no knowledge base documents and no tools. The prompt tells it to answer only from that knowledge section.
- **The embed.** The page uses the ElevenLabs web widget. My site is built with Nuxt, so the widget sits inside `<ClientOnly>` and the widget script is only added on the hire me page. The Nuxt config also marks `elevenlabs-convai` as a custom element so Vue doesn't try to treat it as a component.

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

- **Locking it down.** The widget needs a public agent, so the agent has an allowlist set to debbie.codes only. Other websites can't embed it.
- **Mobile.** On phones the widget floats at the bottom of the screen and doesn't cover the footer.

The widget shows a small "Powered by ElevenAgents" line, and I'm keeping it.

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
6. **Check your privacy settings.** The [privacy docs](https://elevenlabs.io/docs/eleven-agents/customization/privacy) cover how long transcripts and call recordings are kept.
7. **Optional: manage it from code.** If you want your agent in version control or want an AI agent to set it up for you, like I did with Grok Bot, you can use the Agents API to [get](https://elevenlabs.io/docs/api-reference/agents/get) and [update](https://elevenlabs.io/docs/api-reference/agents/update) an agent.

## What I learned

- **Keep the agent's facts the same as the page.** Today there's no automatic sync, so when the page changes, the prompt has to change too.
- **Rules are product decisions.** No salary talk, no company names in the answers and "I'm her AI assistant" were all choices about how I want to come across.
- **Honest numbers beat big numbers.** Saying "I was part of the growth" is better than claiming all of it.
- **Accept the vendor's branding.** The "Powered by" line stays.
- **Test the questions you're scared of.** Ask about salary, ask if it's me, ask something that isn't on the page, and check what it says.

## Try it

Go to [debbie.codes/hire-me](https://debbie.codes/hire-me), press "Start a call" and ask one of the suggested questions. And if you'd like to talk to the real me, [get in touch](https://debbie.codes/contact).

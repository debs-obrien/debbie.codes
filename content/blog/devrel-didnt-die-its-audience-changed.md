---
title: "DevRel Didn't Die, Its Audience Changed"
date: 2026-11-02
description: "Most evenings I put my agents to the test. I'm literally taking products I'm curious about and building something with them. This is how I learn and experiment with a new product."
tags: [ai, agents, dev-rel, mcp]
published: true
image: /images/blog/covers/devrel-didnt-die-its-audience-changed.webp
ogImage: /images/blog/covers/devrel-didnt-die-its-audience-changed.webp
---

Most evenings I put my agents to the test. I've been experimenting with a lot of stuff lately, and I'm literally taking products I'm curious about and building something with them. This is how I learn and experiment with a new product.

Now, I'm not building something using a code editor, or writing code, or even reading through their docs. I know, stay with me here. You might all think, well then you're not gaining the technical skills required to understand this product. And you're right, I'm not. But that is not the objective of this test. I want to see if an agent can use the product and be successful with it. Then I want to understand what is missing, and how I can guide the agents, or the developers, to create the tools needed so the agents can use the product so much more successfully.

I've built a tremendous amount of things, and I've documented everything in Notion. I spend a lot of time working through what we could build, why we should build it and what we need to think about. The next day I go through all the documentation in Notion and study it. Then I either build on it, or I get excited about a product and say, whoa, let's add this to my website. And if it feels a bit boring, that tells me something too, because I need to believe a product is interesting to advocate for it.

This is how I get really excited about products. It's fascinating how much I can experiment with other products, and I also get to see where they fail when it comes to being agent first.

## DevRel's audience changed

Many people say DevRel is dead. A lot of DevRel jobs were eliminated in the last year or so, yet with so many new products out there, there really is a need for DevRel and quite a number of these are hiring their first one. So what is DevRel now compared to what it was? I don't think anyone has the actual answers, and it's very different depending on the company and the product.

> "AI agents are already using your APIs and skipping everything else. [...] DevRel isn't dead. But the old playbook is." ([Amit Jotwani on X](https://x.com/amit/status/1945504695339946058))

If you're hiring for DevRel, I'd love to know why. What is it that's missing in your stack, what is it you need? Sometimes it's a mixture of things. Your engineers don't have the time to do the work that DevRels do, or don't have the interest, or simply don't have the skill set.

A lot of really talented engineers find it very difficult to break complex tasks down into simplified versions so that people can learn them. Creating educational content is very difficult for a lot of highly technical engineers. They're also sometimes very deep in the product, so they don't realise the learning journey people have to go through to get there.

At least that was the case in the original DevRel world. Now the one going through that learning journey might not be a person at all.

People don't have to go through the documentation so much anymore. They don't even have to learn how to do something. They can just get it done. And this is where I think DevRel becomes agent rel. An agent is going to be using your product much more frequently than a developer will in the coming future, and some of you have probably seen this happen already. In 30 days of traffic to the docs Mintlify hosts, AI coding agents made 45.3% of requests, nearly as much as browsers at 45.8% ([Mintlify](https://www.mintlify.com/blog/state-of-ai)).

Netlify's Mathias Biilmann calls the product side of this [agent experience, or AX](https://biilmann.blog/articles/introducing-ax/). Agent rel is the DevRel side of it. I'm not the first to say it either: on 30 Oct, [@teyc replied](https://x.com/teyc/status/2116166595617911025) to one of my posts with "DevRel will be replaced by AgentRel", and I think that's spot on.

> "'Agent Experience' is the new devX. How easy is it for an agent to set up, to advise its dev, to maintain once it's up?" ([Rachel Nabors on X](https://x.com/rachelnabors/status/2025736270941458738))

## Building my own hire me page

I saw this for myself when I added a voice agent you can talk to. I first tried it in the ElevenLabs builder, then built it with my Grok Bot and the ElevenLabs API. Using an agent, I was much more successful in one way, but I failed a lot more in another.

The reason I failed was that the agent didn't even send me through the guardrail section. When I first built it in their builder, rather than with an agent, it showed me that this was the next step I had to take. The agent skipped it. The UI teaches a human the next step, but nothing told my agent. Agents are going to miss steps, and that's a big problem, because I could think I've got an amazing voice agent, publish it, and the next minute I've got no guardrails, without even knowing they existed. I had to ask my agent to add them, and they're on now.

Now here's the thing. You're saying, what do you mean you didn't know that existed? You should be technical enough to know all this, you should have studied all this, and that's why we shouldn't let agents just go and build things. I get you, I hear you. But this is the thing. The people building with agents now and in the near future won't all have studied this. If the guardrails step only lives in a dashboard, the agent won't find it, and neither will they.

So what happens when you hand other products to a non-developer, a builder, an agent?

## What I found when I gave products to agents

Most of these were built by my Grok Bot, with me just chatting, deciding what to build and guiding it. I only stepped in for a few sign-ups and logins, like a phone check. The clicking through dashboards and using the products was done by my bot, which I think is pretty fascinating, because that's normally the hard part of using any product: getting it up and running in an unfamiliar environment.

### An NVIDIA QA agent

NeMo Agent Toolkit is NVIDIA's open source library for building and evaluating AI agents. My agents used it to build a QA agent that runs on a Nemotron model through NVIDIA's hosted endpoints and uses Playwright MCP to drive a real browser. Its job was to test a tiny movie app where we'd planted a bug in some builds, like a search that finds nothing, and answer PASS or FAIL with evidence.

### An AWS QA agent

AgentCore Browser, part of Amazon Bedrock AgentCore, is a Chrome browser that AWS runs for you in the cloud. My agents built a QA agent where Amazon's small Nova Lite model drives that browser, checks a to-do app against acceptance criteria I wrote in plain English, and hands back a Playwright test.

### An MCP server on ngrok

ngrok gives something running on your laptop a public web address, so tools in the cloud can reach it. I wanted to see if a cloud AI could test an app running on my laptop. My agents ran Playwright MCP locally, put it online with ngrok, and connected it to Grok on grok.com. In about 34 seconds it found a bug we'd planted in a tiny shop. Because that address gives control of a browser on my laptop, we kept it behind a secret link and only had it online for the test.

### A mock shop that let my agent through

To understand how shops tell bots from people, my agents built a small mock shop in Node and Express with a stand-in risk checker that scores each visit from 0 to 100. It looks at clues like `navigator.webdriver`, a HeadlessChrome user agent, typing rhythm and mouse movement, plus a device ID from open source FingerprintJS. A plain headless Playwright script was blocked straight away. A Grok Bot driving its own browser was approved, because to our stand-in it looked human, which matters when that agent is shopping for a real person. That was one run against our own mock, not a real fraud system.

These were all just small fun projects that could easily be turned into a talk or video or could be explored further. Who knows, maybe they will be.

## Anyone is going to be a builder, and they already are

We are working in a world where it's not only developers who are going to be building things going forward. It's going to be builders: product managers, CEOs, anyone. SlashData estimates 16M to 22M people without a coding background already create working software with AI tools ([SlashData](https://www.linkedin.com/posts/slashdata_aibuilders-nocodeai-developerecosystem-activity-7482713045576663040-aEz2)), next to about 48.4M developers ([SlashData developer population](https://www.slashdata.co/research/developer-population)).

Take any small business, like a hairdresser. They are going to be able to build an agent on their website to take appointments. And if that hairdresser is able to do that, then they should be able to be successful with your products without having to read docs or be technical to get something done. That might scare developers: if a hairdresser can just put an agent on a page, why do we need developers? Developers are still needed to build the tools that let agents do this work. And in bigger companies, we still need developers to check, verify and test what the agents make.

Restaurant reservations are a good example. I went to a restaurant recently, and they didn't have anything on their website, so we had to make a phone call, a person had to answer it, and they had to look in a book to see if there was a table. It could be fixed by adding a simple booking form to their website, or better still, a voice agent for people who prefer to call, that can check if there's a table.

I've been here before. I've spent years helping small businesses get online. Back then, I was the one advocating for websites, literally walking around where I lived trying to persuade small businesses to get a website. Restaurants, bars, taekwondo clubs, paint shops, you name it. Everything close by. And I built them, and they all ended up having websites.

With restaurants especially, I had to convince them they needed an online presence, so that tourists coming to the area could look them up beforehand and find they existed. Then they could compete with the other restaurants more easily, and people were going to be booking online. At the time they were like, no, people don't do that. They're just going to walk into a restaurant. They're never going to look online for one. And now we spend most of our time looking online for restaurants, not walking past them. So there was definitely a need for that.

Now we can take that even further with an agent on the page that answers the questions people can't find on the website. Are you open today, it's a bank holiday? Do you have gluten-free options for celiacs?

## What this means for DevRel

So what am I learning, if I'm not learning the product the old way? It's a bit of all of it: where a product breaks for agents and how to fix it, how people build now, and who the new users are. DevRel is still about learning, but not about teaching it like before, because content creation is now so much faster to do. What DevRel still brings is a trusted human voice that people actually listen to.

I know this sounds strange, because DevRel is developer relations, and I'm advocating for the role to be a bit more non-developer focused. The reason: we are going to have a hell of a lot more people building and shipping these kinds of products who don't have the developer skills we've had for the last 15 to 20 years.

Things are going to change big time, and we need to be ready for that. We can't just gatekeep and say, well, if you don't have the coding skills, you shouldn't be able to build an agent. I think that's wrong. It's like websites. Before, you needed a developer to build and deploy a website. Now anyone can, and I think that's fantastic. That's the way it should be.

## What to do if you're in DevRel

1. **Give your product to an agent with no docs.** See how far it gets and where it gets stuck.
2. **Put the critical steps where agents look.** That means an MCP server, an llms.txt your docs actually link to, and your API responses, not only a step in your dashboard that a human would see. Ahrefs found that [97% of llms.txt files got no requests at all](https://ahrefs.com/blog/llmstxt-study/) in May 2026, so a file nobody links to may not help much.
3. **Test it with a non-developer.** If someone who isn't a developer can't get it working with an agent, you've found your next piece of work.

## What I've built

Here's some of what I've been building and trying out. I say I built it, but really I directed the agents.

**Making my own site work for agents**
- [My hire me page](https://debbie.codes/hire-me) has a voice agent, built on ElevenLabs Agents, so you can just ask it about me. Here's [how I built and tested it](https://debbie.codes/blog/hire-me-voice-agent-grok-bot).
- [WebMCP on my site](https://github.com/debs-obrien/debbie.codes/blob/main/utils/webmcp/tools.ts) gives browser agents 4 tools: list-videos, topic-brief, search-content and get-current-page ([latest PR](https://github.com/debs-obrien/debbie.codes/pull/683)). WebMCP is still [experimental](https://developer.chrome.com/docs/ai/webmcp).
- An [llms.txt](https://debbie.codes/llms.txt), a map of my site for agents.

**Testing with agents**
- The NVIDIA, AWS, ngrok and mock shop tests above.
- In my [playwright-movies-app](https://github.com/debs-obrien/playwright-movies-app/issues/92), an agent found and [fixed](https://github.com/debs-obrien/playwright-movies-app/pull/93) messy accessible names on the movie cards.

**Teaching agents with skills**
- [Learn agent skills](https://github.com/debs-obrien/learn-agent-skills).
- In Grok Bot, I built skills that help me publish. When I drop a new video, they write its YouTube title, description and posts. They also publish my blog posts to my site and cross-post them, build my conference slide decks, and make tutorial videos with Remotion.

**Working with my bots**
- An [Alexa skill so I can talk to my bots](https://debbie.codes/blog/talk-to-my-bots-through-alexa) ([code](https://github.com/debs-obrien/alexa-grok-bot-skill)). To build it, I used Grok Bot's call feature to call my engineer bot, the one that had a cloud agent build the Cloudflare Worker behind the skill. I opened the Alexa developer console, told it what I wanted to do, and then we talked our way through it screen by screen, instead of reading the docs.
- Asking for proof. After a batch of demo work, I asked my bot straight out: "Is all this real? Did you actually do all this, or is any of it hallucination?" It went back to the raw files, not its memory. My rule: if a bot can't point to a file, a log or a recording, the claim doesn't go on a slide.

I spend half my time experimenting with agents now, and it makes me better at DevRel, or whatever the role should be called now. If I joined a team tomorrow, I'd know the direction I'd go, the demos I'd build, and how I'd talk to people about why the product is necessary, how to use it and where the gaps are. I'd try to fix those gaps within the product and make it more agent friendly.

Not just agent friendly. I'd make sure non-developers can be successful with it too.

I really want to find a role where I can help developers and non-developers build or work with AI agents, whether that's for personal use, a small business or a large enterprise. I'm not sure if I'll find this role or which company it will be for, but for now I'll keep searching until the right position comes along.

After a hard year with multiple layoffs, I'm looking for my next role in DevRel around AI agents, testing and MCP. Something that excites me and ignites my passion. Oh, and just so you know, I don't do coding challenges.

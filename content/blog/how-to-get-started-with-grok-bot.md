---
title: "How to Get Started with Grok Bot"
date: 2026-08-14
description: "Grok Bot just dropped. I downloaded it on a Mac the same day and recorded myself setting it up. Not a feature list. What I actually clicked, what worked, and which bots I would create."
tags: [ai, agents]
published: true
---

Grok Bot just dropped. I downloaded it on a Mac the same day and recorded myself setting it up. This is the getting started version of that. Not a feature list. What I actually clicked, what worked, and which bots I would create if I were you.

## What it actually is

It is a team of bots on a computer that is not yours. They do the stuff you would hand a teammate. Inbox, LinkedIn, GitHub, the lot.

The marketing page shows sample teammates like talent scout, account manager, inbox manager. That is the idea. You do not start with twelve of those. You start with one bot and a name.

On first run you can pick a colour and a role. Coding and repos. Research and writing. Inbox and calendar. Or a bit of everything. If you do not know what you want, it gives you options and you click. That onboarding is the best bit. Name the bot. Answer a couple of questions. It guides you.

I already had a first bot, deleted it, and started again on camera. So your first screen may look a little nicer than mine.

## Bot 1: a coding bot

I created a new bot and picked coding and repos, just to see how far it would go.

It asked where the code lives. GitHub. It already had a GitHub connector installed from when I poked at plugins before recording. Sign-in hit a snag. It offered another GitHub connector that wanted a personal access token. I said I would do that later. Cloud agents still work if GitHub is linked in Cursor, and mine is.

Then it asked what to jump on first. Ship features, review PRs, explain codebases, or a mix. I picked a mix. A few core repos, not everything.

I could not remember the exact repo name. I typed "playwright movies". It found debs-obrien/playwright-movies-app from my GitHub.

From there I asked some simple stuff. Open issues. Stars. Bring up issue 29, the timeout one. Nothing magic yet. You could do that in any chat with a GitHub MCP.

While that ran I created a second bot. You can have more than one. That is the whole point.

## Bot 2: a LinkedIn bot

I named it LinkedIn bot. That was enough. It already knew I meant LinkedIn.

It asked what I wanted: draft posts and comments, polish the profile, job search, outreach. I picked draft posts and comments. Then how to write: warm and conversational, match my existing posts, be me. I picked match my existing posts.

Then the important bit. It opens a computer that is not yours. You sign in there. It never sees your password. You get a banner: sign in, do 2FA if asked, then "I'm done, continue". It feels a bit like someone remote-controlling a tiny desktop. Once you are in, you hand it back.

I flicked back to the coding bot while LinkedIn was signing in. The coding bot had checked issue 29, found the tests already used waitForURL and no hard waits, and asked if it should close it. I said close it when GitHub is connected. Then I signed GitHub in on that computer. It was already signed in as debs-obrien. It closed the issue with a note. I clicked through to GitHub to see it for myself because I did not believe it actually did it but it did.

Back on LinkedIn, it had pulled recent posts and locked in how I write. Conversational build-log. Concrete numbers. I dumped a messy voice note: I am recording a video of setting this up, I now have a LinkedIn bot, this is real. It drafted in my voice. I said post it.

It took a minute. Long enough that I was sure it would fail. Then: it is live. Opening with "I am literally writing this post from Grokbot right now." It opened the post on its computer. Impressions already ticking.

I tried to add a screenshot after the fact. LinkedIn will not let you attach an image to a post that is already live. Edit is text only. The bot offered delete and repost, or leave it. I left it, then asked it to put the screenshot in the first comment. That worked.

So: name the bot, sign in once on its computer, dump a thought, review the draft, post it.

## Plugins

There is a Plugins item in the sidebar. Gmail, Google Calendar, Google Drive, Notion, Slack, Playwright, GitHub, X, a pile of others. I had already added a couple before I hit record, which is why GitHub was half-connected.

Click along. If you do not know what you need, this list is the menu.

## Bot 3: email

I created an email bot. I am not showing you my inbox in a YouTube video. Inbox triage, drafts, digest, or all of it. I picked all of it. Gmail was already there. Connect, pick the account, allow access. It pulled unread vs read in seconds.

If you hate opening Gmail, this is the one that pays for itself. Drafts stay in your voice. I would still not let it send without you reviewing.

## Bot 4: X

I named it x bot. It knew I meant X / Twitter. Draft posts and replies, watch mentions, a bit of everything.

Connecting is the awkward one. It tried without a bearer token. Then: X needs a bearer token, walk me through it or I will paste it. I did not want to go to the developer portal in the middle of a first-look video. So X was the bot that did not fully land on camera.

If you already have an X app token, this is easy. If you do not, budget ten minutes for that, or skip X until later.

## Which bots I would create

If you are starting from zero, this is what I would do. Add one bot: Chief of staff. Set this up and ask it to create your team of bots for you based on what you do and what you need. This is the prompt I used:

> take a look at me and what i do. find all info you can on me. take a look at the bots i have created. these are your team. see if we need to change anything or add more bots. what is best way of managing these bot teams. what else will make me super productive

This is gold as this helps you setup everything how it should be setup without you having to think it through. You now have one bot you manage and deal with that delegates the work to it's specialists. That is really all you need. The bots can talk to each other and report back to the chief of staff. It is amazing watching it in action.

After that, only add a bot when you have a job that is getting in the way.

I first added the coding bot and linkedin and X bot and email bot and later added a **video editor** (Screen Studio recuts, thumbnails, audio), a **YouTube bot** for posting the videos I create so I don't have to (unlisted first), a **blog post bot** (debbie.codes then Dev.to, LinkedIn and Twitter), and a **travel bot** for conference weeks. Then I added my **chief of staff** to manage them all but you could totally start with the chief of staff.

Do not add a bot for every subtask. I almost added a thumbnail bot but the chief of staff told me that would have been another handoff. Keep thumbnails with the video editor. Ok boss.

## Things that might trip you up

The bot has its own computer. Sign-in and 2FA happen there. You take over, you never paste the password into chat.

GitHub can be "already connected in Cursor" and still ask for a token on a second connector. Skip it, or sign in on the computer. Both paths showed up for me.

LinkedIn posting worked, it did take a few minutes so just be patient.

X wanted a bearer token. The bot will walk you through it.

## Tips

Name the bot after the job. LinkedIn bot. Email bot. X bot. It picks up intent from the name. Or name that what you want and put all that in the description. You can ask your chief of staff:

> can you ensure each bot writes a job descriptions so everyone knowss what they do

Use voice when you can. I typed more than I needed to in the video but I use voice a lot.

Ask your chief of staff to give you a daily digest of your calendar and emails in a podcast format that way you can simply listen to it rather than read through a lot of stuff. It's so nice. If it's too slow tell your bot to speed it up.

> Turn a daily digest into a short morning podcast, emails. calendar and anything else i need to know for my day

This is one of my favourites. I never know on which platform my meetings are on and normally always have to open my calendar. Now I don't anymore.

> i have a meeting now right, whats the link

The bot can watch YouTube videos for you. Meaning you can turn a video you created into a blog post like this one here.

The sky is the limit. There is so much more to discover and play with. I am having so much fun.

There is also a mobile app so you can just get things done from anywhere cause the bots have their own computer so they dont need yours to be on.

## Try it

Download it, create one bot, give it a real job. An old GitHub issue, a LinkedIn draft, a pile of unread mail. The sky is the limit

I was using a free trial when I recorded this. I used most of my free trial in two days, thats a reality but I was experimenting and doing lots, once the dust settles maybe I will need less work from my bots or maybe I will need more but if thats the case then its helping me be super productive and If it gives me time back, I will pay for that.

That is getting started. The rest is muscle memory, and thats the hard part. If you find yourself manually doing something just think, ohh could a bot do this for me.

Video is here if you want to watch.

<lite-youtube
        videoid="kiDvQnoCveU"
        playlabel="Grok Bot First Look: LinkedIn Posts, GitHub Issues and a Team of AI Bots">
</lite-youtube>

[https://x.ai/bot](https://x.ai/bot)

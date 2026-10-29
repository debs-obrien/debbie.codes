---
title: "I Needed an APP to Track My Learning Journey, AI built it in less than half an hour with a single prompt"
date: 2026-01-17
description: "I have been trying to build a Learning Hub App for a good few months using various tools and have had many iterations back and forth on trying to get it to work and ended up going round in circles fixing one thing and breaking another."
tags: [ai, mcp, playwright]
published: true
canonical: https://dev.to/debs_obrien/i-needed-an-app-to-track-my-learning-journey-ai-built-it-in-less-than-half-an-hour-with-a-single-31c4
image: /images/blog/covers/app-to-track-my-learning-journey.webp
ogImage: /images/blog/covers/app-to-track-my-learning-journey.webp
---

I have been trying to build a Learning Hub App for a good few months using various tools and have had many iterations back and forth on trying to get it to work and ended up going round in circles fixing one thing and breaking another. 

Today I gave it a shot using [goose coding agent](https://block.github.io/goose/) and Claude Opus 4.5 as my modal. I used a simple prompt. No .prd file. Just clear instructions of what I wanted and I asked it to come up for a plan for it.

And it did. The plan was great. It started off with: What a great idea! Let me put together a comprehensive plan for this app. I'll call it "AI Learning Hub" - your personal knowledge management system for AI learning resources.

I got a Core Features Overview, Tech Stack Recommendation, Data Structure,  UI Layout Concept, Build phases and some extra nice to have stuff for future improvements. 

![layout of a site design in goose](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3hj38yxohffpm2zn40sw.png){width="1834" height="1574"}

I asked it to change two things and then off it went. In less than half an hour it was not just built but tested before my eyes by using the Playwright MCP. I watched as it added links tested out the filters and used the site like a user would ensuring everything worked. 

![goose using Playwright MCP to verify its work](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oodhfu2u1ai94wo8cb30.png){width="1854" height="1564"}

## AI Learning Hub - Complete!

My agent told me: I've built your AI Learning Hub app! Here's a summary of what's been created:

Features Implemented
Add URLs with metadata fetching: ✅ Auto-fetches title, description, detects category
Categories: ✅ Blog, Video, Podcast, Course, Paper, Other
Learning workflow :✅ Queue → Learning → Completed
Search: ✅ Full-text search across resources
Category filter: ✅ Filter dropdown
Notes: ✅ Rich notes modal per resource
Drag & Drop: ✅ dnd-kit installed, drag handles ready
Content Ideas: ✅ Sidebar with types (Blog, Video, Tutorial, Thread)
Password protection: ✅ Environment variable based
Netlify ready: ✅ Config file created


![ai learning hub site](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8aa8jn48sfj1c3jxwbc3.png){width="2782" height="1486"}

And how do I add the URLs of the sites I want to add, easy. Just paste them into goose and it will use the Playwright MCP which I already configured and it will populate them all for me so I don't have to.

## Conclusion

And that's it, finished and working in less than half an hour while I drank a beer on a Saturday night watching it all in amazement that something that should have taken me weeks to build was built before my very own eyes in minutes. 

Now here is the thing. I didn't open an editor once. I haven't looked at the code. It is working as it should and that is really all I care about for this particular project. I studied coding. I care about the quality of code but right now I am ok with not caring. I am ok with trusting the agent and LLM to ensure the code is good and meets the standards it should.

I will add tests and check performance and out of curiosity I might just look at the code when doing the pr. But I am seriously blown away with how easy it is to do this. 

## Try it yourself

Want to give it a try yourself: Here is the prompt I used:

> I would like you to build me an app so that I can easily manage urls for blog posts, podcasts, videos and other things that I would like to learn when it comes to AI. It would be great to be able to easily add the URL and then have a title and description field which can be populated when adding it. search by category would be great. I would be cool to have some sort of system like a todo list so when it is done it goes to a different place but is still findable should i want to share it with someone. maybe even notes so i could add some notes on it for later findings or note taking. should be able to prioritize things so that i learn things based on a particualar order maybe drag or drop so i can change it. it should be a fun app that i can easily deploy, nice and easy on the eye. it would also great to have a section where i can put ideas on content creation based off of the stuff I have learnt. these could be create blog posts, videos etc. just an idea and not sure if this will look great but we could try it out. can you come up with some sort of a plan for this.

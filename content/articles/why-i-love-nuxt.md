---
title: Why I Love Nuxt
date: 2021-01-30
description: I have been using Nuxt in all of my recent tech jobs but why did I start using it? What problems did I have trying to convince the team and more important the clients. And why should you use Nuxt?
image: https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1599991772/debbie.codes/vue_amsterdam_2_vkc631.jpg
tags: [Nuxt, Lifestyle, all]
---

I was researching frameworks in a previous Job and I was having server side rendering issues as SPA was something that no company wanted. Vue was great but just didn’t fit for us and I was recommended by a Vue Core Team member to use Nuxt. So we gave it a try. And it just worked. Nuxt was quite young at the time and after creating a prototype in record time the company dismissed the idea of using Nuxt as they were too afraid of something so new. Or perhaps they were too afraid of something so good.

when I moved to another company I told them I wanted to use Nuxt. That I really believed in the framework and that it was the right tool at least for the majority of cases. They told me as Tech Lead I could decide what tech to use but that some clients already had projects set up in Angular and others I would need to convince. Luckily I like a challenge.

## Teaching the Team

However my team didn’t know Nuxt or Vue for that matter. So I now had to convince my team it was a good choice and of course teach them. Luckily Nuxt is really easy to learn so it took very little time to teach them. The only thing was that I was no expert at Nuxt and all of a sudden I was leading a team and projects. There wasn’t many resources out there for learning Nuxt and I was faced with many challenges that I just didn’t know how to solve.

Luckily the Nuxt team were really helpful and answered all my questions and I even hired Alex Lichter, one of the Nuxt maintainers to help us out. That’s when I really learnt Nuxt and it helped a lot. Although my learning was at the expense of the company they also gained as my knowledge was then passed down to the other team members. We started out with in house projects and when you lead a team and they do all the work and are able to deliver a top performant site with ease then you know you are using the right tool.

## Time to Convince the Clients

I tried to convince a massive hotel chain to use Nuxt and gave a great pitch but they went with AEM, Adobe Experience Manager, which is a more complete package in terms of CMS for non tech people and for them the thoughts of using a headless CMS was just a crazy idea. Actually they told me I was too far ahead in tech. But I still got to lead that project for the frontend making sure it was as performant as possible and only allowing certain libraries, ensuring to best practices etc.

## You want Static? I can give you Static

I found it hard to convince clients and it was so frustrating as I knew Nuxt was a good choice for them. For one project we were asked to create a static HTML site and I told my boss that this was the project. We would deliver a Nuxt static site. They would get all the performance benefits and an easy to maintain site. We just don’t tell them we are using modern technology. For some reason that scares people and I had no intentions of delivering a HTML site with no framework in 2019. No way. So I told my boss we just deliver it. And so we did.

## Oh to be a DevOps expert

But we had so many deployment issues and the company were not happy. They asked for a HTML site and got a Nuxt site. Now as a Frontend Tech Lead I had to become a DevOps expert and find a way to deploy the Nuxt site. It wasn’t easy and I remember reaching out to Sébastien Chopin and asking for help while in the clients office with managers panicking as they were going live and the site wasn't working.

They were deploying on NGINX and I knew nothing about how that worked. We finally managed to get it to work after changing servers and things way beyond my knowledge. It was touch and go for a while and everything was landing on my head. But once they got it to work and saw how fast it was and how easy it was to add more pages, more content and more languages, they were in fact really happy. And from there it was Nuxt sites from that day forward with no questions asked.

## Things are never easy

But not everyone has a server or needs to have a server to work with Nuxt so I need to persuade backend developers that static sites were the future. Going Jamstack, the new cool trendy word. I ran into a lot of issues as people who are used to server rendered sites just compare static sites with static sites of the 90's. I think that is why I created so many talks on static sites because I really needed to know my stuff so I could convince others on my team. Of course they had so many doubts about how Jamstack works, how Nuxt works, and it was really hard trying to get my point across.

## There are always doubts

I constantly got the question of "Are you trying to tell me that if I change some content I have to rebuild and deploy the site?". And the answer if of course yes which makes people think that static is not for them. But if you set things up correctly so it builds on each push to git or on a webhook from the CMS then really what is the problem. Oh you have to wait perhaps 2 minutes to see the changes. Ok yeah, but come on, the performance benefits are so much worth it plus its free to host it and much more secure and easier than working with servers.

I am not very good at backing down and I intended not to lose this battle. I was convinced that a Nuxt static site was the perfect case for an agency site, a travel agent site, and hotel promotion sites. The funny thing is that the team fought against static because you had to rebuild the site and it actually made no sense as content only got updated once every few weeks, if even that.

## Understanding static sites

Many people still don't understand static sites and all their power. We built a travel agent site with a booking engine where the site was static meaning it was lightening fast in performance but we excluded the booking engine from static generation and therefore it fell back to being an SPA. This meant these pages had no SEO but really they didn't need it. They were just search results pages. We managed to do the unthinkable. Or perhaps it was me just trying to prove a point in that we didn't need server side rendering and that with Jamstack you really can do anything.

My boss at the time said "But can we not just render the content and not the whole site if we only change content?". He was right in that, yes that would be lovely but at the time it just wasn't available. Maybe in the future. Sometimes you have to take a bet on things. Things are never perfect but they are always improving and things will always get better. And Nuxt delivered this exact thing where your site gets rebuilt and doesn't go through webpack if only your content changes from either your CMS or when using content module for example. And this makes rebuilding and deploying your site super fast. But

## Nuxt is just amazing

For me Nuxt just works. It is easy to learn and easy to teach people. I think anyone can pick it up easily and get a site up and running with not much dev experience and that is super cool. With Nuxt you can have non tech people such as designers helping out on a project as the code base is just so easy to understand. When you are in charge of a project and are not sure where the deployment might be or if you are just not sure if static is right for you then no worries as with Nuxt just changing one thing in the config file and your site becomes static or server rendered and that is super powerful. But Nuxt also lets you take it the the next level by creating your own plugins and modules and literally hooking into Nuxt. So basically if you want my opinion, is Nuxt right for you? For sure it is. For your, for your company, for your team. If you want to get started with Nuxt you can check out my [free course on getting Started with Nuxt](https://explorers.netlify.com/learn/get-started-with-nuxt) or check out my [YouTube Channel](https://www.youtube.com/channel/UCrNvYFsT1L3WczE8AizDQ6g) for free content on Nuxt. Have fun.

![Are you Nuxt](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1599991772/debbie.codes/vue_amsterdam_2_vkc631.jpg)

## Useful Links

- [Previous conference Talks](https://debbie.codes/resources/conference-talks)
- [Why static sites are back](https://dev.to/azure/why-static-sites-are-back-6jh)
- [Nuxt Static Improvements](https://nuxtjs.org/blog/nuxt-static-improvements)
- [Going Full Static](https://nuxtjs.org/blog/going-full-static)
- [My YouTube Channel](https://www.youtube.com/channel/UCrNvYFsT1L3WczE8AizDQ6g)
- [Free course on Getting started with Nuxt](https://explorers.netlify.com/learn/get-started-with-nuxt)

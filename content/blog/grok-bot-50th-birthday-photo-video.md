---
title: "How Grok Bot turned 133 family photos into a 50th birthday video with zero editing"
date: 2026-10-13
description: "How I made a photo video for my brother Ken's 50th birthday with my Grok Bots: scanned prints, photos from my Mac and family, music, pacing, and an intro and outro."
image: /images/blog/ken-50th-birthday-video/cover.png
tags: [ai, personal]
published: true
---

## Why I made it

My brother Ken was turning 50, and I wanted to make a photo video for it.

I started by asking my chief of staff bot for help. Most of it happened while I was busy doing other stuff. The bots have their own computer, so they didn't need me to be there or my computer to be on. The only time they needed my Mac was to look through photos on it, so I just logged in and let them work away while I got on with my day. That might sound scary but I promise you it is not. I think it’s actually very cool that you can give Grok Bot access to your photos cause now just think of all the things you can do.

## Where the photos came from

The photos came from lots of places, and getting them all together was a big part of the job:

- **My mam's scanned photos in Dropbox.** 25 scanned A4 pages in a shared folder, most with several old prints on each page.
- **My Mac.** I asked for photos and it searched my Apple Photos library, read-only, including some from about 15 years ago.
- **Facebook.** It went through photos I was tagged in and put them all on one page with a number on each, so I could just reply with the numbers I wanted.
- **My sister** sent an email with a link to a professional photographer's gallery from a family shoot, and the photos were downloaded from there.
- **My brothers** sent me photos on WhatsApp. I AirDropped them to my Mac, and the bot found them in my Downloads folder.

My part was really simple. I just told the bots where the photos were and gave feedback on each version. They did the finding, sorting, cropping, editing and keeping track of every version.

I never had to move any of the originals. The bots read from Dropbox and my Mac and left the originals as they were.

## Getting single photos out of the scans

This was the part I was most impressed by. Each scanned page had three to five prints on it. My mam had placed them any way they'd fit on the page, so they were at all sorts of angles, sideways and upside down, and some photos turned up on more than one page. I didn't want to crop, rotate and sort them all by hand.

So it wrote a small script to do it. The script looked at each page, worked out where each photo sat on the white paper, cut it out and turned it the right way up. From 25 pages it got 73 single photos.

It wasn't perfect. Some photos came out sideways or upside down, and 12 were flagged as unsure, so it put those on a sheet for me to check and there was a separate pass just to fix rotations. It also trimmed the white scanner edge off the photos and removed 5 duplicates, checking each match by eye too, which left 68 scanned photos.

## Building the video: pacing and music

The first cut was silent, at about 6.5 seconds a photo. It felt far too slow.

We changed it to about 4.5 seconds a photo, which brought it to around 5½ minutes, and added music. It used two upbeat royalty-free tracks from Pixabay, checked their licence and kept a copy of it. The music fades in at the start and fades out right as the video ends.

That 4.5 seconds stayed for most versions. But as I kept adding photos, the video kept getting longer. By the last version it was 133 photos, so I asked it to cut the time without dropping any photos. It went to 4 seconds a photo, which made it about 9 minutes.

## Handing it to the right bots

Partway through, I realised I didn't want chief of staff doing everything itself. It's there to manage things, not to be my video editor. So I asked it to hand the work to the right bots:

- **The video editor bot** took over the montage: building each version, the music and the timing.
- **The designer bot** made the intro card and a matching ending card.

Chief of staff kept passing on my picks and requests. We went with a soft pink dots background to sit behind the photos.

## The amazing intro and outro

The designer bot made the intro and the ending card. The theme was easy: my brother is called Ken, so we went with Ken from the Barbie movie. The intro is a pink toy box with Ken's face on the doll, and the ending is a pink convertible driving off into the sunset. It took a few goes to get right (the first doll looked like a "pinhead on a stick"), and then the video editor bot brought them to life with a slow zoom and the car driving off the screen.

The real cards have Ken's photo on them, so for this post the designer bot made versions with a cartoon face instead:

![The intro card: Ken from the Barbie movie, with a cartoon face for this post.](/images/blog/ken-50th-birthday-video/intro-card.png)

![The ending card: Kenough! Cartoon face for this post.](/images/blog/ken-50th-birthday-video/ending-card.png)

## Keeping every version

Partway through I asked for every cut to be saved as a new numbered version with a short note of what changed, and never overwritten. That turned out to be one of the best things I asked for. We went up to version 8, and I could always go back.

Each version went to Google Drive, so I could watch it straight away without downloading anything.

## Do something similar

You don't need to know how to edit video. You need your photos and a bit of patience for the back and forth. Here are some asks to start with:

- "I have scanned pages with several photos on each one. Cut out each photo, turn it the right way up, and show me any you're not sure about."
- "Search my photo library for photos of this person and show me a numbered contact sheet so I can pick."
- "Put all the photos in date order, remove duplicates, and make a slideshow video at about 4 seconds a photo with royalty-free music that fades out at the end."
- "Make a matching intro and ending card for the video."

Making photo videos is something we love doing, but it takes a lot of time. I didn't have that time, and nobody else did either. Handing it to a bot, with me just overseeing it, making sure it had the right photos, that it looked good and that the timing was right, made it a really nice, easy process. I could do this for every birthday and every event now, and that's kind of cool.

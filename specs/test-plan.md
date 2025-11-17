# Debbie.Codes Website - Comprehensive Test Plan

## Application Overview

**Debbie.Codes** is a Nuxt 3-based personal portfolio and content website for Debbie O'Brien, a Principal Technical Program Manager at Microsoft. The site serves as a central hub for her professional content, including blog posts, videos, podcasts, courses, and biographical information.

### Key Features
- **Content Management**: Markdown-driven content using Nuxt Content v2
- **Multiple Content Types**: Blog posts, videos, podcasts, and courses
- **Advanced Filtering**: Tag-based and year-based filtering for blog content
- **Search Functionality**: Real-time search for blog articles
- **Color Mode Switcher**: Dark mode support with system preference detection
- **Responsive Design**: Desktop and mobile navigation patterns
- **Social Integration**: Links to multiple social platforms
- **Featured Content**: Curated featured posts and podcasts on the home page
- **External Links**: Deep linking to course platforms, podcast platforms, and video platforms

---

## Test Scenarios

### 1. Home Page Content Display

**Seed:** `tests/seed.spec.ts`

#### 1.1 Verify Home Page Header and Introduction
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the main heading
3. Locate the subtitle describing Debbie's role

**Expected Results:**
- Heading "Debbie O'Brien" is displayed with level 1
- Subtitle "Principal Technical Program Manager at Microsoft" is visible
- Page title includes "Debbie codes and helps others learn Playwright, testing, React, Nuxt and more"

#### 1.2 Verify Award Badges Display
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the awards/badges section below the introduction

**Expected Results:**
- Google GDE badge link is present
- Former Microsoft MVP badge link is present
- GitHub Star Alumni badge link is present
- Nuxt Ambassador badge link is present
- All badge links are clickable and navigate to external pages

#### 1.3 Verify Featured Posts Section
**Steps:**
1. Navigate to the home page (`/`)
2. Scroll to the "Featured Posts" section
3. Count the number of featured articles displayed

**Expected Results:**
- "Featured Posts" heading (level 2) is visible
- Exactly 2 featured posts are displayed
- Each featured post contains:
  - Tags list
  - Title link
  - Description/excerpt
  - "Read more" link

#### 1.4 Verify Recent Videos Section
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the "Recent Videos" section
3. Count the video articles displayed

**Expected Results:**
- "Recent Videos" heading is visible
- "Recent Videos" link navigates to `/videos`
- 4 video articles are displayed
- Each video article contains:
  - Date
  - Publisher/source
  - Title
  - Tags list

#### 1.5 Verify Recent Blog Posts Section
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the "Recent Blog Posts" region
3. Count the blog post articles

**Expected Results:**
- "Recent Blog Posts" heading is visible
- Link navigates to `/blog`
- 6 blog post articles are displayed
- Each article contains:
  - Title
  - Date
  - Read time
  - Tags

#### 1.6 Verify Recent Podcasts Section
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the "Recent Podcasts" region
3. Count the podcast articles

**Expected Results:**
- "Recent Podcasts" heading is visible
- Link navigates to `/podcasts`
- 3 podcast articles are displayed
- Each podcast contains:
  - Image/thumbnail
  - Title
  - Date
  - Tags

#### 1.7 Verify Featured Podcast Section
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the "Featured Podcast" section
3. Verify podcast details

**Expected Results:**
- "Featured Podcast" heading (level 2) is visible
- Featured podcast article is displayed
- Contains:
  - Podcast title
  - Description
  - "Listen Now" link with external URL
  - Podcast image

---

### 2. Navigation Functionality

**Seed:** `tests/seed.spec.ts`

#### 2.1 Verify Desktop Navigation Menu
**Steps:**
1. Navigate to the home page (`/`)
2. Locate the navigation bar in the header
3. Verify all navigation links are present

**Expected Results:**
- Navigation contains a list with the following items:
  - About (`/about`)
  - Videos (`/videos`)
  - Podcasts (`/podcasts`)
  - Courses (`/courses`)
  - Blog (`/blog`)
- Each link is clickable
- Logo/name link navigates back to home (`/`)

#### 2.2 Navigate to Each Main Section via Menu
**Steps:**
1. Navigate to the home page (`/`)
2. Click "About" link
3. Verify URL changes to `/about`
4. Click "Videos" link
5. Verify URL changes to `/videos`
6. Click "Podcasts" link
7. Verify URL changes to `/podcasts`
8. Click "Courses" link
9. Verify URL changes to `/courses`
10. Click "Blog" link
11. Verify URL changes to `/blog`

**Expected Results:**
- Each navigation link successfully navigates to the correct URL
- Active link is visually indicated in the navigation
- Page content changes accordingly

#### 2.3 Verify Footer Navigation
**Steps:**
1. Navigate to any page
2. Scroll to the footer
3. Verify footer navigation links

**Expected Results:**
- Footer contains navigation list with same links as header:
  - About
  - Videos
  - Podcasts
  - Courses
  - Blog
- All footer links are functional
- Copyright text "© Debbie O'Brien, Palma de Mallorca, Spain" is displayed

---

### 3. About Page Content

**Seed:** `tests/seed.spec.ts`

#### 3.1 Verify About Page Biography
**Steps:**
1. Navigate to `/about`
2. Locate the main heading
3. Read the biography sections

**Expected Results:**
- Page title is "About Debbie and her experience as a developer · Debbie Codes"
- Main heading "I'm Debbie O'Brien" (level 1) is displayed
- Biography paragraphs are present describing:
  - 15+ years of frontend experience
  - Teaching experience at Vue School, Jamstack Explorers, Ultimate Courses
  - Current role at Microsoft
  - Technical expertise (Vue.js, Nuxt.js, Playwright)
  - Personal interests (sports, Taekwondo)
  - Link to YouTube Channel is present

#### 3.2 Verify Awards and Achievements Section
**Steps:**
1. Navigate to `/about`
2. Scroll to "Awards & Achievements" section
3. Count the number of award cards displayed

**Expected Results:**
- "Awards & Achievements" heading (level 2) is visible
- Description text is present
- 8 award/certification cards are displayed:
  1. GitHub Star Alumni
  2. Google Developer Expert
  3. Former Microsoft Most Valuable Professional
  4. Media Developer Expert
  5. Auth0 Ambassador
  6. Microsoft Certified
  7. Bachelor's Level Diploma
  8. Full Stack JavaScript Tech Degree
- Each card contains:
  - Image/logo
  - Heading with "Learn more" text
  - Description paragraph
  - "Learn More" link to external site

---

### 4. Blog Page Functionality

**Seed:** `tests/seed.spec.ts`

#### 4.1 Verify Blog Page Layout
**Steps:**
1. Navigate to `/blog`
2. Verify page structure

**Expected Results:**
- Page title is "Blog · Debbie Codes"
- Main heading "Blog" (level 1) is displayed
- Subtitle "Thoughts on web development, testing, performance, and developer experience" is visible
- Topics list is displayed
- Search box is present
- Featured Posts section is visible
- Recent Posts section is visible
- Browse by Topic section is visible
- Browse by Year section is visible

#### 4.2 Verify Blog Tags/Topics Filter
**Steps:**
1. Navigate to `/blog`
2. Locate the topics list
3. Count the number of tags displayed

**Expected Results:**
- "All" tag/link is present and active by default
- Multiple topic tags are displayed including:
  - AI, MCP, ai, architecture, dev rel, githubcopilot, jamstack, javascript, mcp, mentoring, motivation, nuxt, performance, personal, playwright, react, testing, typescript, vs code, vscode, vue, webdev
- Each tag is a clickable link
- Tag links navigate to `/blog/tags/{tag-name}`

#### 4.3 Filter Blog Posts by Tag
**Steps:**
1. Navigate to `/blog`
2. Click on "playwright" tag
3. Verify URL changes and content filters

**Expected Results:**
- URL changes to `/blog/tags/playwright`
- Only blog posts with "playwright" tag are displayed
- "playwright" tag is visually indicated as active
- All other sections remain visible (Browse by Topic, Browse by Year)

#### 4.4 Verify Blog Search Functionality
**Steps:**
1. Navigate to `/blog`
2. Locate the search box with placeholder "Search articles..."
3. Type "playwright" into the search box
4. Observe the results

**Expected Results:**
- Search results update in real-time as typing
- Heading changes to "Search Results (19)" or similar with count
- Featured Posts section is hidden
- Recent Posts section is replaced with search results
- Search results contain only posts matching "playwright"
- Each result displays:
  - Tags
  - Title
  - Excerpt
  - "Read more" link
- Browse by Topic and Browse by Year sections remain visible

#### 4.5 Clear Search and Return to Default View
**Steps:**
1. After performing a search (from 4.4)
2. Clear the search box
3. Observe the page

**Expected Results:**
- Search results heading disappears
- Featured Posts section reappears
- Recent Posts section reappears with default posts
- Page returns to original state

#### 4.6 Verify Featured Posts on Blog Page
**Steps:**
1. Navigate to `/blog`
2. Locate the "Featured Posts" section
3. Count featured posts

**Expected Results:**
- "Featured Posts" heading (level 2) is visible
- 2 featured posts are displayed
- Featured posts are different from home page featured posts (or may be same)
- Each featured post contains:
  - Tags list with clickable tag links
  - Title link
  - Description paragraph
  - "Read more" link

#### 4.7 Verify Recent Posts Section
**Steps:**
1. Navigate to `/blog`
2. Locate the "Recent Posts" section
3. Count the posts

**Expected Results:**
- "Recent Posts" heading (level 2) is displayed
- 8 recent posts are displayed
- Each post contains:
  - Tags list
  - Title link
  - Excerpt
  - "Read more" link
- "View All Posts" link is present navigating to `/blog/page/1`

#### 4.8 Verify Browse by Topic Section
**Steps:**
1. Navigate to `/blog`
2. Scroll to "Browse by Topic" section
3. Verify top topics are displayed

**Expected Results:**
- "Browse by Topic" heading (level 2) is visible
- Top 8 topics are displayed with post counts:
  - Nuxt (33 posts)
  - personal (25 posts)
  - testing (21 posts)
  - playwright (19 posts)
  - React (12 posts)
  - AI (9 posts)
  - MCP (8 posts)
  - performance (6 posts)
- Each topic is a clickable link navigating to `/blog/tags/{topic}`

#### 4.9 Verify Browse by Year Section
**Steps:**
1. Navigate to `/blog`
2. Scroll to "Browse by Year" section
3. Verify years are displayed

**Expected Results:**
- "Browse by Year" heading (level 2) is visible
- Subtitle "Explore posts from different years" is displayed
- Years are listed with post counts:
  - 2025 (7 posts)
  - 2024 (4 posts)
  - 2023 (8 posts)
  - 2022 (29 posts)
  - 2021 (22 posts)
  - 2020 (28 posts)
  - 2019 (2 posts)
  - 2018 (2 posts)
  - 2017 (2 posts)
- Each year is a clickable link navigating to `/blog/year/{year}`
- Helper text "Click any year to browse posts from that period" is displayed

#### 4.10 Filter Blog Posts by Year
**Steps:**
1. Navigate to `/blog`
2. Click on "2025" in the Browse by Year section
3. Verify filtering

**Expected Results:**
- URL changes to `/blog/year/2025`
- Only blog posts from 2025 are displayed
- Page title updates to indicate year filter
- All other sections remain functional

---

### 5. Individual Blog Post

**Seed:** `tests/seed.spec.ts`

#### 5.1 Verify Blog Post Layout
**Steps:**
1. Navigate to a blog post (e.g., `/blog/testing-logged-in-state-playwright-mcp-browser-extension`)
2. Verify post structure

**Expected Results:**
- Page title includes post title + " · Debbie Codes"
- Article element contains:
  - Post heading (level 1)
  - Publication date (time element)
  - Post content with formatted markdown:
    - Paragraphs
    - Headings (level 2 for sections)
    - Lists (ordered and unordered)
    - Code blocks with syntax highlighting
    - Links (internal and external)
    - Strong/bold text
    - Embedded content (iframes for videos)
- Navigation to next/previous post at the bottom (when available)

#### 5.2 Verify Blog Post Content Formatting
**Steps:**
1. Navigate to any blog post with rich content
2. Scroll through the post
3. Verify various markdown elements render correctly

**Expected Results:**
- Headings (h2, h3) are properly styled
- Code blocks have syntax highlighting and line numbers
- Lists are properly formatted (bullets/numbers with proper indentation)
- Links are styled and clickable
- Inline code is visually distinct
- Blockquotes (if present) are styled
- Images (if present) are displayed

#### 5.3 Verify Embedded Video in Blog Post
**Steps:**
1. Navigate to a blog post with embedded video (e.g., testing-logged-in-state post)
2. Scroll to the video section
3. Locate the iframe element

**Expected Results:**
- YouTube iframe is embedded in the post
- Video player controls are visible
- "Play" button is present
- "Watch on YouTube" link is available
- Share button is present
- Video does not autoplay

#### 5.4 Verify Blog Post Navigation (Prev/Next)
**Steps:**
1. Navigate to a blog post that has a next post
2. Scroll to the bottom of the post
3. Locate the next post link

**Expected Results:**
- Link to next post is present at the bottom
- Link includes the next post's title
- Clicking the link navigates to the next blog post
- If there's a previous post, a previous link should also be present

---

### 6. Videos Page

**Seed:** `tests/seed.spec.ts`

#### 6.1 Verify Videos Page Layout
**Steps:**
1. Navigate to `/videos`
2. Verify page structure

**Expected Results:**
- Page title is "Videos · Debbie Codes"
- Main heading "Videos" (level 1) is displayed
- Subtitle "Videos from conference talks, interviews and live streams" is visible
- Topics filter list is present
- "Recent Videos" section is visible
- "Conference Talks" section is visible
- "Live Streams" section is visible
- "Browse by Topic" section is visible

#### 6.2 Verify Recent Videos Display
**Steps:**
1. Navigate to `/videos`
2. Locate the "Recent Videos" section
3. Count the videos

**Expected Results:**
- "Recent Videos" heading (level 2) is displayed
- 8 recent videos are shown
- Each video card contains:
  - Play button (visual indicator)
  - Video thumbnail/title button
  - Date (time element)
  - Publisher/source
  - Heading (level 3) with video title
  - Tags list
- "View All Videos" link navigates to `/videos/all`

#### 6.3 Verify Conference Talks Section
**Steps:**
1. Navigate to `/videos`
2. Locate the "Conference Talks" section
3. Verify content

**Expected Results:**
- "Conference Talks" heading (level 2) is displayed
- "View all →" link navigates to `/videos/tags/conference-talk`
- Multiple conference talk videos are listed (at least 8)
- Each video has:
  - Play button
  - Date
  - Conference name
  - Title
  - Tags including "conference talk"

#### 6.4 Verify Live Streams Section
**Steps:**
1. Navigate to `/videos`
2. Locate the "Live Streams" section
3. Verify content

**Expected Results:**
- "Live Streams" heading (level 2) is displayed
- "View all →" link navigates to `/videos/tags/live-streams`
- Multiple live stream videos are listed (at least 8)
- Each video has:
  - Play button
  - Date
  - Host/channel name
  - Title
  - Tags including "live streams"

#### 6.5 Filter Videos by Topic
**Steps:**
1. Navigate to `/videos`
2. Click on a topic tag (e.g., "playwright")
3. Verify filtering

**Expected Results:**
- URL changes to `/videos/tags/playwright`
- Only videos with "playwright" tag are displayed
- Page layout remains the same
- Active tag is visually indicated

#### 6.6 Verify Browse by Topic Section (Videos)
**Steps:**
1. Navigate to `/videos`
2. Scroll to "Browse by Topic" section
3. Verify topics

**Expected Results:**
- "Browse by Topic" heading (level 2) is visible
- Popular topics are displayed as clickable badges/buttons:
  - nuxt, playwright, testing, vue, javascript, react, performance, accessibility
- Clicking a topic filters videos by that topic

---

### 7. Podcasts Page

**Seed:** `tests/seed.spec.ts`

#### 7.1 Verify Podcasts Page Layout
**Steps:**
1. Navigate to `/podcasts`
2. Verify page structure

**Expected Results:**
- Page title is "Podcast Interviews · Debbie Codes"
- Main heading "Podcast Interviews" (level 1) is displayed
- Subtitle "Discover conversations about web development, testing, and developer advocacy" is visible
- Podcast statistics section is displayed showing:
  - 29+ Episodes
  - 5+ Years
  - 20+ Shows
- Featured Podcast section is visible
- Topics filter list is present
- "All Episodes" section is visible
- "Want to collaborate?" section at the bottom

#### 7.2 Verify Featured Podcast Section
**Steps:**
1. Navigate to `/podcasts`
2. Locate the Featured Podcast article
3. Verify details

**Expected Results:**
- Featured Podcast article is displayed prominently
- Contains:
  - "Featured Podcast" heading (level 3)
  - Podcast title: "Changing Testing using Playwright MCP with Debbie O'Brien"
  - "Listen Now" link with external URL (dotnetrocks.com)
  - Podcast image/cover

#### 7.3 Verify All Episodes Section
**Steps:**
1. Navigate to `/podcasts`
2. Locate the "All Episodes" section
3. Count the episodes

**Expected Results:**
- "All Episodes" heading (level 2) is displayed
- Episode count is shown (e.g., "29 episodes")
- 29 podcast episode cards are displayed
- Each episode card contains:
  - Podcast image/thumbnail
  - External link icon
  - Podcast show name
  - Episode title (heading level 2) as a link
  - Description
  - Date (time element)
  - Tags list

#### 7.4 Verify Podcast Episode External Links
**Steps:**
1. Navigate to `/podcasts`
2. Locate any podcast episode
3. Click on the title link

**Expected Results:**
- Clicking the title opens the podcast in a new tab
- External URLs include platforms like:
  - testguild.com
  - Apple Podcasts
  - Spotify
  - Various podcast hosting platforms
- Browser indicates external link (new tab/window)

#### 7.5 Filter Podcasts by Tag
**Steps:**
1. Navigate to `/podcasts`
2. Click on a topic tag (e.g., "playwright")
3. Verify filtering

**Expected Results:**
- URL changes to `/podcasts/tags/playwright`
- Only podcast episodes with "playwright" tag are displayed
- Active tag is visually indicated
- Page layout remains the same

#### 7.6 Verify Collaboration Section
**Steps:**
1. Navigate to `/podcasts`
2. Scroll to the bottom of the page
3. Locate the "Want to collaborate?" section

**Expected Results:**
- "Want to collaborate?" heading (level 3) is displayed
- Description text: "I'm always open to interesting podcast conversations about web development, testing, and technology."
- "Get in touch" link navigates to LinkedIn profile (external link)

---

### 8. Courses Page

**Seed:** `tests/seed.spec.ts`

#### 8.1 Verify Courses Page Layout
**Steps:**
1. Navigate to `/courses`
2. Verify page structure

**Expected Results:**
- Page title is "Courses · Debbie Codes"
- Main heading "Courses" (level 1) is displayed
- Subtitle "Collection of courses I have created" is visible
- Topics filter list is present
- Course list is displayed

#### 8.2 Verify Course Listings
**Steps:**
1. Navigate to `/courses`
2. Count the courses displayed
3. Verify course card details

**Expected Results:**
- 7 course cards are displayed
- Each course card contains:
  - Course title (heading level 2) as a link
  - Description paragraph
  - Tags list
- Courses listed:
  1. React for Beginners
  2. Nuxt Series
  3. Get Started with Nuxt
  4. Vue-Apollo GraphQL Fundamentals
  5. GraphQL Fundamentals
  6. Internationalization with vue-i18n
  7. Vue Router for Everyone

#### 8.3 Verify Course External Links
**Steps:**
1. Navigate to `/courses`
2. Click on any course title
3. Verify navigation

**Expected Results:**
- Clicking course title opens the course on external platform
- Platforms include:
  - YouTube playlists
  - Netlify Explorers
  - Vue School
- Links open in current tab or new tab depending on implementation

#### 8.4 Filter Courses by Topic
**Steps:**
1. Navigate to `/courses`
2. Click on a topic tag (e.g., "nuxt")
3. Verify filtering

**Expected Results:**
- URL changes to `/courses/tags/nuxt`
- Only courses with "nuxt" tag are displayed
- Active tag is visually indicated
- Page layout remains the same

---

### 9. Social Links and External Navigation

**Seed:** `tests/seed.spec.ts`

#### 9.1 Verify Header Social Links
**Steps:**
1. Navigate to any page
2. Locate the social links in the header
3. Verify all social icons are present

**Expected Results:**
- Social links list in header contains:
  - X/Twitter (x.com/debs_obrien)
  - LinkedIn (linkedin.com/in/debbie-o-brien-1a199975/)
  - GitHub (github.com/debs-obrien)
  - YouTube (youtube.com/c/DebbieOBrien)
- Each link has an icon/image
- Each link is clickable

#### 9.2 Verify Footer Social Links
**Steps:**
1. Navigate to any page
2. Scroll to the footer
3. Locate the social links
4. Count the social links

**Expected Results:**
- Footer social links list contains:
  - X/Twitter
  - LinkedIn
  - YouTube
  - Twitch (twitch.tv/debs_obrien)
  - GitHub
  - Dev.to (dev.to/debs_obrien)
  - Buy Me a Coffee (buymeacoffee.com/debbieobrien)
- Each link has an icon/image
- All links are clickable and navigate to external pages

#### 9.3 Verify Award Links on About Page
**Steps:**
1. Navigate to `/about`
2. Locate each award card
3. Click on "Learn More" links

**Expected Results:**
- Each award card has a "Learn More" link
- Links navigate to external pages:
  - GitHub Stars Alumni page
  - Google Developer Expert profile
  - Microsoft MVP profile
  - Cloudinary MDE page
  - Auth0 Ambassador program
  - Microsoft certification page
  - OpenClassrooms
  - Team Treehouse
- All links open correctly (new tab or current tab)

#### 9.4 Verify External Links on Home Page
**Steps:**
1. Navigate to the home page
2. Locate the awards section
3. Click on badge links

**Expected Results:**
- Google GDE link navigates to developers.google.com
- Microsoft MVP link navigates to mvp.microsoft.com
- GitHub Star Alumni link navigates to stars.github.com/alumni/
- Nuxt Ambassador link navigates to nuxtjs.org/teams/
- All links open in new tab or current tab

---

### 10. Color Mode Functionality

**Seed:** `tests/seed.spec.ts`

#### 10.1 Verify Default Color Mode
**Steps:**
1. Navigate to the home page
2. Locate the color mode button in the header
3. Check the current mode

**Expected Results:**
- Color mode button is visible
- Default mode is "system" (follows browser/OS preference)
- Button shows system icon
- Page colors match the system preference

#### 10.2 Switch to Dark Mode
**Steps:**
1. Navigate to any page
2. Click the color mode button
3. Observe the change

**Expected Results:**
- Color mode button state changes to "dark"
- Button shows dark mode icon (active state)
- Page background changes to dark color
- Text color changes to light color for contrast
- All components adapt to dark theme

#### 10.3 Switch to Light Mode
**Steps:**
1. After switching to dark mode (from 10.2)
2. Click the color mode button again
3. Observe the change

**Expected Results:**
- Color mode button cycles to next mode
- Page adapts to light theme
- Background and text colors change accordingly
- All components adapt to light theme

#### 10.4 Verify Color Mode Persistence
**Steps:**
1. Switch to a specific color mode (e.g., dark)
2. Navigate to a different page
3. Check the color mode

**Expected Results:**
- Selected color mode persists across page navigation
- Color mode preference is stored (localStorage or cookie)
- All pages respect the chosen color mode

#### 10.5 Test Color Mode on Different Pages
**Steps:**
1. Set color mode to dark
2. Navigate to each main page (Home, About, Blog, Videos, Podcasts, Courses)
3. Verify dark mode applies correctly

**Expected Results:**
- Dark mode applies consistently across all pages
- All content types (text, images, code blocks, etc.) are readable in dark mode
- No visual issues or contrast problems
- Footer and header also adapt to dark mode

---

### 11. Responsive Design and Mobile Navigation

**Seed:** `tests/seed.spec.ts`

#### 11.1 Verify Mobile Viewport Rendering
**Steps:**
1. Set viewport to mobile size (e.g., 375x667 iPhone SE)
2. Navigate to the home page
3. Verify page layout

**Expected Results:**
- Page content adapts to mobile viewport
- No horizontal scrolling
- Text is readable without zooming
- Images scale appropriately
- Navigation adapts to mobile pattern

#### 11.2 Verify Mobile Navigation Menu (if present)
**Steps:**
1. Set viewport to mobile size
2. Navigate to the home page
3. Look for hamburger menu or mobile navigation pattern

**Expected Results:**
- Mobile navigation mechanism is present (hamburger icon or similar)
- Clicking hamburger opens mobile menu
- Mobile menu displays all navigation links
- Links are easily tappable (proper touch target size)
- Menu can be closed after opening

#### 11.3 Test Mobile Navigation Links
**Steps:**
1. In mobile viewport, open the mobile menu
2. Click each navigation link
3. Verify navigation works

**Expected Results:**
- Each link navigates to the correct page
- Menu closes after link selection
- No navigation issues on mobile

#### 11.4 Verify Mobile Footer
**Steps:**
1. Set viewport to mobile size
2. Navigate to any page
3. Scroll to footer

**Expected Results:**
- Footer content is readable on mobile
- Social icons are appropriately sized for touch
- Footer navigation links are tappable
- No layout breaking issues

#### 11.5 Test Mobile Blog Search
**Steps:**
1. Set viewport to mobile size
2. Navigate to `/blog`
3. Use the search functionality

**Expected Results:**
- Search box is accessible and usable on mobile
- Keyboard appears when tapping search box
- Search results display correctly on mobile
- Results are scrollable

#### 11.6 Verify Mobile Color Mode Switcher
**Steps:**
1. Set viewport to mobile size
2. Navigate to any page
3. Locate and use color mode button

**Expected Results:**
- Color mode button is accessible on mobile
- Button is properly sized for touch interaction
- Color mode changes work correctly on mobile
- Visual feedback is provided when tapping

---

### 12. Performance and Loading

**Seed:** `tests/seed.spec.ts`

#### 12.1 Verify Initial Page Load Time
**Steps:**
1. Navigate to the home page
2. Measure page load time (using browser tools or Playwright metrics)
3. Check for loading indicators

**Expected Results:**
- Page loads within reasonable time (< 3 seconds on normal connection)
- No long blocking operations
- Content is progressively rendered
- No significant layout shifts during load

#### 12.2 Test Navigation Speed
**Steps:**
1. Navigate to the home page
2. Click navigation link to another page (e.g., Blog)
3. Measure navigation time
4. Repeat for multiple pages

**Expected Results:**
- Page transitions are fast (< 1 second)
- No loading spinners or delays
- Content appears quickly
- Browser back/forward buttons work correctly

#### 12.3 Verify Image Loading
**Steps:**
1. Navigate to pages with images (e.g., Podcasts, About)
2. Observe image loading behavior
3. Check for lazy loading

**Expected Results:**
- Images load progressively or use lazy loading
- No broken image icons
- Images have proper dimensions and don't cause layout shift
- Alt text is present for accessibility

#### 12.4 Test Blog Search Performance
**Steps:**
1. Navigate to `/blog`
2. Type a search query
3. Observe search result speed

**Expected Results:**
- Search results appear instantly or very quickly (< 500ms)
- No lag when typing
- Results update smoothly
- No performance issues with large result sets

---

### 13. Pagination and "View All" Links

**Seed:** `tests/seed.spec.ts`

#### 13.1 Verify Blog Pagination Link
**Steps:**
1. Navigate to `/blog`
2. Scroll to bottom of Recent Posts section
3. Click "View All Posts" link

**Expected Results:**
- Link navigates to `/blog/page/1`
- All blog posts are displayed (or paginated)
- Pagination controls are visible if more than one page
- Back navigation works correctly

#### 13.2 Verify Videos "View All" Link
**Steps:**
1. Navigate to `/videos`
2. Locate "View All Videos" link
3. Click the link

**Expected Results:**
- Link navigates to `/videos/all`
- Complete list of videos is displayed
- Page layout is appropriate for full list
- Navigation back to main videos page works

---

### 14. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 14.1 Test 404 Page (Non-existent URL)
**Steps:**
1. Navigate to a non-existent URL (e.g., `/this-page-does-not-exist`)
2. Verify 404 page appears

**Expected Results:**
- Custom 404 page is displayed
- Page indicates the content was not found
- Navigation menu is still accessible
- User can navigate back to valid pages
- "NotFound" component is rendered

#### 14.2 Test Blog Post with No Next/Previous
**Steps:**
1. Navigate to the first or last blog post
2. Check for next/previous navigation

**Expected Results:**
- If first post: no previous link is shown
- If last post: no next link is shown
- No broken links or errors
- Page renders correctly without both links

#### 14.3 Test Empty Search Results
**Steps:**
1. Navigate to `/blog`
2. Search for a term that doesn't match any posts (e.g., "xyznonexistent")
3. Verify behavior

**Expected Results:**
- "Search Results (0)" or similar message is displayed
- No posts are shown in results
- No errors or broken UI
- User can clear search and return to normal view

#### 14.4 Test Tag with No Posts
**Steps:**
1. Navigate to a tag filter URL that may have no posts (if any exist)
2. Verify page behavior

**Expected Results:**
- Page loads without error
- Empty state message may be shown
- Or "0 posts" indicator
- Navigation remains functional

#### 14.5 Test Missing Podcast Image
**Steps:**
1. Navigate to `/podcasts`
2. Check if any podcasts have broken images

**Expected Results:**
- All podcast images load successfully
- If an image is missing, alt text is displayed
- No broken image icons
- Layout is not broken by missing images

---

### 15. Accessibility

**Seed:** `tests/seed.spec.ts`

#### 15.1 Verify Semantic HTML Structure
**Steps:**
1. Navigate to any page
2. Inspect the HTML structure using accessibility tree

**Expected Results:**
- Page uses semantic HTML elements:
  - `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
  - Proper heading hierarchy (h1 -> h2 -> h3)
  - `<time>` elements for dates
  - `<button>` for interactive elements
- Navigation uses `<nav>` and list elements
- Content is wrapped in appropriate semantic tags

#### 15.2 Verify Heading Hierarchy
**Steps:**
1. Navigate to each main page
2. Check heading levels using accessibility tools

**Expected Results:**
- Each page has exactly one h1 (page title)
- Headings follow logical order (no skipping levels)
- Sections use h2 for main sections
- Subsections use h3
- No heading level is skipped (e.g., h1 -> h3)

#### 15.3 Test Keyboard Navigation
**Steps:**
1. Navigate to the home page
2. Use Tab key to navigate through interactive elements
3. Use Enter/Space to activate elements
4. Test on multiple pages

**Expected Results:**
- All interactive elements are keyboard accessible
- Tab order is logical and follows visual flow
- Focus indicator is visible on focused elements
- No keyboard traps
- Links, buttons, and form controls can be activated via keyboard

#### 15.4 Verify Link Text and Accessibility
**Steps:**
1. Navigate to any page
2. Locate all links
3. Check link text

**Expected Results:**
- Links have descriptive text (not just "click here")
- External links may indicate they open in new tab
- Link purpose is clear from link text alone
- Links within paragraphs are distinguishable

#### 15.5 Verify Image Alt Text
**Steps:**
1. Navigate to pages with images (About, Podcasts)
2. Inspect image elements
3. Check for alt attributes

**Expected Results:**
- All images have alt attributes
- Alt text is descriptive and meaningful
- Decorative images may have empty alt (`alt=""`)
- Logo images have appropriate alt text

#### 15.6 Test Color Contrast
**Steps:**
1. Navigate to any page in light mode
2. Check text color contrast using accessibility tools
3. Switch to dark mode and repeat

**Expected Results:**
- Text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Links are distinguishable from surrounding text
- Dark mode also maintains sufficient contrast
- No color-only indicators for important information

#### 15.7 Verify Form Accessibility (Search)
**Steps:**
1. Navigate to `/blog`
2. Locate search box
3. Inspect search form accessibility

**Expected Results:**
- Search box has proper role="searchbox"
- Search box has accessible name/label
- Placeholder text is supplementary, not the only label
- Search is keyboard accessible

---

### 16. Content Integrity

**Seed:** `tests/seed.spec.ts`

#### 16.1 Verify Blog Post Content Rendering
**Steps:**
1. Navigate to multiple blog posts
2. Verify markdown content renders correctly

**Expected Results:**
- Paragraphs are properly spaced
- Lists are formatted correctly
- Code blocks have syntax highlighting
- Headings are styled appropriately
- Links are functional
- No raw markdown syntax visible

#### 16.2 Verify Code Block Syntax Highlighting
**Steps:**
1. Navigate to a blog post with code examples
2. Locate code blocks
3. Verify syntax highlighting

**Expected Results:**
- Code blocks have syntax highlighting
- Language is detected correctly
- Line numbers are present
- Code is readable with proper colors
- Copy button may be present

#### 16.3 Verify External Links Open Correctly
**Steps:**
1. Navigate to various pages
2. Click external links (course links, podcast links, social links)
3. Verify behavior

**Expected Results:**
- External links open in new tab/window or same tab consistently
- Links to external platforms work correctly
- No broken external links
- External link indicator may be present (icon or text)

#### 16.4 Verify Date Formatting
**Steps:**
1. Navigate to pages with dates (Blog, Videos, Podcasts)
2. Check date display

**Expected Results:**
- Dates are displayed in consistent format (e.g., "July 10, 2025")
- Dates use `<time>` element with datetime attribute
- Recent dates are accurate
- Date sorting is correct (newest first)

---

### 17. Tags and Filtering Consistency

**Seed:** `tests/seed.spec.ts`

#### 17.1 Verify Tag Normalization
**Steps:**
1. Navigate to `/blog`
2. Observe tag list (e.g., "AI", "ai", "MCP", "mcp")
3. Click different case variations

**Expected Results:**
- Tags may have case variations (AI vs ai)
- Clicking a tag filters correctly regardless of case
- Tag URLs handle case consistently
- Posts are tagged appropriately

#### 17.2 Test Tag Links from Content
**Steps:**
1. Navigate to `/blog`
2. Click a tag on a blog post card
3. Verify navigation

**Expected Results:**
- Clicking tag from post card navigates to tag filter page
- Tag filter shows all posts with that tag
- Back navigation works correctly

#### 17.3 Verify Tag Consistency Across Content Types
**Steps:**
1. Navigate to Blog and note tags
2. Navigate to Videos and note tags
3. Navigate to Podcasts and note tags
4. Compare tag naming

**Expected Results:**
- Common tags (like "playwright", "testing") appear across content types
- Tag naming is consistent where appropriate
- Each content type may have unique tags
- Tags are lowercase in URLs

---

### 18. Video Embed Functionality

**Seed:** `tests/seed.spec.ts`

#### 18.1 Verify YouTube Embed in Blog Post
**Steps:**
1. Navigate to a blog post with embedded YouTube video
2. Locate the video iframe
3. Interact with video controls

**Expected Results:**
- YouTube video player is embedded correctly
- Player controls are functional:
  - Play/pause button
  - Volume control
  - Fullscreen button
- Video does not autoplay
- "Watch on YouTube" link is present

#### 18.2 Verify Video Embed Responsive Behavior
**Steps:**
1. Navigate to blog post with video
2. Resize browser window or change to mobile viewport
3. Observe video player

**Expected Results:**
- Video player scales appropriately
- Aspect ratio is maintained
- Player is fully visible without horizontal scroll
- Controls remain accessible

---

### 19. Site-wide Consistency

**Seed:** `tests/seed.spec.ts`

#### 19.1 Verify Consistent Header Across Pages
**Steps:**
1. Navigate through all main pages
2. Observe header structure

**Expected Results:**
- Header is consistent on all pages
- Logo position and styling is the same
- Navigation menu is identical
- Social links are present on all pages
- Color mode button is always accessible

#### 19.2 Verify Consistent Footer Across Pages
**Steps:**
1. Navigate through all main pages
2. Scroll to footer on each page
3. Compare footer content

**Expected Results:**
- Footer is identical on all pages
- Navigation links are consistent
- Social links are complete and ordered the same
- Copyright text is present
- Footer styling is consistent

#### 19.3 Verify Active Navigation State
**Steps:**
1. Navigate to each main page via menu
2. Observe active navigation indicator

**Expected Results:**
- Current page is highlighted in navigation menu
- Active state is visually distinct (different color, underline, etc.)
- Active state updates correctly on navigation
- Active state is clear and obvious

---

### 20. Performance Under Load

**Seed:** `tests/seed.spec.ts`

#### 20.1 Test Multiple Rapid Page Navigations
**Steps:**
1. Navigate to home page
2. Rapidly click through multiple navigation links in succession
3. Observe behavior

**Expected Results:**
- All navigations complete successfully
- No errors or broken states
- Page content loads correctly each time
- No memory leaks or performance degradation

#### 20.2 Test Tag Filter Changes in Rapid Succession
**Steps:**
1. Navigate to `/blog`
2. Rapidly click different tag filters
3. Observe filtering behavior

**Expected Results:**
- Tag filters respond quickly
- Content updates correctly for each tag
- No race conditions or incorrect results
- Final displayed content matches final selected tag

#### 20.3 Test Search Performance with Rapid Typing
**Steps:**
1. Navigate to `/blog`
2. Rapidly type and delete characters in search box
3. Observe search results

**Expected Results:**
- Search handles rapid input without lag
- Results update smoothly
- No errors or broken UI
- Search completes with correct final results

---

## Test Environment Setup

### Prerequisites
- Node.js (version specified in package.json)
- npm or yarn package manager
- Playwright browsers installed (`npx playwright install`)

### Local Development Server
- Start dev server: `npm run dev`
- Default port: `http://localhost:3020`
- Server must be running before executing tests

### Test Execution Commands
- Run all tests: `npx playwright test --project=chromium`
- Run specific test file: `npx playwright test tests/home.spec.ts`
- Run in headed mode: `npx playwright test --headed`
- Run in UI mode: `npx playwright test --ui`
- View test report: `npx playwright show-report`

---

## Notes for Testers

1. **State Management**: Most tests should start from a fresh page state. Use `beforeEach` to navigate to the starting URL.

2. **Async Operations**: All Playwright actions are async and have built-in auto-waiting. Use `await` for all assertions.

3. **Test Independence**: Tests should be independent and not rely on the state from previous tests.

4. **Locator Strategy**: Prefer user-facing locators:
   - `getByRole()` for semantic elements
   - `getByLabel()` for form fields
   - `getByText()` for text content
   - Avoid CSS selectors when possible

5. **Assertions**: Use web-first assertions that auto-retry:
   - `await expect(locator).toBeVisible()`
   - `await expect(locator).toHaveText()`
   - `await expect(page).toHaveURL()`

6. **External Links**: Some tests involve external links. Be mindful of:
   - Network dependencies
   - Rate limiting on external services
   - Consider mocking or stubbing external requests in CI

7. **Content Updates**: Content (blog posts, videos, podcasts) may be added over time. Tests should be resilient to:
   - New content additions
   - Count changes (use minimum expectations or exact snapshots)
   - Featured content changes

8. **Mobile Testing**: Some scenarios include mobile viewport testing. Use Playwright's device emulation features.

9. **Accessibility Testing**: Use `toMatchAriaSnapshot()` for accessibility tree assertions. Include proper YAML structure without text content.

10. **Color Mode**: Tests involving color mode should consider:
    - Initial state (system preference)
    - Persistence across navigation
    - Visual differences between modes

---

## Priority Levels

### High Priority (Must Test)
- Home page content display
- Navigation functionality (all pages accessible)
- Blog search and filtering
- Tag filtering across all content types
- External links to courses, podcasts, videos
- 404 error handling
- Mobile responsive design
- Keyboard accessibility

### Medium Priority (Should Test)
- Color mode switching and persistence
- Pagination and "View All" functionality
- Individual blog post layout
- Video embeds in blog posts
- Social links functionality
- Form accessibility (search)
- Performance under normal load

### Low Priority (Nice to Test)
- Edge cases (empty search, missing images)
- Advanced accessibility features
- Performance under rapid interaction
- Tag normalization details
- Specific content formatting details

---

## Future Enhancements

### Potential Test Scenarios for Future Consideration
1. RSS feed functionality (if implemented)
2. Newsletter subscription (if implemented)
3. Comment system (if implemented)
4. Search with special characters or Unicode
5. SEO metadata verification
6. Open Graph / Twitter Card meta tags
7. Sitemap verification
8. Analytics tracking (if applicable)
9. Cookie consent (if applicable)
10. Multi-language support (if planned)
11. Print stylesheet / print view
12. Share buttons functionality (if added)
13. Related posts suggestions
14. Search autocomplete (if implemented)
15. Infinite scroll on long lists (if implemented)

---

## Conclusion

This comprehensive test plan covers the major functionality and user flows of the debbie.codes website. The scenarios are designed to ensure quality, accessibility, and performance across all pages and features. Each scenario includes clear steps and expected results to guide manual or automated testing efforts.

The test plan should be reviewed and updated regularly as the site evolves and new features are added.

# Priority journeys (debbie.codes)

Use these as an exploration map for `site-bug-hunt`. Paths are site-relative.

## Home (`/`)

- Header / name / role intro  
- Award badges  
- Featured posts / podcasts  
- Recent blog, videos, podcasts sections  
- Footer links  

## Blog

- `/blog` — list, search, tag filters, year navigation  
- Open a post (`/blog/<slug>`) — title, content, prev/next if present  
- Tag pages / year pages linked from the UI  

## Videos / podcasts / courses

- `/videos`, `/podcasts`, `/courses` — grids/lists render  
- Filters/tags when present  
- Card links: internal vs external (external should not break the shell)  

## About & chrome

- `/about` — bio and key links  
- Desktop nav + mobile nav  
- Color mode toggle (light/dark/system if offered)  

## Error paths

- Unknown route → sensible 404  

## Related automated coverage

Existing specs live in `tests/`. Prefer discovering gaps the suite doesn’t cover (visual breakage, wrong filter results, dead featured links, mobile nav traps) rather than only re-walking what CI already asserts.

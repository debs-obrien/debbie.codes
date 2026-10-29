# Image & media audit (PR #688 follow-up)

Audit of every asset under `public/images/**` plus OG cards, Nuxt Image usage, loading/LCP, cache headers, and budgets.

## Totals

| Bucket | Before | After | Δ |
|---|---:|---:|---:|
| All images (`public/images/**`) | 31.63 MB | 23.15 MB | -8.48 MB |
| Content images (`…/content/`) | 23.56 MB | 21.39 MB | -2.17 MB |
| Media (mp4/mp3) | 27.31 MB | 21.97 MB | -5.34 MB |
| Asset counts | 320 img / 11 media | 321 img / 11 media | |

## Budgets

| | Scope | Budget (measured + ~10%) |
|---|---|---:|
| Images | `public/images/**` + OG JPEGs | **26 MB** |
| Media | `public/images/content/**` mp4/mp3/… | **24.2 MB** |

Enforced by `scripts/check-image-budgets.mjs` (CI content-check) and `scripts/cloudinary/convert.mjs`.

## Biggest wins

- **59 PNG → WebP** under `public/images/blog/` (covers + inline screenshots), masters resized to display needs (covers ≤1200, ken cards 1280).
- **65 WebP re-encodes**: photos ~q75–78, screenshots q82 (lossless tried when smaller), metadata stripped via sharp.
- **Avatar** `debbie-thumb.webp` 512→320 (2× of 160 CSS) — 36 KB → 14 KB.
- **10 MP4s**: H.264, `-an`, `+faststart`, CRF 28, width capped ~960 (GIF loops left at native size).
- **OG cards**: `x-card.jpg` / `twitter-card.jpg` / `x-card-blog.jpg` at 1200×630 JPEG under 300 KB; app/feed defaults updated.
- **Cache**: `Cache-Control: public, max-age=31536000, immutable` for `/images/*` and `/.netlify/images`.

## q82 / large WebP leftovers (>200 KB) and why

| File | KB | Dims | Why still large |
|---|---:|---|---|
| `public/images/content/blog/2022/race-ireland_amyqrb.webp` | 630.4 | 1640x2187 | Tall portrait photo at full content width (≤1640); detail-heavy subject |
| `public/images/content/blog/2022/cycling-with-girls_nh2k0q.webp` | 629.6 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/running-trail_qjlb9h.webp` | 626.7 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/meteora-greece_wqumec.webp` | 465.9 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2026/family-microsoft.webp` | 417.4 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/IMG_2873_qxkes9.webp` | 382.1 | 1640x2187 | Tall portrait photo at full content width (≤1640); detail-heavy subject |
| `public/images/content/blog/2022/me_running_q64fvs.webp` | 370.4 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/microsoft-running_gztjdu.webp` | 324.6 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/Screenshot_2020-12-31_at_18.14.59_sbfsen.webp` | 322.9 | 1386x1838 | UI/screenshot with text — kept sharper quality; further loss would soft-edge type |
| `public/images/content/blog/2022/IMG_5391_pp2gha.webp` | 314.8 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/pyramids_fzo4p9.webp` | 303.6 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/IMG_5386_rp8hwx.webp` | 294.1 | 1640x923 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/min-in-pool_mcdqya.webp` | 284 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/speakers-ghent_r9bdnv.webp` | 257.1 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2025/GitHub_MCP_server_2x_1_jizwlw.webp` | 244.5 | 1024x1024 | UI/screenshot with text — kept sharper quality; further loss would soft-edge type |
| `public/images/content/blog/2022/4AD3BD54-DC34-4CDB-B746-39CC9323765D_blkyz5.webp` | 238.3 | 1640x2187 | Tall portrait photo at full content width (≤1640); detail-heavy subject |
| `public/images/content/blog/2022/canaries_dkkzgg.webp` | 233.8 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/devs-in-the-forest_c_gctzoz.webp` | 230.3 | 1024x768 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/IMG_8227_bav9rh.webp` | 220.7 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/2022/IMG_5374_mfqmx7.webp` | 213.7 | 1640x1230 | Wide photo master at max content width (≤1640 = 2× ~820 CSS) |
| `public/images/content/blog/bad-waterfall-view_xlgw0k.webp` | 206.2 | 1640x1579 | UI/screenshot with text — kept sharper quality; further loss would soft-edge type |

## Top 20 largest assets after fixes

| File | KB |
|---|---:|
| `public/images/content/blog/2022/race-ireland_amyqrb.webp` | 630.4 |
| `public/images/content/blog/2022/cycling-with-girls_nh2k0q.webp` | 629.6 |
| `public/images/content/blog/2022/running-trail_qjlb9h.webp` | 626.7 |
| `public/images/content/blog/2022/meteora-greece_wqumec.webp` | 465.9 |
| `public/images/content/blog/2026/family-microsoft.webp` | 417.4 |
| `public/images/content/blog/2022/IMG_2873_qxkes9.webp` | 382.1 |
| `public/images/content/blog/2022/me_running_q64fvs.webp` | 370.4 |
| `public/images/content/blog/2022/microsoft-running_gztjdu.webp` | 324.6 |
| `public/images/content/blog/Screenshot_2020-12-31_at_18.14.59_sbfsen.webp` | 322.9 |
| `public/images/content/blog/2022/IMG_5391_pp2gha.webp` | 314.8 |
| `public/images/content/blog/2022/pyramids_fzo4p9.webp` | 303.6 |
| `public/images/content/blog/2022/IMG_5386_rp8hwx.webp` | 294.1 |
| `public/images/content/blog/2022/min-in-pool_mcdqya.webp` | 284.0 |
| `public/images/content/blog/2022/speakers-ghent_r9bdnv.webp` | 257.1 |
| `public/images/content/blog/2025/GitHub_MCP_server_2x_1_jizwlw.webp` | 244.5 |
| `public/images/content/blog/2022/4AD3BD54-DC34-4CDB-B746-39CC9323765D_blkyz5.webp` | 238.3 |
| `public/images/content/blog/2022/canaries_dkkzgg.webp` | 233.8 |
| `public/images/content/blog/devs-in-the-forest_c_gctzoz.webp` | 230.3 |
| `public/images/content/blog/IMG_8227_bav9rh.webp` | 220.7 |
| `public/images/content/blog/2022/IMG_5374_mfqmx7.webp` | 213.7 |

## OG JPEGs

| File | KB |
|---|---:|
| `public/x-card.jpg` | 45.4 |
| `public/twitter-card.jpg` | 45.4 |
| `public/x-card-blog.jpg` | 73.2 |

## NuxtImg / loading checklist

| Page | LCP image | `loading` / `fetchpriority` | Notes |
|---|---|---|---|
| `/` | Featured YT thumb (desktop LCP) | eager + high | CreativeHero avatar eager without high (one `fetchpriority=high` on the page); home blog covers lazy |
| `/blog` | Lead cover | eager + high + preload | Imgix `provider` restored for remaining hostless covers; compact covers lazy |
| `/blog/[slug]` | Article cover | eager + high + preload | `provider` restored; `sizes="xs:100vw sm:576px"` |
| `/videos` | Featured YT thumb | preload + high | Plain `<img>` (YouTube) keeps native `sizes` |
| `/podcasts` | FeaturedPodcast | eager + high via `priority` | `sizes="xs:100vw md:400px"` + `densities="x1"` (mobile ~320–400w); grid cards lazy |
| `/hire-me` | (no local hero image) | — | Voice widget only |
| `/about` | Avatar | eager + high | |

`sizes` must use Nuxt breakpoint keys (`xs:100vw …`). A bare `100vw` is parsed as screen `1px` and emits junk `1w`/`2w` srcset candidates with densities. ProseImg → `xs:100vw lg:820px`. Screens config dropped unused `xxl`/`2xl`. FeaturedPodcast uses `densities="x1"` so LCP is not forced to 800w.

## Deploy-preview follow-up (post-`ddaa0b1`)

| Issue | Fix |
|---|---|
| MAB #19 `i.ytimg.com` → Netlify Image CDN 400 | Local WebP `mab-podcast-19-hqdefault.webp`; crawl fails on any `/.netlify/images` 4xx |
| Home mobile eager blog covers + YT competing with hero | Compact covers lazy; Featured YT is the sole `fetchpriority=high` (desktop LCP); hero stays eager without high |
| Junk `1w`/`2w` srcset on prose + FeaturedPodcast | Prefix bare `100vw` with `xs:`; FeaturedPodcast `densities="x1"` |
| `/podcasts` mobile LCP ~800px | FeaturedPodcast sizes + x1 densities → ~320–400w |
| Coffee logo tighter crop | Re-encoded square master with `contain` pad (white) so `object-cover` shows full logo |

## Videos

All 10 MP4s: H.264, no audio, faststart, `preload="none"` (or metadata) off-screen; autoplay loops keep `muted loop playsinline`. GIF→MP4 swaps keep accessible names (`aria-label`). Poster images retained.

## Intentionally unchanged

- **`debbie_ewgkaa.mp3` (~17 MB)** — podcast audio sample, not a video; re-encoding would change fidelity without helping LCP.
- **Portrait photos still >200 KB after q75** — already at max useful width (1640 = 2× ~820 CSS body); further quality cuts softens faces/landscapes with little CLS/LCP gain.
- **Screenshot WebPs kept lossy q82** when lossless was larger.
- **Unsplash/imgix covers** still remote (out of Cloudinary migration scope). Cover `image:` paths keep the photo id only (no `?…` query) so the imgix provider can append `?w=` without producing `fit=crop?w=` CLS bugs.
- **Raster favicons / PWA icons** under `public/*.png` — platform requirements; not content masters.
- **`scripts/cloudinary/`** kept on purpose as the migration audit trail (download/convert reports, ID maps). Delivery no longer uses Cloudinary; do not delete these scripts/reports.

## Main merge follow-up (post-`e2f5a66`)

| Issue | Fix |
|---|---|
| Merge `main` (#680 privacy + #677 hire-me post) | Normal merge commit; `blog-card-covers` keeps dynamic `leadSlug` + lazy home covers |
| #677 local images | Cover + inline screenshots converted PNG→WebP under `public/images/blog/` (already local, no Cloudinary) |
| Desktop home LCP was lazy YT thumb | `FeaturedVideoSection` main thumb `eager` + `fetchpriority=high`; CreativeHero drops high so only one high per page |
| `discord-virtual-office` cover `fit=crop?w=` CLS | Strip query from imgix `image:` paths; replace literal second `?` with `&` in ogImage URLs |
| Prose Unsplash → Netlify CDN 400 | ProseImg only Nuxt-optimizes `remote_images` hosts; Unsplash/YouTube stay plain `<img>` |

## Review follow-up (post-`4fa0d54`)

| Issue | Fix |
|---|---|
| Crawl skipped `/.netlify/images?url=…unsplash…` | Skip only hostname `images.unsplash.com`; never skip CDN URLs; never skip cover/og |
| Soft vs hard media failures | Fail 404/410 (and other 4xx except soft); warn only on 403/429/5xx |
| Flaky 150 ms settle | Scroll to bottom + await image load/decode before asserts |
| Missing dims on `/images/blog/` prose | Real width/height on 17 masters; crawl checks blog + podcasts paths |
| Course thumbs via Netlify 400 (`i.ytimg.com`) | Shared `utils/remote-images.ts` allowlist; `Item.vue` plain `<img>` when host not allowed |
| Unused OG PNGs | Deleted `public/x-card.png`, `twitter-card.png`, `x-card-blog.png` (JPEG defaults remain) |
| Honest `og:image:width/height` | Emit 1200×630 only when URL is truly that size; Unsplash OG get `w=1200&h=630&fit=crop&fm=jpg&q=80` |
| Click-to-play a11y | `aria-label` on 7 videos from commented titles; color-mode video gets real 960×622 height |
| Cloudinary scan gaps | `check-no-cloudinary.mjs` also scans `server/`, `composables/`, `plugins/`, `app.vue` |
| Audit trail | Leave `scripts/cloudinary/` in place (see Intentionally unchanged) |

## SVG

No new logo/icon rasters found that should be SVG; existing site icons remain as required PNGs for PWA/favicon. No SVGO candidates in `public/images/content/`.

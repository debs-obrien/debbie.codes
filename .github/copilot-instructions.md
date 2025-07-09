# Copilot Instructions for debbie.codes

## Project Overview
- This is a Nuxt 3 static site, using Nuxt Content v2 for markdown-driven content (blog, videos, etc.).
- The project is a playground for experimentation, so expect evolving patterns and some non-standard structures.
- All content lives in the `content/` directory, organized by type (blog, podcasts, videos, etc.).
- Components are in `components/`, with subfolders for feature grouping (e.g., `blog/`, `tags/`, `icon/`).
- Pages are in `pages/`, using Nuxt's file-based routing. Dynamic routes use `[...slug].vue`.

## Key Workflows
- **Install dependencies:** `npm install` (or `yarn install`)
- **Start dev server:** `npm run dev` (see VS Code task `dev-server`)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Run Playwright tests:** `npx playwright test --project=chromium`

## Testing & Conventions
- All Playwright tests are in `tests/`, one file per major feature/page, named `<feature>.spec.ts`.
- Follow Playwright test guidelines in `.github/instructions/playwright.instructions.md` (locators, assertions, structure, etc.).
- Use role-based/user-facing locators in tests. Prefer `test.step()` for grouping actions.
- Use `toMatchAriaSnapshot` for accessibility tree assertions, referencing the correct URL in the YAML.

## Patterns & Structure
- **Content:** Markdown files in `content/` are auto-routed and rendered by Nuxt Content.
- **Components:** Prefer composition and slot usage. Many components are small, focused, and reused.
- **Navigation:** Main navigation is in `components/TheNavigation.vue` and `components/TheTopBar.vue`.
- **Styling:** Uses Tailwind CSS (`tailwind.config.ts`, `assets/css/main.css`).
- **Config:** Nuxt config in `nuxt.config.ts`. Tailwind, ESLint, and TypeScript configs are present.

## Integration Points
- **Nuxt Content v2:** For all markdown content rendering and querying.
- **Playwright:** For E2E and accessibility testing. See `playwright.config.ts` and `tests/`.
- **Netlify:** Deployment via `netlify.toml` (static hosting).

## Examples
- To add a new blog post: create a markdown file in `content/blog/`.
- To add a new test: create a file in `tests/` following the naming and structure conventions.

## References
- See `README.md` for setup and workflow basics.
- See `.github/instructions/playwright.instructions.md` for Playwright test details.
- See `nuxt.config.ts` for Nuxt-specific configuration.

---
If you are unsure about a pattern or workflow, prefer to check for similar examples in the codebase (especially in `components/`, `tests/`, and `content/`).

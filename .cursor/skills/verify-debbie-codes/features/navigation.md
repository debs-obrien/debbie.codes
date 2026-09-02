# Navigation

Header and footer lists take a visitor to About, Videos, Podcasts, Courses, and Blog. On a narrow viewport the header list is behind Open menu.

## Sub-features

- `nav-header` follows each desktop header link to the matching URL.
- `nav-footer` follows each footer link (desktop).
- `nav-logo` returns to `/`.
- `nav-mobile` opens and closes the overlay and follows a link.

## How to get to it (user POV)

- Use the header `navigation` on viewports `lg` and up.
- Use the footer `contentinfo` list of page links.
- On a 375-wide viewport, choose `Open menu`, then a header link.

## Driving it with verify-debbie-codes

Preconditions:

- Doctor reports `OK`.
- Scope links to `navigation` or `contentinfo`. The same names exist in both.

- **Desktop tour.** Run `.cursor/skills/verify-debbie-codes/bin/verify drive navigation`. After About, Videos, and Blog clicks the URL is `/blog`.
- **Logo.** Choose `Debbie O'Brien Debbie O'Brien`. The URL is `/`.
- **Mobile open.** Set viewport 375×667. Choose `Open menu` until `Close menu` with text `✕` is visible, then choose `Videos`. The URL is `/videos` and the hamburger name is `Open menu` again.
- **Proof.** `navigation-after.png` and `navigation.aria.yml` list About, Videos, Podcasts, Courses, Blog.

## Gotchas

- Clicks before hydration no-op. Retry until the URL or overlay actually changes (`tests/mobile-navigation.spec.ts`).
- A Wave B branch may add Speaking and Now. On `main` those links are absent.
- Footer mobile coverage is skipped in `tests/navigation.spec.ts`; still prove footer on desktop.

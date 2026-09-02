# Navigation

Header and footer lists take a visitor to About, Speaking, Videos, Podcasts, Courses, Blog, and Now. On a narrow viewport the header list is behind Open menu.

## Sub-features

- `nav-header` follows each desktop header link to the matching URL.
- `nav-footer` follows each footer link (desktop).
- `nav-logo` returns to `/`.
- `nav-mobile` opens and closes the overlay and follows a link.

## How to get to it (user POV)

- Use the header `navigation` on viewports `lg` and up.
- Use the footer `contentinfo` list of page links.
- On a 375-wide viewport, choose `Open menu`, then a header link.

## Driving it with control-debbie-codes

Preconditions:

- Doctor reports healthy.
- Scope links to `navigation` or `contentinfo`. The same names exist in both.

- **Desktop tour.** Run `node .cursor/skills/verify-debbie-codes/control-debbie-codes.mjs drive navigation --json`. After About, Speaking, Videos, Podcasts, Courses, Blog, and Now, the URL is `/now`.
- **Logo.** Choose `Debbie O'Brien Debbie O'Brien`. The URL is `/`.
- **Mobile open.** Set viewport 375×667. Choose `Open menu` until `Close menu` with text `✕` is visible, then choose `Videos`. The URL is `/videos` and the hamburger name is `Open menu` again.
- **Isolated driver.** `.cursor/skills/verify-debbie-codes/bin/verify drive navigation` walks the same header links, then logo home.
- **Proof.** `navigation-proof.png` and `navigation-proof.aria.txt` list the header links.

## Gotchas

- Clicks before hydration no-op. Retry until the URL or overlay actually changes (`tests/mobile-navigation.spec.ts`).
- Current nav includes Speaking and Now. Do not assert the older five-link header.
- Footer mobile coverage is skipped in `tests/navigation.spec.ts`; still prove footer on desktop.

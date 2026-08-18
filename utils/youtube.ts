/**
 * `hqdefault.jpg` is the only thumbnail variant YouTube generates for every upload,
 * so it is the safe choice for a poster image.
 * See https://github.com/paulirish/lite-youtube-embed/blob/master/youtube-thumbnail-urls.md
 */
export function youtubeThumbnail(videoId: string) {
  const safeId = encodeURIComponent(videoId.trim())
  return `https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`
}

/**
 * Inline background image for <lite-youtube>.
 *
 * lite-youtube-embed only paints its own poster when the element has no inline
 * background-image, and it follows that with a speculative request for
 * `vi_webp/<id>/sddefault.webp`. YouTube has no sddefault.webp for older 4:3
 * uploads, so those requests 404, Chrome logs each one as a console error and
 * Lighthouse's errors-in-console audit fails on /videos/.
 *
 * Setting the poster ourselves skips both: no 404s, no extra request per embed,
 * and the poster is in the server-rendered HTML instead of waiting on JS.
 */
export function youtubePosterStyle(videoId: string) {
  return { backgroundImage: `url("${youtubeThumbnail(videoId)}")` }
}

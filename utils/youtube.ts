/**
 * YouTube thumbnail qualities used on this site.
 * `mqdefault` is 320×180 (true 16:9). `sddefault` is 640×480.
 * `hqdefault` (480×360) is generated for every upload, so it remains the
 * safe default for lite-youtube posters — see youtubePosterStyle below.
 * See https://github.com/paulirish/lite-youtube-embed/blob/master/youtube-thumbnail-urls.md
 */
export type YoutubeThumbnailQuality = 'mqdefault' | 'sddefault' | 'hqdefault'

export function youtubeThumbnail(
  videoId: string,
  quality: YoutubeThumbnailQuality = 'hqdefault',
) {
  const safeId = encodeURIComponent(videoId.trim())
  return `https://i.ytimg.com/vi/${safeId}/${quality}.jpg`
}

/**
 * Width-matched srcset for card-sized 16:9 thumbs (home featured strip).
 * Avoids shipping `hqdefault` when the display width is well under 480px.
 */
export function youtubeThumbnailSrcSet(videoId: string) {
  return `${youtubeThumbnail(videoId, 'mqdefault')} 320w, ${youtubeThumbnail(videoId, 'sddefault')} 640w`
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

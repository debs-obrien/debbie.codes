/**
 * YouTube thumbnail qualities used on this site.
 * `mqdefault` is 320×180 (true 16:9). `sddefault` is 640×480.
 * `hqdefault` (480×360) is larger; card posters use `mqdefault` via
 * youtubePosterStyle to cut image bytes on video grids.
 * In-post embeds pass `sddefault` so the poster stays sharp when stretched
 * to content width; lite-youtube's background-size: cover crops the 4:3
 * letterbox on 16:9 players.
 * See https://github.com/paulirish/lite-youtube-embed/blob/master/youtube-thumbnail-urls.md
 */
export type YouTubeThumbnailQuality = 'mqdefault' | 'sddefault' | 'hqdefault'

export function youtubeThumbnail(
  videoId: string,
  quality: YouTubeThumbnailQuality = 'mqdefault',
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
 *
 * Default `mqdefault` (320×180) keeps video grid cards small. Pass
 * `sddefault` for in-post embeds (content width ~576px+); layers `hqdefault`
 * underneath so videos that lack `sddefault` still show a poster.
 */
export function youtubePosterStyle(
  videoId: string,
  quality: YouTubeThumbnailQuality = 'mqdefault',
) {
  if (quality === 'sddefault') {
    return {
      backgroundImage: [
        `url("${youtubeThumbnail(videoId, 'sddefault')}")`,
        `url("${youtubeThumbnail(videoId, 'hqdefault')}")`,
      ].join(', '),
    }
  }
  return { backgroundImage: `url("${youtubeThumbnail(videoId, quality)}")` }
}

/**
 * Public watch link for a video. Keeps the same start offset VideoCard.vue
 * passes to <lite-youtube> (`start`, in seconds; falsy means the beginning).
 */
export function youtubeWatchUrl(videoId: string, start?: number) {
  const url = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId.trim())}`
  const seconds = Math.trunc(Number(start) || 0)
  return seconds > 0 ? `${url}&t=${seconds}s` : url
}

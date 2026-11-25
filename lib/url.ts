// Returns the trimmed URL if it is a valid absolute http(s) URL, otherwise null.
// Used to block javascript:/data:/vbscript: URIs from being stored and rendered as hrefs.
export function sanitizeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return trimmed
  } catch {
    return null
  }
}

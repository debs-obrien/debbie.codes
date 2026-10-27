export function originTrialMeta(chrome: unknown, edge: unknown) {
  return [chrome, edge].flatMap((token) => {
    if (typeof token !== 'string')
      return []
    const content = token.trim()
    if (!content)
      return []
    return [{ httpEquiv: 'origin-trial', content }]
  })
}

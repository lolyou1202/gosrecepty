export function parseArrayFromString(
  value: unknown,
  separator: string = ','
): string[] {
  if (typeof value === 'string') {
    return value
      .split(separator)
      .map(s => s.trim())
      .filter(Boolean)
  }

  return []
}

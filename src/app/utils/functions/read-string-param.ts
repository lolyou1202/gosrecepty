export function readStringParam(
  key: string,
  params?: Record<string, unknown>
): string | null {
  const val = params?.[key]
  return typeof val === 'string' ? val : null
}

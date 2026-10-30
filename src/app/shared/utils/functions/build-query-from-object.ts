export function buildQueryFromObject(
  params?: Record<string, string | number | boolean | string[] | number[]>
): Record<string, string> {
  if (!params) return {}

  const result: Record<string, string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') return

    if (Array.isArray(value)) {
      if (value.length > 0) {
        result[key] = value.map(v => String(v)).join(',')
      }
      return
    }

    result[key] = String(value)
  })

  return result
}

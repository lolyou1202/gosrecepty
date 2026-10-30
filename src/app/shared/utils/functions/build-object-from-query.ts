export function buildObjectFromQuery(
  params: Record<string, string>
): Record<string, string> {
  const object: Record<string, string> = {}

  Object.entries(data.form).forEach(([key, vals]) => {
    if (vals?.length) {
      params[key] = vals.join(',')
    }
  })

  if (data.form?.trim()) {
    params['search'] = data.form.trim()
  }

  Object.entries(data.chips).forEach(([key, vals]) => {
    if (vals?.length) {
      params[key] = vals.join(',')
    }
  })

  return params
}

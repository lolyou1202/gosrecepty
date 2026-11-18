export function findById<T extends { id: string | number }>(
  items: readonly T[],
  id: string | number
): T | null {
  return items.find(item => item.id === id) ?? null
}

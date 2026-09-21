export function isOneOf<T extends readonly unknown[]>(
  value: unknown,
  allowedValues: T
): value is T[number] {
  return allowedValues.includes(value as T[number])
}

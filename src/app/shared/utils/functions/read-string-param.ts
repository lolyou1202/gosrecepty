import { Nullable } from '../types/nullable'

export function readStringParam(
  params: Record<string, unknown>,
  key: string
): Nullable<string> {
  const val = params?.[key]
  return typeof val === 'string' ? val : null
}

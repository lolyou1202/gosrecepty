export type FilterChip = {
  name: string
  label: string
}
export interface FilterChipDisplayed extends FilterChip {
  active: boolean
}
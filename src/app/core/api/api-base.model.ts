export interface ApiOptions {
	select?: string[]
	search?: { field: string; value: string }[]
	filters?: Record<
		string,
		string | number | boolean | (string | number | boolean)[]
	>
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: SortOrder
}

export type SortOrder = 'asc' | 'desc'

export interface PagingApiResponse<T> {
  meta: {
    total_pages: number
    total_items: number
    current_page: number
    per_page: number
    remaining_count: number
  }
  items: T[]
}

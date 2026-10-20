import { SortOrder } from '@shared/data/filter-from-path/pagination-sort.service'

export interface ApiOptions {
  select?: string[]
  search?: { name: string; value: string }[]
  filters?: Record<
    string,
    string | number | boolean | (string | number | boolean)[]
  >
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
}

export interface RawPagingMeta {
  total_items: number
  total_pages: number
  current_page: number
  per_page: number
  remaining_count: number
}

export interface RawPagingApiResponse<T> {
  meta: RawPagingMeta
  items: T[]
}

export interface PagingMeta {
  totalItems: number
  totalPages: number
  currentPage: number
  perPage: number
  remainingCount: number
}

export interface PagingApiResponse<T> {
  meta: PagingMeta
  items: T[]
}

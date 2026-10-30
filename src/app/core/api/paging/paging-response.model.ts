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

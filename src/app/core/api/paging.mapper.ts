import { RawPagingApiResponse, PagingApiResponse } from './api-base.model'

export function mapPagingResponse<T>(
  raw: RawPagingApiResponse<T>
): PagingApiResponse<T> {
  return {
    meta: {
      totalItems: raw.meta.total_items,
      totalPages: raw.meta.total_pages,
      currentPage: raw.meta.current_page,
      perPage: raw.meta.per_page,
      remainingCount: raw.meta.remaining_count
    },
    items: raw.items
  }
}

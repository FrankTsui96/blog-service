export interface PaginationResult<T> {
  records: T[];
  page: number;
  pageSize: number;
  total: number;
}

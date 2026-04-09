/** 分页数据接口 */
export interface PaginationResult<T> {
  records: T[];
  page: number;
  pageSize: number;
  total: number;
}

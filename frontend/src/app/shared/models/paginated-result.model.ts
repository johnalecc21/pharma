export interface PaginatedResult<T> {
  data: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

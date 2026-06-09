import { z } from "zod";

export const paginateQuerySchema = z.object({
  pageIndex: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export type PaginateQuery = z.infer<typeof paginateQuerySchema>;

export function buildPaginationQuery(query: PaginateQuery) {
  return {
    skip: query.pageIndex * query.pageSize,
    take: query.pageSize,
  };
}

export function buildPaginatedResponse<T>(items: T[], total: number, query: PaginateQuery) {
  return {
    items,
    meta: {
      total,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      pageCount: Math.ceil(total / query.pageSize),
    },
  };
}

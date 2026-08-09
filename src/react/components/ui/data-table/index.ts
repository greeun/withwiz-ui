/**
 * DataTable
 *
 * Public API - 모든 DataTable 관련 타입과 컴포넌트 export
 *
 * 재수출만 하는 배럴이지만 "use client" 를 단다 — 없으면 서버 컴포넌트에서
 * 이 경로로 import 했을 때 경계가 서지 않아 훅 호출 시점에 터진다.
 */
"use client";

export { DataTable } from "@withwiz/ui/react/components/ui/data-table/DataTable";
export { DataTableSearch } from "@withwiz/ui/react/components/ui/data-table/DataTableSearch";
export { DataTablePageSize } from "@withwiz/ui/react/components/ui/data-table/DataTablePageSize";
export { DataTableFilters } from "@withwiz/ui/react/components/ui/data-table/DataTableFilters";
export { DataTableBulkActions } from "@withwiz/ui/react/components/ui/data-table/DataTableBulkActions";
export { DataTableBody } from "@withwiz/ui/react/components/ui/data-table/DataTableBody";
export { DataTablePagination } from "@withwiz/ui/react/components/ui/data-table/DataTablePagination";

export type {
  DataTableLabels,
  DataTableClassNames,
  ColumnDef,
  BulkAction,
  FilterConfig,
  PaginationConfig,
  SortConfig,
  DataTableProps,
} from "@withwiz/ui/react/components/ui/data-table/types";

export { DEFAULT_LABELS, formatLabel } from "@withwiz/ui/react/components/ui/data-table/types";

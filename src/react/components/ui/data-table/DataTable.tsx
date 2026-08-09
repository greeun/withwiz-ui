/**
 * DataTable
 *
 * DataTable 메인 오케스트레이터 컴포넌트
 * - shadcn/ui 기반 UI 컴포넌트
 */
"use client";

import { Suspense, lazy, useState, useEffect, useMemo, useRef } from "react";
import { Alert, AlertDescription } from "@withwiz/ui/react/components/ui/Alert";
import { cn } from "@withwiz/ui/react/utils/client-utils";
import { DataTableSearch } from "@withwiz/ui/react/components/ui/data-table/DataTableSearch";
import { DataTablePageSize } from "@withwiz/ui/react/components/ui/data-table/DataTablePageSize";
import { DataTableBulkActions } from "@withwiz/ui/react/components/ui/data-table/DataTableBulkActions";
import { DataTableBody } from "@withwiz/ui/react/components/ui/data-table/DataTableBody";
import { DataTablePagination } from "@withwiz/ui/react/components/ui/data-table/DataTablePagination";
import { DEFAULT_LABELS } from "@withwiz/ui/react/components/ui/data-table/types";
import type { DataTableProps, BulkAction, FilterConfig } from "@withwiz/ui/react/components/ui/data-table/types";

// 필터 패널은 실제로 펼칠 때만 불러온다 — 정적 import 면 필터를 쓰지 않는 표에도
// @radix-ui/react-select 가 따라 들어간다.
const DataTableFilters = lazy(async () => ({
  default: (await import("@withwiz/ui/react/components/ui/data-table/DataTableFilters")).DataTableFilters,
}));

// 안정적 기본값 (매 호출마다 새 참조 생성 방지)
const EMPTY_ARRAY: readonly never[] = [];
const EMPTY_OBJECT: Record<string, never> = {};

/** 필터 값이 "활성"인지 판정 — 도메인 키에 의존하지 않는다 */
function isFilterValueActive(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (value === "all") return false;
  if (value === false) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some(isFilterValueActive);
  return true;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  error = null,
  pagination,
  sort,
  bulkActions = EMPTY_ARRAY as unknown as BulkAction[],
  filters = EMPTY_ARRAY as unknown as FilterConfig[],
  filterValues = EMPTY_OBJECT,
  onFilterChange,
  onClearFilters,
  selectable = false,
  onSelectionChange,
  selectedIds = EMPTY_ARRAY as unknown as string[],
  getRowId,
  className,
  classNames,
  rowClassName,
  footer,
  emptyMessage = "No data",
  emptyContent,
  searchPlaceholder = "Search...",
  onSearch,
  onSearchValueChange,
  searchValue = "",
  showFilters = false,
  onToggleFilters,
  createButton,
  labels: customLabels,
  syncWithUrl = false,
}: DataTableProps<T>) {
  // labels 안정화: customLabels가 변경되지 않으면 같은 참조 유지
  const customLabelsRef = useRef(customLabels);
  const labelsRef = useRef({ ...DEFAULT_LABELS, ...customLabels });
  if (customLabelsRef.current !== customLabels) {
    customLabelsRef.current = customLabels;
    labelsRef.current = { ...DEFAULT_LABELS, ...customLabels };
  }
  const labels = labelsRef.current;

  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(
    selectedIds as string[]
  );
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null);

  // selectedIds가 실제로 변경된 경우에만 동기화 (JSON 비교로 참조 문제 회피)
  const prevSelectedIdsRef = useRef<string>(JSON.stringify(selectedIds));
  useEffect(() => {
    const serialized = JSON.stringify(selectedIds);
    if (serialized !== prevSelectedIdsRef.current) {
      prevSelectedIdsRef.current = serialized;
      setLocalSelectedIds(selectedIds as string[]);
    }
  }, [selectedIds]);

  // 필터 활성 상태 확인 — 값 자체로 판정한다(0.1.x 는 특정 프로젝트의 필터 키를
  // 하드코딩해 다른 프로젝트에서는 "활성" 배지가 뜨지 않았다)
  const hasActiveFilters = useMemo(() => {
    if (searchValue && searchValue.trim()) return true;
    return Object.values(filterValues).some(isFilterValueActive);
  }, [searchValue, filterValues]);

  // URL 동기화
  useEffect(() => {
    if (!syncWithUrl || typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    let changed = false;

    // 검색어 동기화
    if (searchValue) {
      if (params.get('search') !== searchValue) {
        params.set('search', searchValue);
        changed = true;
      }
    } else {
      if (params.has('search')) {
        params.delete('search');
        changed = true;
      }
    }

    // 정렬 동기화
    if (sort) {
      if (params.get('sort') !== sort.sort) {
        params.set('sort', sort.sort);
        changed = true;
      }
      if (params.get('order') !== sort.order) {
        params.set('order', sort.order);
        changed = true;
      }
    }

    // 페이지네이션 동기화
    if (pagination) {
      const pageStr = String(pagination.page);
      const pageSizeStr = String(pagination.pageSize);
      if (params.get('page') !== pageStr) {
        params.set('page', pageStr);
        changed = true;
      }
      if (params.get('pageSize') !== pageSizeStr) {
        params.set('pageSize', pageSizeStr);
        changed = true;
      }
    }

    if (changed) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [syncWithUrl, searchValue, sort?.sort, sort?.order, pagination?.page, pagination?.pageSize]);

  // 핸들러들
  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? data.map(item => getRowId(item)) : [];
    setLocalSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelection = checked
      ? [...localSelectedIds, id]
      : localSelectedIds.filter(item => item !== id);
    setLocalSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSort = (columnKey: string) => {
    if (!sort) return;
    if (sort.sort === columnKey) {
      sort.onSortChange(columnKey, sort.order === 'asc' ? 'desc' : 'asc');
    } else {
      sort.onSortChange(columnKey, 'asc');
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (localSelectedIds.length === 0 || bulkActionLoading) return;
    setBulkActionLoading(action.key);
    try {
      await action.onClick(localSelectedIds);
    } finally {
      setBulkActionLoading(null);
    }
  };

  const visibleColumns = columns.filter(col => !col.hidden);
  const hasSearchPanel = Boolean(onSearch || createButton);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Panel */}
      {hasSearchPanel && (
        <DataTableSearch
          onSearch={onSearch}
          onSearchValueChange={onSearchValueChange}
          searchValue={searchValue}
          searchPlaceholder={searchPlaceholder}
          labels={labels}
          filters={filters}
          onToggleFilters={onToggleFilters}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          pagination={pagination}
          createButton={createButton}
        />
      )}

      {/* 검색바가 없는 표의 페이지 크기 선택기 — 선택기가 검색바에만 있으면
          검색을 쓰지 않는 표에서 pageSize 를 바꿀 수 없다 */}
      {!hasSearchPanel && pagination && pagination.total > 0 && (
        <div className={cn("flex justify-end", classNames?.toolbar)}>
          <DataTablePageSize pagination={pagination} labels={labels} />
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <Suspense fallback={null}>
          <DataTableFilters
            filters={filters}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
            labels={labels}
          />
        </Suspense>
      )}

      {/* Bulk Actions Bar */}
      {selectable && bulkActions.length > 0 && (
        <DataTableBulkActions
          bulkActions={bulkActions}
          localSelectedIds={localSelectedIds}
          dataLength={data.length}
          bulkActionLoading={bulkActionLoading}
          onSelectAll={handleSelectAll}
          onBulkAction={handleBulkAction}
          labels={labels}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <DataTableBody
        data={data}
        visibleColumns={visibleColumns}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        emptyContent={emptyContent}
        footer={footer}
        selectable={selectable}
        localSelectedIds={localSelectedIds}
        getRowId={getRowId}
        rowClassName={rowClassName}
        classNames={classNames}
        onSelectAll={handleSelectAll}
        onSelect={handleSelect}
        sort={sort}
        onSort={handleSort}
        labels={labels}
      />

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <DataTablePagination
          pagination={pagination}
          className={classNames?.pagination}
          labels={labels}
        />
      )}
    </div>
  );
}

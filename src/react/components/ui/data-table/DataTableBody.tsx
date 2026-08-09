/**
 * DataTableBody
 *
 * 테이블 본체 서브 컴포넌트 (thead + tbody + tfoot)
 */
"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@withwiz/ui/react/utils/client-utils";
import { LoadingBar } from "@withwiz/ui/react/components/ui/loading-bar";
import type {
  ColumnDef,
  DataTableClassNames,
  SortConfig,
} from "@withwiz/ui/react/components/ui/data-table/types";

export interface DataTableBodyProps<T> {
  data: T[];
  visibleColumns: ColumnDef<T>[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  emptyContent?: ReactNode;
  footer?: ReactNode;
  selectable: boolean;
  localSelectedIds: string[];
  getRowId: (item: T) => string;
  rowClassName?: (item: T, index: number) => string | undefined;
  classNames?: DataTableClassNames;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string, checked: boolean) => void;
  sort?: SortConfig;
  onSort: (columnKey: string) => void;
  labels: {
    loading: string;
    /** 전체 선택 체크박스의 접근 가능한 이름 */
    selectAll: string;
    /** 행 선택 체크박스 이름 접두어 */
    selectRow: string;
  };
}

export function DataTableBody<T>({
  data,
  visibleColumns,
  loading,
  error,
  emptyMessage,
  emptyContent,
  footer,
  selectable,
  localSelectedIds,
  getRowId,
  rowClassName,
  classNames,
  onSelectAll,
  onSelect,
  sort,
  onSort,
  labels,
}: DataTableBodyProps<T>) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = localSelectedIds.length > 0 && localSelectedIds.length < data.length;
    }
  }, [localSelectedIds, data.length]);

  const spanAll = visibleColumns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("border rounded-lg overflow-hidden", classNames?.wrapper)}>
      <div className={cn("overflow-x-auto max-w-full", classNames?.scroller)}>
        <table className={cn("w-full text-sm min-w-full", classNames?.table)}>
          <thead>
            <tr className={cn("border-b bg-muted/50", classNames?.headerRow)}>
              {selectable && (
                <th scope="col" className="px-3 py-2 text-center font-medium w-12">
                  <div className="flex items-center justify-center">
                    <input
                      data-testid="select-all-checkbox"
                      type="checkbox"
                      aria-label={labels.selectAll}
                      ref={selectAllRef}
                      checked={data.length > 0 && localSelectedIds.length === data.length}
                      onChange={e => onSelectAll(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </th>
              )}
              {visibleColumns.map(column => {
                const width = column.width === 'auto' ? undefined : column.width;
                const active = column.sortable && sort && sort.sort === column.key;
                const indicator = active ? (
                  <span aria-hidden="true">{sort!.order === 'asc' ? '▲' : '▼'}</span>
                ) : null;
                const inner = (
                  <span className="flex items-center justify-center gap-1">
                    {column.header}
                    {indicator}
                  </span>
                );
                return (
                  // scope="col" — 없으면 화면낭독기가 헤더와 데이터 셀을 연결하지 못한다(WCAG 1.3.1)
                  // aria-sort 는 정렬 가능 컬럼에만 붙인다. 정렬 조작은 th 클릭이 아니라
                  // 내부 button 이 맡는다 — th 는 키보드 포커스를 받지 못한다(WCAG 2.1.1).
                  <th
                    scope="col"
                    key={column.key}
                    title={column.headerTitle}
                    aria-sort={
                      column.sortable && sort
                        ? active
                          ? sort.order === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    className={cn(
                      "px-2 py-2 font-medium first:pl-4 last:pr-4",
                      classNames?.headerCell,
                      column.className,
                      column.responsive?.sm && "hidden sm:table-cell",
                      column.responsive?.md && "hidden md:table-cell",
                      column.responsive?.lg && "hidden lg:table-cell",
                      column.responsive?.xl && "hidden xl:table-cell"
                    )}
                    style={{
                      width: width,
                      minWidth: column.minWidth || width || undefined,
                      maxWidth: column.maxWidth || undefined,
                    }}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(column.key)}
                        className="flex w-full cursor-pointer items-center justify-center gap-1 font-medium"
                      >
                        {inner}
                      </button>
                    ) : (
                      inner
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={spanAll} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <LoadingBar size="md" variant="primary" className="w-64" />
                    <p className="text-sm text-muted-foreground">{labels.loading}</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={spanAll} className="text-center py-8 text-destructive">
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={spanAll}
                  className={cn(
                    "text-center text-muted-foreground",
                    // 노드를 받으면 자체 여백을 갖는 경우가 많아 기본 패딩을 주지 않는다
                    emptyContent ? undefined : "py-8"
                  )}
                >
                  {emptyContent ?? emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowId = getRowId(item);
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30",
                      localSelectedIds.includes(rowId) && "bg-primary/5",
                      classNames?.row,
                      rowClassName?.(item, index)
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-3 text-center w-12">
                        <input
                          data-testid={`row-checkbox-${rowId}`}
                          type="checkbox"
                          aria-label={`${labels.selectRow} ${rowId}`}
                          checked={localSelectedIds.includes(rowId)}
                          onChange={e => onSelect(rowId, e.target.checked)}
                          className="h-4 w-4"
                        />
                      </td>
                    )}
                    {visibleColumns.map(column => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-2 py-3 overflow-hidden first:pl-4 last:pr-4",
                          classNames?.cell,
                          column.className,
                          column.responsive?.sm && "hidden sm:table-cell",
                          column.responsive?.md && "hidden md:table-cell",
                          column.responsive?.lg && "hidden lg:table-cell",
                          column.responsive?.xl && "hidden xl:table-cell"
                        )}
                        style={{
                          maxWidth: column.maxWidth || column.width || undefined,
                        }}
                      >
                        {column.cell ?
                          column.cell(item) :
                          column.accessorKey ?
                            String(item[column.accessorKey] || '') :
                            ''
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
          {footer && !loading && !error && (
            <tfoot className={classNames?.footer}>{footer}</tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

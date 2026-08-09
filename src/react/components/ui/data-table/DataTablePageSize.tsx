/**
 * DataTablePageSize
 *
 * 페이지 크기 선택기. 검색바 안(DataTableSearch)과 검색바 없는 표의
 * 단독 툴바 양쪽에서 재사용한다 — 선택기가 검색바에 묶여 있으면
 * 검색을 쓰지 않는 표에서 pageSize 를 바꿀 방법이 사라진다.
 */
"use client";

import type { PaginationConfig } from "@withwiz/ui/react/components/ui/data-table/types";
import { formatLabel } from "@withwiz/ui/react/components/ui/data-table/types";

export interface DataTablePageSizeProps {
  pagination: PaginationConfig;
  labels: { perPage: string };
}

export function DataTablePageSize({ pagination, labels }: DataTablePageSizeProps) {
  const options = pagination.pageSizeOptions || [10, 20, 50];
  if (!pagination.onPageSizeChange || options.length === 0) return null;

  return (
    <select
      data-testid="page-size-select"
      /* 연결된 <label>이 없어 낭독기가 용도를 알 수 없다 — 이름을 직접 부여 */
      aria-label={formatLabel(labels.perPage, { size: pagination.pageSize })}
      value={pagination.pageSize}
      onChange={e => pagination.onPageSizeChange?.(Number(e.target.value))}
      className="border rounded px-3 py-2 text-sm bg-background h-10 min-w-[100px]"
    >
      {options.map(size => (
        <option key={size} value={size}>{formatLabel(labels.perPage, { size })}</option>
      ))}
    </select>
  );
}

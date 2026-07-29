/**
 * DataTablePagination
 *
 * 페이지네이션 서브 컴포넌트
 */
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@withwiz/ui/react/components/ui/Pagination";
import type { PaginationConfig } from "@withwiz/ui/react/components/ui/data-table/types";
import { formatLabel } from "@withwiz/ui/react/components/ui/data-table/types";

export interface DataTablePaginationProps {
  pagination: PaginationConfig;
  labels: {
    showing: string;
    previous: string;
    next: string;
  };
}

export function DataTablePagination({
  pagination,
  labels,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
      <Pagination className="w-full">
        <PaginationContent className="flex-wrap gap-1 justify-between w-full items-center">
          {/* Results Info */}
          <div className="text-sm text-muted-foreground text-center sm:text-left whitespace-nowrap">
            {formatLabel(labels.showing, {
              start: ((pagination.page - 1) * pagination.pageSize) + 1,
              end: Math.min(pagination.page * pagination.pageSize, pagination.total),
              total: pagination.total
            })}
          </div>

          {/* Previous Button */}
          <PaginationItem>
            {/*
              첫 페이지에서는 실제로 비활성 상태임을 보조기술에도 알린다.
              aria-disabled 없이 opacity-50 + pointer-events-none 만 주면
              시각적으로만 비활성이고 화면낭독기에는 여전히 "클릭 가능한 링크"로
              안내되며, 키보드로는 도달해도 아무 동작이 없다.
              또한 흐려진 글자(대비 3.69:1)가 활성 요소로 취급돼 WCAG AA 위반이 된다.
              (비활성 요소는 대비 기준에서 면제되므로 표시만 하면 해소된다.)
            */}
            <PaginationPrevious
              href="#"
              aria-disabled={pagination.page <= 1}
              tabIndex={pagination.page <= 1 ? -1 : undefined}
              onClick={e => {
                e.preventDefault();
                if (pagination.page > 1) pagination.onPageChange(pagination.page - 1);
              }}
              className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <span className="hidden sm:inline">{labels.previous}</span>
              <span className="sm:hidden">←</span>
            </PaginationPrevious>
          </PaginationItem>

          {/* Page Numbers - Hidden on mobile */}
          {/*
            <ul>(PaginationContent)의 직계 자식은 <li>여야 한다. 여기에 <div>를 두면
            목록 구조가 깨져 낭독기가 항목 수를 잘못 안내한다(axe: list/listitem).
            반응형 숨김만 필요하므로 <li>에 클래스를 준다.
          */}
          <li className="hidden sm:flex">
            {(() => {
              const pages = [];
              if (pagination.page > 3) {
                pages.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        pagination.onPageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
                if (pagination.page > 4) {
                  pages.push(
                    <PaginationItem key="ellipsis1">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
              }
              for (let i = Math.max(1, pagination.page - 2); i <= Math.min(totalPages, pagination.page + 2); i++) {
                pages.push(
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={i === pagination.page}
                      onClick={e => {
                        e.preventDefault();
                        pagination.onPageChange(i);
                      }}
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (pagination.page < totalPages - 2) {
                if (pagination.page < totalPages - 3) {
                  pages.push(
                    <PaginationItem key="ellipsis2">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                pages.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        pagination.onPageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return pages;
            })()}
          </li>

          {/* Current Page - Mobile only */}
          <div className="sm:hidden">
            <span className="px-3 py-2 text-sm font-medium">
              {pagination.page} / {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <PaginationItem>
            {/* 마지막 페이지 비활성 표시 — 위 PaginationPrevious와 동일한 이유 */}
            <PaginationNext
              href="#"
              aria-disabled={pagination.page >= totalPages}
              tabIndex={pagination.page >= totalPages ? -1 : undefined}
              onClick={e => {
                e.preventDefault();
                if (pagination.page < totalPages) pagination.onPageChange(pagination.page + 1);
              }}
              className={pagination.page >= totalPages ? "pointer-events-none opacity-50" : ""}
            >
              <span className="hidden sm:inline">{labels.next}</span>
              <span className="sm:hidden">→</span>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

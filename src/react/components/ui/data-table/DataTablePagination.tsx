/**
 * DataTablePagination
 *
 * 페이지네이션 서브 컴포넌트
 */
"use client";

import type { MouseEvent } from "react";
import { cn } from "@withwiz/ui/react/utils/client-utils";
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
  className?: string;
  labels: {
    showing: string;
    previous: string;
    next: string;
  };
}

export function DataTablePagination({
  pagination,
  className,
  labels,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // getPageHref 를 주면 실제 주소를 갖는 링크가 된다 — 새 탭·가운데 클릭이 살아나고
  // JS 미로딩 상태에서도 이동한다. 없으면 종전대로 "#" + preventDefault.
  const hrefFor = (page: number) => pagination.getPageHref?.(page) ?? "#";
  const clickFor = (page: number, guard?: () => boolean) => (e: MouseEvent<Element>) => {
    // 보조 클릭(새 탭/새 창)은 가로채지 않고 브라우저 기본 동작에 맡긴다
    if (pagination.getPageHref && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    e.preventDefault();
    if (guard && !guard()) return;
    pagination.onPageChange(page);
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg",
        className
      )}
    >
      <Pagination className="w-full">
        <PaginationContent className="flex-wrap gap-1 justify-between w-full items-center">
          {/* Results Info — <ul>의 직계 자식이므로 <li>여야 한다(axe: list/listitem) */}
          <li className="text-sm text-muted-foreground text-center sm:text-left whitespace-nowrap">
            {formatLabel(labels.showing, {
              start: ((pagination.page - 1) * pagination.pageSize) + 1,
              end: Math.min(pagination.page * pagination.pageSize, pagination.total),
              total: pagination.total
            })}
          </li>

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
              href={pagination.page > 1 ? hrefFor(pagination.page - 1) : "#"}
              aria-disabled={pagination.page <= 1}
              tabIndex={pagination.page <= 1 ? -1 : undefined}
              onClick={clickFor(pagination.page - 1, () => pagination.page > 1)}
              className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <span className="hidden sm:inline">{labels.previous}</span>
              <span className="sm:hidden">←</span>
            </PaginationPrevious>
          </PaginationItem>

          {/*
            페이지 번호는 감싸는 요소 없이 <ul>의 직계 <li>로 둔다.
            <div>로 감싸면 list 위반, <li>로 감싸면 <li> 안에 <li>가 되어 listitem 위반이다.
            반응형 숨김은 각 PaginationItem에 클래스로 준다.
          */}
          {(() => {
              const pages = [];
              if (pagination.page > 3) {
                pages.push(
                  <PaginationItem key={1} className="hidden sm:flex">
                    <PaginationLink href={hrefFor(1)} onClick={clickFor(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
                if (pagination.page > 4) {
                  pages.push(
                    <PaginationItem key="ellipsis1" className="hidden sm:flex">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
              }
              for (let i = Math.max(1, pagination.page - 2); i <= Math.min(totalPages, pagination.page + 2); i++) {
                pages.push(
                  <PaginationItem key={i} className="hidden sm:flex">
                    <PaginationLink
                      href={hrefFor(i)}
                      isActive={i === pagination.page}
                      onClick={clickFor(i)}
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (pagination.page < totalPages - 2) {
                if (pagination.page < totalPages - 3) {
                  pages.push(
                    <PaginationItem key="ellipsis2" className="hidden sm:flex">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                pages.push(
                  <PaginationItem key={totalPages} className="hidden sm:flex">
                    <PaginationLink href={hrefFor(totalPages)} onClick={clickFor(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return pages;
            })()}

          {/* Current Page - Mobile only. <ul>의 직계 자식이므로 <li>여야 한다 */}
          <li className="sm:hidden">
            <span className="px-3 py-2 text-sm font-medium">
              {pagination.page} / {totalPages}
            </span>
          </li>

          {/* Next Button */}
          <PaginationItem>
            {/* 마지막 페이지 비활성 표시 — 위 PaginationPrevious와 동일한 이유 */}
            <PaginationNext
              href={pagination.page < totalPages ? hrefFor(pagination.page + 1) : "#"}
              aria-disabled={pagination.page >= totalPages}
              tabIndex={pagination.page >= totalPages ? -1 : undefined}
              onClick={clickFor(pagination.page + 1, () => pagination.page < totalPages)}
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

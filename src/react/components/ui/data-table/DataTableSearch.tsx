/**
 * DataTableSearch
 *
 * 검색 패널 서브 컴포넌트
 */
"use client";

import { ReactNode, isValidElement } from "react";
import { cn } from "@withwiz/ui/react/utils/client-utils";
import { Button } from "@withwiz/ui/react/components/ui/Button";
import { Input } from "@withwiz/ui/react/components/ui/Input";
import { Filter } from 'lucide-react';
import type { PaginationConfig, FilterConfig } from "@withwiz/ui/react/components/ui/data-table/types";
import { DataTablePageSize } from "@withwiz/ui/react/components/ui/data-table/DataTablePageSize";

export interface DataTableSearchProps {
  onSearch?: (search: string) => void;
  onSearchValueChange?: (searchValue: string) => void;
  searchValue: string;
  searchPlaceholder: string;
  labels: {
    search: string;
    filter: string;
    filterActive: string;
    perPage: string;
  };
  filters: FilterConfig[];
  onToggleFilters?: (show: boolean) => void;
  showFilters: boolean;
  hasActiveFilters: boolean;
  pagination?: PaginationConfig;
  createButton?: ReactNode | {
    label: string;
    onClick: () => void;
  };
  /** 검색 패널 컨테이너의 className — 기본 배경·여백을 호출부 디자인 규칙으로 덮을 때 */
  className?: string;
}

export function DataTableSearch({
  onSearch,
  onSearchValueChange,
  searchValue,
  searchPlaceholder,
  labels,
  filters,
  onToggleFilters,
  showFilters,
  hasActiveFilters,
  pagination,
  createButton,
  className,
}: DataTableSearchProps) {
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchInputChange = (value: string) => {
    if (onSearchValueChange) {
      onSearchValueChange(value);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 p-3 bg-muted rounded-lg", className)}>
      <div className="flex flex-row items-center gap-2">
        {onSearch && (
          <div className="relative flex-1 min-w-0">
            <Input
              data-testid="search-input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => handleSearchInputChange(e.target.value)}
              /* onKeyPress 는 React 19 에서 폐기 — keydown 으로 대체 */
              onKeyDown={handleSearch}
              className="min-w-0 pr-20 h-10"
            />
            <Button
              data-testid="search-btn"
              size="sm"
              onClick={handleSearchClick}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 text-sm"
            >
              {labels.search}
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          {filters.length > 0 && onToggleFilters && (
            <Button
              data-testid="filter-toggle-btn"
              variant="outline"
              size="sm"
              onClick={() => onToggleFilters(!showFilters)}
              className="flex items-center gap-1 h-10 px-3"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.filter}</span>
              {hasActiveFilters && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {labels.filterActive}
                </span>
              )}
            </Button>
          )}
          {pagination && <DataTablePageSize pagination={pagination} labels={labels} />}
          {createButton && (
            isValidElement(createButton) ? createButton : (
              <Button
                data-testid="create-btn"
                onClick={(createButton as { label: string; onClick: () => void }).onClick}
                variant="default"
                size="sm"
                className="flex-shrink-0 h-10 px-3"
              >
                {(createButton as { label: string; onClick: () => void }).label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

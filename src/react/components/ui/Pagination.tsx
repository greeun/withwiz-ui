// 독립적인 Pagination 컴포넌트
import React from 'react';
import { cn } from '@withwiz/ui/react/utils/client-utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface IPaginationProps {
  children: React.ReactNode;
  className?: string;
}

export interface IPaginationContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface IPaginationItemProps {
  children: React.ReactNode;
  className?: string;
}

export interface IPaginationLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
  className?: string;
}

/**
 * 앵커 기반 컨트롤의 비활성 표현용 공통 props.
 *
 * 시각적으로만 비활성 처리(opacity + pointer-events-none)하면 화면낭독기에는
 * 여전히 클릭 가능한 링크로 안내되고, 키보드로는 도달해도 아무 동작이 없다.
 * 또한 흐려진 글자가 활성 요소로 취급돼 명도 대비 기준(WCAG AA)에 걸린다.
 * (비활성으로 표시된 요소는 대비 기준에서 면제된다.)
 */
interface IDisableableAnchorProps {
  /** 비활성 여부를 보조기술에 전달 */
  'aria-disabled'?: boolean;
  /** 비활성 시 -1로 지정해 키보드 탭 순서에서 제외 */
  tabIndex?: number;
}

export interface IPaginationPreviousProps extends IDisableableAnchorProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface IPaginationNextProps extends IDisableableAnchorProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface IPaginationEllipsisProps {
  className?: string;
}

export function Pagination({ children, className }: IPaginationProps) {
  return (
    <nav
      className={cn('mx-auto flex w-full justify-center', className)}
      role="navigation"
      aria-label="pagination"
    >
      {children}
    </nav>
  );
}

export function PaginationContent({ children, className }: IPaginationContentProps) {
  return (
    <ul className={cn('flex flex-row items-center gap-1', className)}>
      {children}
    </ul>
  );
}

export function PaginationItem({ children, className }: IPaginationItemProps) {
  return <li className={cn('', className)}>{children}</li>;
}

export function PaginationLink({ 
  children, 
  href, 
  onClick, 
  isActive = false, 
  className 
}: IPaginationLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'h-10 px-4 bg-primary text-primary-foreground'
          : 'h-10 px-4 hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      {children}
    </a>
  );
}

export function PaginationPrevious({
  href,
  onClick,
  className,
  children,
  'aria-disabled': ariaDisabled,
  tabIndex,
}: IPaginationPreviousProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-disabled={ariaDisabled}
      tabIndex={tabIndex}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="ml-2">{children || 'Previous'}</span>
    </a>
  );
}

export function PaginationNext({
  href,
  onClick,
  className,
  children,
  'aria-disabled': ariaDisabled,
  tabIndex,
}: IPaginationNextProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-disabled={ariaDisabled}
      tabIndex={tabIndex}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      <span className="mr-2">{children || 'Next'}</span>
      <ChevronRight className="h-4 w-4" />
    </a>
  );
}

export function PaginationEllipsis({ className }: IPaginationEllipsisProps) {
  return (
    <span className={cn('flex h-10 w-10 items-center justify-center', className)}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

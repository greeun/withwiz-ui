/**
 * DataTable Types
 *
 * DataTable 컴포넌트의 모든 타입 정의
 */
import { ReactNode } from "react";

// i18n Labels 타입 정의
export interface DataTableLabels {
  search?: string;
  filter?: string;
  filterActive?: string;
  clearFilters?: string;
  selectAll?: string;
  selectAllShort?: string;
  /** 행 선택 체크박스의 접근 가능한 이름 접두어 (예: "Select" → "Select {id}") */
  selectRow?: string;
  selected?: string;           // "{count} / {total} selected" 형식
  processing?: string;
  processingItems?: string;    // "Processing {count} items..."
  loading?: string;
  perPage?: string;            // "{size} per page"
  all?: string;
  min?: string;
  max?: string;
  previous?: string;
  next?: string;
  showing?: string;            // "Showing {start} to {end} of {total} results"
}

// 기본 영어 Labels
export const DEFAULT_LABELS: Required<DataTableLabels> = {
  search: "Search",
  filter: "Filter",
  filterActive: "Active",
  clearFilters: "Clear Filters",
  selectAll: "Select All",
  selectAllShort: "All",
  selectRow: "Select row",
  selected: "{count} / {total} selected",
  processing: "Processing...",
  processingItems: "Processing {count} items...",
  loading: "Loading data...",
  perPage: "{size} per page",
  all: "All",
  min: "Min",
  max: "Max",
  previous: "Previous",
  next: "Next",
  showing: "Showing {start} to {end} of {total} results"
};

// 템플릿 문자열 치환 헬퍼
export function formatLabel(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  );
}

// 타입 정의
export interface ColumnDef<T> {
  key: string;
  /** 헤더 내용. 노드를 넣으면 배지·아이콘도 헤더에 둘 수 있다 */
  header: ReactNode;
  /** th 의 title 속성 — 파생 값·산출 근거 같은 컬럼 주석용. header 가 노드일 때 특히 필요 */
  headerTitle?: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  /** 컬럼 선호 폭. 미지정 시 minWidth 의 fallback 으로도 사용됨 — "fill remaining" 컬럼(예: width:"100%")에서는 minWidth 를 명시(예: "0")해서 sibling 컬럼이 짜부라지지 않도록 할 것. */
  width?: string;
  /** th 의 min-width. 미지정 시 width 값으로 fallback. "fill remaining" 컬럼은 "0" 명시 권장. */
  minWidth?: string;
  /** th/td 의 max-width. td 는 maxWidth ?? width 로 적용 — overflow:hidden 콘텐츠와 함께 쓰면 ellipsize 가능. */
  maxWidth?: string;
  className?: string;
  hidden?: boolean;
  responsive?: {
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
  };
}

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick: (selectedIds: string[]) => Promise<void>;
  disabled?: (selectedIds: string[]) => boolean;
}

/**
 * 필터 입력 한 칸의 정의.
 *
 * DataTable 은 필터 값을 **읽어 표시할 뿐 데이터를 거르지 않는다** — 거르는 일은
 * 호출부(서버 질의 또는 전달 전 배열 가공)의 몫이다. 페이지 총 건수·정렬이 표 밖에서
 * 결정되므로 표가 임의로 행을 빼면 그 값들과 어긋난다.
 *
 * `range` 는 키 이름에 date/Date 가 들어가면 `{ start, end }`, 아니면 `{ min, max }`
 * 형태로 값을 담는다.
 */
export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'range';
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  inputType?: 'text' | 'number' | 'date';
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  /** 페이지 크기 변경 핸들러. 선택기를 숨기려면 pageSizeOptions 에 빈 배열을 준다 */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * 페이지 번호별 실제 URL. 주면 페이지 이동 링크가 href 를 갖는다 —
   * 새 탭 열기·가운데 클릭·JS 미로딩 상태에서도 동작한다.
   * 보조 클릭(Ctrl/Cmd/Shift/가운데)은 브라우저 기본 동작에 맡기고,
   * 일반 클릭만 onPageChange 로 가로챈다.
   */
  getPageHref?: (page: number) => string;
}

export interface SortConfig {
  sort: string;
  order: 'asc' | 'desc';
  onSortChange: (sort: string, order: 'asc' | 'desc') => void;
}

/**
 * 표 각 부위의 className 슬롯. 모두 tailwind-merge 로 기본값과 병합되므로
 * 같은 계열 유틸리티(bg-*, rounded-*, px-*)를 주면 기본값을 덮어쓴다.
 * 예: 카드 테두리를 없애려면 wrapper: "border-0 rounded-none".
 */
export interface DataTableClassNames {
  /** 표를 감싸는 테두리 박스 (기본: border rounded-lg overflow-hidden) */
  wrapper?: string;
  /** 가로 스크롤 컨테이너 */
  scroller?: string;
  /** table 요소 — 광폭 표의 min-w-[…] 를 여기에 준다 */
  table?: string;
  /** thead 의 tr (기본: border-b bg-muted/50) */
  headerRow?: string;
  /** 모든 th 공통 */
  headerCell?: string;
  /** 모든 tbody tr 공통. 행별 분기는 rowClassName 을 쓴다 */
  row?: string;
  /** 모든 td 공통 — 행 높이·글자 크기 보정용 */
  cell?: string;
  /** tfoot */
  footer?: string;
  /** 페이지네이션 바. 글자 크기를 주면 건수 안내·이동 버튼이 함께 따라온다 */
  pagination?: string;
  /**
   * 검색바가 **없을 때** 페이지 크기 선택기를 담는 툴바.
   * onSearch·createButton 중 하나라도 있으면 그 자리를 검색 패널이 대신하므로
   * 이 슬롯은 렌더되지 않는다 — 그때는 search 를 쓴다.
   */
  toolbar?: string;
  /** 검색 패널 컨테이너 (기본: p-3 bg-muted rounded-lg) */
  search?: string;
  /** 필터 패널 컨테이너 (기본: p-2 bg-muted/50 rounded-lg) */
  filters?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string | null;
  pagination?: PaginationConfig;
  sort?: SortConfig;
  bulkActions?: BulkAction[];
  filters?: FilterConfig[];
  filterValues?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  onClearFilters?: () => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
  getRowId: (item: T) => string;
  className?: string;
  /** 부위별 className 슬롯 */
  classNames?: DataTableClassNames;
  /** 행별 추가 className — 변경 강조·비활성 행처럼 행 단위 상태 표현에 쓴다 */
  rowClassName?: (item: T, index: number) => string | undefined;
  /**
   * tfoot 에 넣을 내용. 합계 행처럼 정렬·페이징 대상이 아닌 행을 여기 둔다.
   * tr/td 를 직접 작성하며, 컬럼 수는 호출부가 맞춘다.
   */
  footer?: ReactNode;
  emptyMessage?: string;
  /** 빈 상태 내용. 주면 emptyMessage 대신 이 노드를 렌더한다 */
  emptyContent?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (search: string) => void;
  onSearchValueChange?: (searchValue: string) => void;
  searchValue?: string;
  showFilters?: boolean;
  onToggleFilters?: (show: boolean) => void;
  createButton?: ReactNode | {
    label: string;
    onClick: () => void;
  };
  /** i18n labels - 미제공 시 영어 기본값 사용 */
  labels?: Partial<DataTableLabels>;
  /** URL 쿼리 파라미터와 상태 동기화 (기본값: false) */
  syncWithUrl?: boolean;
}

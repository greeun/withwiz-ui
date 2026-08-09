# 컴포넌트 (`@withwiz/ui/react/components`)

`@withwiz/ui/react/components/ui/*` 경로로 파일 단위 import 하는 React UI 컴포넌트.
컴포넌트는 shadcn 디자인 토큰 기반의 Tailwind 유틸리티 클래스를 렌더링하며,
Tailwind + shadcn 테마는 소비자(consumer)가 제공합니다. CSS는 번들에 포함되지 않습니다.

> 영어 버전: [README.md](./README.md)

## 📁 구조

- `ui/` — 기본 UI 컴포넌트 (실제 존재하는 유일한 폴더. `forms/`, `charts/` 폴더는 없음)
- `ui/data-table/` — 조립형 DataTable과 하위 컴포넌트 + 타입

## 🧩 UI 컴포넌트

### Alert
```tsx
import { Alert, AlertDescription } from '@withwiz/ui/react/components/ui/Alert';

<Alert variant="destructive">
  <AlertDescription>문제가 발생했습니다.</AlertDescription>
</Alert>
```
- `Alert` — props: `variant?: 'default' | 'destructive'` (기본 `'default'`), `children`, `className`
- `AlertDescription` — props: `children`, `className`

### Badge
```tsx
import { Badge } from '@withwiz/ui/react/components/ui/Badge';

<Badge variant="secondary">New</Badge>
```
- `variant?: 'default' | 'secondary' | 'destructive' | 'outline'` (기본 `'default'`)
- `children`, `className`

### Button
```tsx
import { Button } from '@withwiz/ui/react/components/ui/Button';

<Button variant="outline" size="sm" onClick={...}>저장</Button>
```
- `React.ButtonHTMLAttributes<HTMLButtonElement>` 상속 (`onClick`, `disabled`, `type` 등 그대로 전달)
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` (기본 `'default'`)
- `size?: 'default' | 'sm' | 'lg' | 'icon'` (기본 `'default'`)

### Input / Label
```tsx
import { Input } from '@withwiz/ui/react/components/ui/Input';
import { Label } from '@withwiz/ui/react/components/ui/Label';

<Label htmlFor="email">이메일</Label>
<Input id="email" type="email" placeholder="you@example.com" />
```
- `Input` 은 `React.InputHTMLAttributes<HTMLInputElement>` 상속
- `Label` 은 `React.LabelHTMLAttributes<HTMLLabelElement>` 상속

### Select
`@radix-ui/react-select` 위의 shadcn 스타일 래퍼. export된 파트로 조립합니다.
```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@withwiz/ui/react/components/ui/Select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger size="sm"><SelectValue placeholder="선택" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
    <SelectItem value="b">B</SelectItem>
  </SelectContent>
</Select>
```
Export: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`,
`SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`,
`SelectScrollDownButton`. `SelectTrigger` 는 `size?: 'sm' | 'default'` 추가. 나머지
props는 대응하는 Radix 프리미티브로 전달됩니다.

### Tooltip
Radix 없이 독립 구현. hover/focus로 동작합니다.
```tsx
import { Tooltip } from '@withwiz/ui/react/components/ui/Tooltip';

<Tooltip content="안녕" delayDuration={200}>
  <button>마우스 올리기</button>
</Tooltip>
```
- `Tooltip` — props: `children`, `content: React.ReactNode`, `className`, `delayDuration?: number` (기본 `200`ms)
- `TooltipTrigger`(`asChild?`), `TooltipContent`(`side?`, `align?`) 헬퍼도 export.

### Skeleton
```tsx
import { Skeleton } from '@withwiz/ui/react/components/ui/Skeleton';

<Skeleton className="h-4 w-24" />
```
- props: `className`, `children`

### Pagination
링크 기반 조립형 페이지네이션 프리미티브.
```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@withwiz/ui/react/components/ui/Pagination';
```
- `PaginationLink` — `href?`, `onClick?`, `isActive?`, `className`, `children`
- `PaginationPrevious` / `PaginationNext` — `href?`, `onClick?`, `className`, `children`, `aria-disabled?`, `tabIndex?` (기본 라벨 "Previous"/"Next", 셰브론 아이콘 포함)
- `PaginationEllipsis` — `className`

> **접근성**: 첫/마지막 페이지에서 이전·다음을 비활성 처리할 때는 `aria-disabled`와
> `tabIndex={-1}`을 함께 지정한다. `opacity`와 `pointer-events-none`만 주면 시각적으로만
> 비활성이고, 화면낭독기에는 여전히 클릭 가능한 링크로 안내되며 키보드로는 도달해도
> 아무 동작이 없다. 또한 흐려진 글자가 활성 요소로 취급돼 명도 대비 기준(WCAG AA)에
> 걸린다(비활성으로 표시된 요소는 대비 기준에서 면제된다).
>
> ```tsx
> <PaginationPrevious
>   aria-disabled={page <= 1}
>   tabIndex={page <= 1 ? -1 : undefined}
>   className={page <= 1 ? "pointer-events-none opacity-50" : ""}
> />
> ```

### LoadingBar
```tsx
import { LoadingBar } from '@withwiz/ui/react/components/ui/loading-bar';

<LoadingBar size="md" variant="primary" />
```
- `size?: 'sm' | 'md' | 'lg'` (기본 `'md'`)
- `variant?: 'default' | 'primary' | 'secondary'` (기본 `'default'`)
- `animated?: boolean` (기본 `true`) — `false`면 고정된 full-width 바 렌더링
- `className`

추가 export:
- `LoadingBarWithText` — `LoadingBarProps & { text?: string }` (기본 `'Loading data...'`)
- `LoadingBarCompact` — 컴팩트 바 + ping 점
- `LoadingCard` — 통합 로더, `variant?: 'card' | 'bar' | 'compact' | 'text'` (기본 `'card'`), `text?`, `size?`, `animated?`

### TimezoneDisplay
[`useSimpleTimezone`](../hooks/README.ko.md#usetimezone) 으로 사용자 타임존을 표시합니다.
```tsx
import { TimezoneDisplay } from '@withwiz/ui/react/components/ui/TimezoneDisplay';

<TimezoneDisplay showIcon showOffset variant="outline" size="md" />
```
- `showIcon?: boolean` (기본 `true`)
- `showOffset?: boolean` (기본 `true`)
- `variant?: 'default' | 'secondary' | 'outline'` (기본 `'outline'`)
- `size?: 'sm' | 'md' | 'lg'` (기본 `'md'`)

`SimpleTimezoneDisplay`(아이콘 없는 텍스트), `TimezoneTooltip`(children에 타임존
`title` 속성 부여)도 export.

### DomainDisplay
도메인 문자열을 표시. 기본값은 현재 브라우저 origin (SSR 안전).
```tsx
import { DomainDisplay } from '@withwiz/ui/react/components/ui/DomainDisplay';

<DomainDisplay showProtocol baseUrl="https://wiz.dev" />
```
- `baseUrl?: string` — 생략 시 `window.location.origin` 사용 (SSR 중에는 `https://example.com` fallback)
- `showProtocol?: boolean` (기본 `true`) — `false`면 `https?://` 제거
- `appendTrailingSlash?: boolean` (기본 `true`)
- `className`

## 📊 DataTable

범용 서버 주도형 데이터 테이블. `@withwiz/ui/react/components/ui/DataTable`(하위 호환)
및 `@withwiz/ui/react/components/ui/data-table`(하위 컴포넌트 포함 전체 public API)에서
re-export.

**특징:** 필터링, 정렬, 페이지네이션, 벌크 액션, 행 선택, 클라이언트/서버 필터 모드,
선택적 URL 동기화, i18n 라벨, 로딩/에러/빈 상태 처리.

**접근성:** 열 헤더는 `<th scope="col">`로 렌더된다. `scope`가 없으면 화면낭독기가
헤더와 데이터 셀을 연결하지 못한다(WCAG 1.3.1). 정렬 가능한 헤더는 조작부를 `th` 안의
실제 `<button>`으로 두고 `th`에 `aria-sort`를 노출한다 — `th` 자체는 키보드 포커스를
받지 못하므로 클릭 핸들러만 달면 키보드로 정렬할 수 없다(WCAG 2.1.1). 페이지네이션의
이전·다음 버튼은 첫/마지막 페이지에서 `aria-disabled`와 `tabIndex={-1}`이 적용된다.

```tsx
import { DataTable } from '@withwiz/ui/react/components/ui/data-table';
import type { ColumnDef } from '@withwiz/ui/react/components/ui/data-table';

interface User { id: string; name: string; email: string }

const columns: ColumnDef<User>[] = [
  { key: 'name',  header: '이름',   accessorKey: 'name',  sortable: true },
  { key: 'email', header: '이메일', accessorKey: 'email', sortable: true },
];

<DataTable
  data={users}
  columns={columns}
  getRowId={(u) => u.id}
  pagination={{
    page, pageSize, total,
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
  }}
  selectable
/>
```

### 주요 `DataTableProps<T>`
| Prop | 타입 | 비고 |
|------|------|------|
| `data` | `T[]` | 필수 |
| `columns` | `ColumnDef<T>[]` | 필수 |
| `getRowId` | `(item: T) => string` | 필수 |
| `loading` / `error` | `boolean` / `string \| null` | 상태 UI |
| `pagination` | `PaginationConfig` | `page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange?`, `getPageHref?`. 페이지 크기 선택기는 검색 바가 있으면 그 안에, 없으면 표 위 단독 툴바에 렌더된다. `getPageHref`를 주면 페이지 링크가 실제 주소를 갖는다 — 가운데 클릭·새 탭 열기가 살아나고, 보조 클릭은 브라우저 기본 동작에 맡긴다 |
| `sort` | `SortConfig` | `sort`, `order`, `onSortChange` |
| `filters` / `filterValues` / `onFilterChange` / `onClearFilters` | 필터 연동 | 각 `FilterConfig` 는 `filterMode: 'server' \| 'client'` + `filterFn` 지원 |
| `bulkActions` | `BulkAction[]` | `selectable` 일 때 노출 |
| `selectable` / `selectedIds` / `onSelectionChange` | 행 선택 | |
| `onSearch` / `searchValue` / `onSearchValueChange` / `searchPlaceholder` | 검색 바 | `onSearch` 또는 `createButton` 있을 때만 검색 바 렌더링 |
| `showFilters` / `onToggleFilters` | 필터 패널 토글 | |
| `createButton` | `ReactNode \| { label, onClick }` | |
| `labels` | `Partial<DataTableLabels>` | i18n; 기본값 영어 (`DEFAULT_LABELS`) |
| `syncWithUrl` | `boolean` (기본 `false`) | 검색/정렬/페이지네이션을 `history.replaceState`로 URL에 반영한다. **서버 재질의를 유발하지 않으므로** 데이터가 서버 렌더링이면 별도의 라우터 이동과 함께 써야 한다 |
| `emptyMessage` | `string` (기본 `"No data"`) | |
| `emptyContent` | `ReactNode` | 지정 시 `emptyMessage` 대신 이 노드를 렌더 |
| `footer` | `ReactNode` | `<tfoot>`에 렌더 — 정렬·페이징 대상이 아닌 합계 행용. `<tr>/<td>`를 직접 작성하고 컬럼 수는 호출부가 맞춘다 |
| `rowClassName` | `(item: T, index: number) => string \| undefined` | 행별 클래스 — 변경 행 강조, 비활성 행 표시 |
| `classNames` | `DataTableClassNames` | 부위별 클래스 슬롯: `wrapper`, `scroller`, `table`, `headerRow`, `headerCell`, `row`, `cell`, `footer`, `pagination`, `toolbar`. `tailwind-merge`로 병합되므로 `wrapper: "border-0 rounded-none"`으로 카드 테두리를 없애고 `table: "min-w-[1400px]"`로 컬럼 압축 대신 가로 스크롤을 강제할 수 있다 |

### 보조 타입
`ColumnDef<T>` (`key`, `header: ReactNode`, `headerTitle?`, `accessorKey?`, `cell?`,
`sortable?`, `width?`, `minWidth?`, `maxWidth?`, `className?`, `hidden?`, `responsive?`),
`BulkAction`, `FilterConfig`, `PaginationConfig`, `SortConfig`, `DataTableLabels`,
`DataTableClassNames`. 추가 export: `DEFAULT_LABELS`, `formatLabel(template, values)`.

`headerTitle`은 `th`의 `title` 속성이다 — "파생 값", "내부 전용" 같은 컬럼 주석에 쓴다.
`header`를 노드로 넣어도 주석은 따로 전달해야 한다.

하위 컴포넌트(커스텀 레이아웃용): `DataTableSearch`, `DataTableFilters`,
`DataTableBulkActions`, `DataTableBody`, `DataTablePagination`, `DataTablePageSize`.

필터 패널은 `React.lazy`로 불러온다 — 필터를 열지 않는 화면에는
`@radix-ui/react-select`가 실리지 않는다.

상태 관리는 [`useDataTable`](../hooks/README.ko.md#usedatatable) 훅과 함께 사용.

## 📋 셋업 체크리스트

- [ ] React 플랫폼 peer deps 설치 (`react`, `react-dom`, SSR 부분은 `next`)
- [ ] shadcn 디자인 토큰으로 Tailwind CSS 설정
- [ ] `lucide-react`, `@radix-ui/react-select`, `sonner` 는 dependencies로 포함 — 수동 설치 불필요

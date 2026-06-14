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
- `PaginationPrevious` / `PaginationNext` — `href?`, `onClick?`, `className`, `children` (기본 라벨 "Previous"/"Next", 셰브론 아이콘 포함)
- `PaginationEllipsis` — `className`

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
| `pagination` | `PaginationConfig` | `page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange` |
| `sort` | `SortConfig` | `sort`, `order`, `onSortChange` |
| `filters` / `filterValues` / `onFilterChange` / `onClearFilters` | 필터 연동 | 각 `FilterConfig` 는 `filterMode: 'server' \| 'client'` + `filterFn` 지원 |
| `bulkActions` | `BulkAction[]` | `selectable` 일 때 노출 |
| `selectable` / `selectedIds` / `onSelectionChange` | 행 선택 | |
| `onSearch` / `searchValue` / `onSearchValueChange` / `searchPlaceholder` | 검색 바 | `onSearch` 또는 `createButton` 있을 때만 검색 바 렌더링 |
| `showFilters` / `onToggleFilters` | 필터 패널 토글 | |
| `createButton` | `ReactNode \| { label, onClick }` | |
| `labels` | `Partial<DataTableLabels>` | i18n; 기본값 영어 (`DEFAULT_LABELS`) |
| `syncWithUrl` | `boolean` (기본 `false`) | 검색/정렬/페이지네이션을 URL 쿼리 파라미터에 반영 |
| `emptyMessage` | `string` (기본 `"No data"`) | |

### 보조 타입
`ColumnDef<T>` (`key`, `header`, `accessorKey?`, `cell?`, `sortable?`, `width?`,
`minWidth?`, `maxWidth?`, `className?`, `hidden?`, `responsive?`), `BulkAction`,
`FilterConfig`, `PaginationConfig`, `SortConfig`, `DataTableLabels`. 추가 export:
`DEFAULT_LABELS`, `formatLabel(template, values)`.

하위 컴포넌트(커스텀 레이아웃용): `DataTableSearch`, `DataTableFilters`,
`DataTableBulkActions`, `DataTableBody`, `DataTablePagination`.

상태 관리는 [`useDataTable`](../hooks/README.ko.md#usedatatable) 훅과 함께 사용.

## 📋 셋업 체크리스트

- [ ] React 플랫폼 peer deps 설치 (`react`, `react-dom`, SSR 부분은 `next`)
- [ ] shadcn 디자인 토큰으로 Tailwind CSS 설정
- [ ] `lucide-react`, `@radix-ui/react-select`, `sonner` 는 dependencies로 포함 — 수동 설치 불필요

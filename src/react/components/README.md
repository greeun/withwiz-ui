# Components (`@withwiz/ui/react/components`)

React UI components, imported per-file under `@withwiz/ui/react/components/ui/*`.
Components render Tailwind utility classes with shadcn design tokens — consumers
provide the Tailwind + shadcn theme. No CSS is shipped.

> Korean version: [README.ko.md](./README.ko.md)

## 📁 Structure

- `ui/` — base UI components (this is the only folder; there are no `forms/` or
  `charts/` folders)
- `ui/data-table/` — the composable DataTable and its sub-components + types

## 🧩 UI Components

### Alert
```tsx
import { Alert, AlertDescription } from '@withwiz/ui/react/components/ui/Alert';

<Alert variant="destructive">
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```
- `Alert` — props: `variant?: 'default' | 'destructive'` (default `'default'`), `children`, `className`
- `AlertDescription` — props: `children`, `className`

### Badge
```tsx
import { Badge } from '@withwiz/ui/react/components/ui/Badge';

<Badge variant="secondary">New</Badge>
```
- `variant?: 'default' | 'secondary' | 'destructive' | 'outline'` (default `'default'`)
- `children`, `className`

### Button
```tsx
import { Button } from '@withwiz/ui/react/components/ui/Button';

<Button variant="outline" size="sm" onClick={...}>Save</Button>
```
- Extends `React.ButtonHTMLAttributes<HTMLButtonElement>` (so `onClick`, `disabled`, `type`, … pass through)
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` (default `'default'`)
- `size?: 'default' | 'sm' | 'lg' | 'icon'` (default `'default'`)

### Input / Label
```tsx
import { Input } from '@withwiz/ui/react/components/ui/Input';
import { Label } from '@withwiz/ui/react/components/ui/Label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />
```
- `Input` extends `React.InputHTMLAttributes<HTMLInputElement>`
- `Label` extends `React.LabelHTMLAttributes<HTMLLabelElement>`

### Select
shadcn-style wrapper over `@radix-ui/react-select`. Compose from the exported parts:
```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@withwiz/ui/react/components/ui/Select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger size="sm"><SelectValue placeholder="Pick one" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
    <SelectItem value="b">B</SelectItem>
  </SelectContent>
</Select>
```
Exports: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`,
`SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`,
`SelectScrollDownButton`. `SelectTrigger` adds `size?: 'sm' | 'default'`; all other
props are forwarded to the corresponding Radix primitives.

### Tooltip
Self-contained (no Radix), hover/focus triggered.
```tsx
import { Tooltip } from '@withwiz/ui/react/components/ui/Tooltip';

<Tooltip content="Hello" delayDuration={200}>
  <button>Hover me</button>
</Tooltip>
```
- `Tooltip` — props: `children`, `content: React.ReactNode`, `className`, `delayDuration?: number` (default `200`ms)
- Also exports `TooltipTrigger` (`asChild?`) and `TooltipContent` (`side?`, `align?`) helpers.

### Skeleton
```tsx
import { Skeleton } from '@withwiz/ui/react/components/ui/Skeleton';

<Skeleton className="h-4 w-24" />
```
- Props: `className`, `children`

### Pagination
Composable link-based pagination primitives.
```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@withwiz/ui/react/components/ui/Pagination';
```
- `PaginationLink` — `href?`, `onClick?`, `isActive?`, `className`, `children`
- `PaginationPrevious` / `PaginationNext` — `href?`, `onClick?`, `className`, `children` (default labels "Previous"/"Next", with chevron icons)
- `PaginationEllipsis` — `className`

### LoadingBar
```tsx
import { LoadingBar } from '@withwiz/ui/react/components/ui/loading-bar';

<LoadingBar size="md" variant="primary" />
```
- `size?: 'sm' | 'md' | 'lg'` (default `'md'`)
- `variant?: 'default' | 'primary' | 'secondary'` (default `'default'`)
- `animated?: boolean` (default `true`) — when `false`, renders a static full-width bar
- `className`

Also exports:
- `LoadingBarWithText` — `LoadingBarProps & { text?: string }` (default `'Loading data...'`)
- `LoadingBarCompact` — compact bar + ping dot
- `LoadingCard` — unified loader, `variant?: 'card' | 'bar' | 'compact' | 'text'` (default `'card'`), `text?`, `size?`, `animated?`

### TimezoneDisplay
Shows the user's timezone via [`useSimpleTimezone`](../hooks/README.md#usetimezone).
```tsx
import { TimezoneDisplay } from '@withwiz/ui/react/components/ui/TimezoneDisplay';

<TimezoneDisplay showIcon showOffset variant="outline" size="md" />
```
- `showIcon?: boolean` (default `true`)
- `showOffset?: boolean` (default `true`)
- `variant?: 'default' | 'secondary' | 'outline'` (default `'outline'`)
- `size?: 'sm' | 'md' | 'lg'` (default `'md'`)

Also exports `SimpleTimezoneDisplay` (text only, no icon) and `TimezoneTooltip`
(wraps children with a `title` attribute showing the timezone).

### DomainDisplay
Renders a domain string, defaulting to the current browser origin (SSR-safe).
```tsx
import { DomainDisplay } from '@withwiz/ui/react/components/ui/DomainDisplay';

<DomainDisplay showProtocol baseUrl="https://wiz.dev" />
```
- `baseUrl?: string` — omit to use `window.location.origin` (falls back to `https://example.com` during SSR)
- `showProtocol?: boolean` (default `true`) — strip `https?://` when `false`
- `appendTrailingSlash?: boolean` (default `true`)
- `className`

## 📊 DataTable

A general-purpose, server-driven data table. Re-exported from
`@withwiz/ui/react/components/ui/DataTable` (back-compat) and
`@withwiz/ui/react/components/ui/data-table` (full public API incl. sub-components).

**Features:** filtering, sorting, pagination, bulk actions, row selection,
client/server filter modes, optional URL sync, i18n labels, loading/error/empty states.

```tsx
import { DataTable } from '@withwiz/ui/react/components/ui/data-table';
import type { ColumnDef } from '@withwiz/ui/react/components/ui/data-table';

interface User { id: string; name: string; email: string }

const columns: ColumnDef<User>[] = [
  { key: 'name',  header: 'Name',  accessorKey: 'name',  sortable: true },
  { key: 'email', header: 'Email', accessorKey: 'email', sortable: true },
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

### Key `DataTableProps<T>`
| Prop | Type | Notes |
|------|------|-------|
| `data` | `T[]` | required |
| `columns` | `ColumnDef<T>[]` | required |
| `getRowId` | `(item: T) => string` | required |
| `loading` / `error` | `boolean` / `string \| null` | state UI |
| `pagination` | `PaginationConfig` | `page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange` |
| `sort` | `SortConfig` | `sort`, `order`, `onSortChange` |
| `filters` / `filterValues` / `onFilterChange` / `onClearFilters` | filter wiring | each `FilterConfig` supports `filterMode: 'server' \| 'client'` + `filterFn` |
| `bulkActions` | `BulkAction[]` | shown when `selectable` |
| `selectable` / `selectedIds` / `onSelectionChange` | row selection | |
| `onSearch` / `searchValue` / `onSearchValueChange` / `searchPlaceholder` | search bar | search bar renders only when `onSearch` or `createButton` is set |
| `showFilters` / `onToggleFilters` | filter panel toggle | |
| `createButton` | `ReactNode \| { label, onClick }` | |
| `labels` | `Partial<DataTableLabels>` | i18n; defaults to English (`DEFAULT_LABELS`) |
| `syncWithUrl` | `boolean` (default `false`) | mirrors search/sort/pagination to URL query params |
| `emptyMessage` | `string` (default `"No data"`) | |

### Supporting types
`ColumnDef<T>` (`key`, `header`, `accessorKey?`, `cell?`, `sortable?`, `width?`,
`minWidth?`, `maxWidth?`, `className?`, `hidden?`, `responsive?`), `BulkAction`,
`FilterConfig`, `PaginationConfig`, `SortConfig`, `DataTableLabels`. Also exported:
`DEFAULT_LABELS` and `formatLabel(template, values)`.

Sub-components (for custom layouts): `DataTableSearch`, `DataTableFilters`,
`DataTableBulkActions`, `DataTableBody`, `DataTablePagination`.

Pair with the [`useDataTable`](../hooks/README.md#usedatatable) hook for state management.

## 📋 Setup checklist

- [ ] Install peer deps for the React platform (`react`, `react-dom`, and `next` for SSR pieces)
- [ ] Configure Tailwind CSS with shadcn design tokens
- [ ] `lucide-react`, `@radix-ui/react-select`, `sonner` ship as dependencies — no manual install needed

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
- `PaginationPrevious` / `PaginationNext` — `href?`, `onClick?`, `className`, `children`, `aria-disabled?`, `tabIndex?` (default labels "Previous"/"Next", with chevron icons)
- `PaginationEllipsis` — `className`

> **Accessibility**: when disabling previous/next on the first/last page, set
> `aria-disabled` and `tabIndex={-1}` as well. Styling alone (`opacity` +
> `pointer-events-none`) only *looks* disabled — screen readers still announce a
> clickable link, and keyboard users can reach a control that does nothing. The dimmed
> text is also treated as an active element and fails the WCAG AA contrast requirement
> (elements marked disabled are exempt).
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

**Accessibility:** column headers render as `<th scope="col">` — without `scope`, screen
readers cannot associate headers with data cells (WCAG 1.3.1). Sortable headers put the
control in a real `<button>` inside the `th` and expose `aria-sort` on the `th`, so sorting
is reachable by keyboard (WCAG 2.1.1). Pagination previous/next receive `aria-disabled`
and `tabIndex={-1}` on the first/last page.

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
| `pagination` | `PaginationConfig` | `page`, `pageSize`, `total`, `pageSizeOptions?`, `onPageChange`, `onPageSizeChange?`, `getPageHref?`. The page-size select renders inside the search bar when there is one, otherwise in its own toolbar above the table. `getPageHref` gives page links real `href`s so middle-click / open-in-new-tab work; modifier-clicks are left to the browser |
| `sort` | `SortConfig` | `sort`, `order`, `onSortChange` |
| `filters` / `filterValues` / `onFilterChange` / `onClearFilters` | filter wiring | the table **renders filter inputs but never filters data** — filtering belongs to the caller (server query, or shaping the array before passing it). Total count and sorting are decided outside the table, so silently dropping rows would contradict them. The filter toggle lives inside the search panel, so `filters` alone (without `onSearch` or `createButton`) cannot be opened |
| `bulkActions` | `BulkAction[]` | shown when `selectable` |
| `selectable` / `selectedIds` / `onSelectionChange` | row selection | |
| `onSearch` / `searchValue` / `onSearchValueChange` / `searchPlaceholder` | search bar | search bar renders only when `onSearch` or `createButton` is set |
| `showFilters` / `onToggleFilters` | filter panel toggle | |
| `createButton` | `ReactNode \| { label, onClick }` | |
| `labels` | `Partial<DataTableLabels>` | i18n; defaults to English (`DEFAULT_LABELS`) |
| `syncWithUrl` | `boolean` (default `false`) | mirrors search/sort/pagination to URL query params via `history.replaceState` — it does **not** re-run a server query, so pair it with your own navigation when the data is server-rendered |
| `emptyMessage` | `string` (default `"No data"`) | |
| `emptyContent` | `ReactNode` | rendered instead of `emptyMessage` when set |
| `footer` | `ReactNode` | rendered in `<tfoot>` — totals rows that must not be sorted or paged. Write your own `<tr>/<td>` and match the column count |
| `rowClassName` | `(item: T, index: number) => string \| undefined` | per-row classes — changed-row highlights, disabled rows |
| `classNames` | `DataTableClassNames` | per-part class slots: `wrapper`, `scroller`, `table`, `headerRow`, `headerCell`, `row`, `cell`, `footer`, `pagination`, `toolbar`, `search`, `filters`. A font size on `pagination` cascades to both the results label and the page controls. `toolbar` only renders when there is no search panel — with search enabled, use `search` instead. Merged with `tailwind-merge`, so `wrapper: "border-0 rounded-none"` removes the card frame and `table: "min-w-[1400px]"` forces horizontal scroll instead of column squeeze |

### Supporting types
`ColumnDef<T>` (`key`, `header: ReactNode`, `headerTitle?`, `accessorKey?`, `cell?`,
`sortable?`, `width?`, `minWidth?`, `maxWidth?`, `className?`, `hidden?`, `responsive?`),
`BulkAction`, `FilterConfig`, `PaginationConfig`, `SortConfig`, `DataTableLabels`,
`DataTableClassNames`. Also exported: `DEFAULT_LABELS` and `formatLabel(template, values)`.

`headerTitle` sets the `th` `title` attribute — use it for column footnotes such as
"derived value" or "internal only", which a `ReactNode` header cannot carry on its own.

Sub-components (for custom layouts): `DataTableSearch`, `DataTableFilters`,
`DataTableBulkActions`, `DataTableBody`, `DataTablePagination`, `DataTablePageSize`.

The filter panel is loaded with `React.lazy`, so `@radix-ui/react-select` only ships to
pages that actually open filters.

Pair with the [`useDataTable`](../hooks/README.md#usedatatable) hook for state management.

## 📋 Setup checklist

- [ ] Install peer deps for the React platform (`react`, `react-dom`, and `next` for SSR pieces)
- [ ] Configure Tailwind CSS with shadcn design tokens
- [ ] `lucide-react`, `@radix-ui/react-select`, `sonner` ship as dependencies — no manual install needed

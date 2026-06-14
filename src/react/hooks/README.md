# Hooks (`@withwiz/ui/react/hooks`)

React hooks, imported per-file under `@withwiz/ui/react/hooks/*`.

> Korean version: [README.ko.md](./README.ko.md)

## 🎣 Hook List

### useDataTable
State management for a data table: filters, sort, pagination, selection, debounced
search, and auto-refresh. Pairs with the [`DataTable`](../components/README.md#-datatable) component.

```tsx
import { useDataTable } from '@withwiz/ui/react/hooks/useDataTable';

const {
  // state
  data, loading, error, total, filters, sort, pagination, selectedIds,
  // data setters
  setData, setLoading, setError, setTotal,
  // filters
  setFilters, updateFilter, clearFilters,
  // sort / pagination
  setSort, setPage, setPageSize,
  // selection
  setSelectedIds, toggleSelection, selectAll, clearSelection,
  // actions
  refresh, bulkAction,
} = useDataTable({
  initialFilters: { search: '' },
  initialSort: { sort: 'createdAt', order: 'desc' },
  initialPagination: { page: 1, pageSize: 10, total: 0 },
  debounceMs: 500,
  onDataChange: async ({ filters, sort, pagination }) => {
    const res = await fetchData({ ...filters, ...sort, ...pagination });
    setData(res.data);
    setTotal(res.total);
  },
});
```

**Options** (`UseDataTableOptions<T>`): `initialFilters`, `initialSort` (default
`{ sort: 'createdAt', order: 'desc' }`), `initialPagination` (default
`{ page: 1, pageSize: 10, total: 0 }`), `debounceMs` (default `500`), `onDataChange`.

**Behavior:**
- Debounces `filters.search` before refreshing.
- Auto-calls `onDataChange` (via `refresh`) when search, sort, or pagination changes.
- Resets to page 1 on filter/sort/page-size changes and on debounced-search changes.
- `bulkAction(fn)` runs `fn(selectedIds)`, clears selection, then refreshes.
- `selectAll()` selects every row's `item.id`.

**Grouped return (alongside the flat return above):** `state`, `dataActions`,
`filterActions`, `sortActions`, `paginationActions`, `selectionActions`, `actions` —
the same setters/values bundled by concern, for components that prefer namespaced access.

### useDebounce
Returns a value that only updates after `delay` ms of no change.

```tsx
import { useDebounce } from '@withwiz/ui/react/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debounced = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debounced) performSearch(debounced);
}, [debounced]);
```
- Signature: `useDebounce<T>(value: T, delay: number): T`
- Skips updates when the value is referentially unchanged.

### useTimezone
Resolves the user's timezone (via `@withwiz/toolkit/core/utils/timezone`).

```tsx
import { useTimezone } from '@withwiz/ui/react/hooks/useTimezone';

const { timezone, offset, offsetFormatted, isLoading, refreshTimezone } = useTimezone();
```
- Returns: `timezone` (string, default `'UTC'`), `offset` (minutes), `offsetFormatted`
  (e.g. `'+09:00'`), `isLoading`, `refreshTimezone()`.
- Falls back to UTC if resolution throws.

Also exports **`useSimpleTimezone`** — `{ timezone, offsetFormatted, isLoading, display }`,
where `display` is `` `${timezone} (${offsetFormatted})` ``. Used by the
[`TimezoneDisplay`](../components/README.md#timezonedisplay) component.

### useExitIntent
Exit-intent detection: fires when the mouse leaves the top of the viewport, with
cooldown, delay, and permanent-dismiss persisted in `localStorage`.

```tsx
import { useExitIntent } from '@withwiz/ui/react/hooks/useExitIntent';

const { showPopup, closePopup, dismissForever } = useExitIntent({
  cooldown: 86400000, // 24h (default)
  delay: 5000,        // ready after 5s (default)
  storageKey: 'my-popup',
  disabled: false,
});

if (showPopup) return <Modal onClose={closePopup} onDismiss={dismissForever} />;
```
- Options (`UseExitIntentOptions`): `cooldown` (default 24h), `delay` (default `5000`),
  `storageKey` (default `'exit-intent-popup'`), `disabled` (default `false`).
- Returns: `showPopup`, `closePopup()`, `dismissForever()`.
- Triggers only after `delay`, respects cooldown via `${storageKey}-last-shown`, and
  permanent dismiss via `${storageKey}-dismissed`.

## 📋 Checklist

- [ ] React 18+ present (`react` peer dep)
- [ ] `useTimezone` requires `@withwiz/toolkit >=0.8.0` (it imports `@withwiz/toolkit/core/utils/timezone`)
- [ ] Verify no memory leaks (all hooks clean up their timers/listeners)

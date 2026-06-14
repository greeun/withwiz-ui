# Shared Hooks

This folder contains React hooks that can be reused across other projects.

## 🎣 Hook List

### useDataTable
A hook for managing data table state.

**Features:**
- Manages filtering, sorting, and pagination state
- Selection support
- Debounced search
- Auto refresh

**Usage:**
```tsx
import { useDataTable } from '@/shared/hooks/useDataTable';

const {
  data,
  loading,
  error,
  total,
  filters,
  sort,
  pagination,
  selectedIds,
  setData,
  setLoading,
  setError,
  setTotal,
  updateFilter,
  clearFilters,
  setSort,
  setPage,
  setPageSize,
  setSelectedIds,
  toggleSelection,
  selectAll,
  clearSelection,
  refresh,
  bulkAction
} = useDataTable({
  initialFilters: { search: '' },
  initialSort: { sort: 'createdAt', order: 'desc' },
  initialPagination: { page: 1, pageSize: 10, total: 0 },
  debounceMs: 500,
  onDataChange: async ({ filters, sort, pagination }) => {
    // API call logic
    const response = await fetchData({
      ...filters,
      ...sort,
      ...pagination
    });
    
    setData(response.data);
    setTotal(response.total);
  }
});
```

### useDebounce
A hook for debouncing input values.

**Features:**
- Updates the value after the specified delay
- Useful for search input

**Usage:**
```tsx
import { useDebounce } from '@/shared/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    // Call the search API
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### useTimezone
A hook for managing timezone information.

**Features:**
- Provides the user's browser timezone information
- Includes offset information
- Real-time updates

**Usage:**
```tsx
import { useTimezone } from '@withwiz/ui/react/hooks/useTimezone';

const {
  timezone,
  offset,
  offsetFormatted,
  isLoading
} = useTimezone();

if (isLoading) {
  return <div>타임존 정보 로딩 중...</div>;
}

return (
  <div>
    <p>타임존: {timezone}</p>
    <p>오프셋: {offsetFormatted}</p>
  </div>
);
```

### useExitIntent
An exit-intent detection hook.

**Features:**
- Detects when the mouse leaves the top area of the browser
- Cooldown and permanent-dismiss functionality
- localStorage-based state persistence

**Usage:**
```tsx
import { useExitIntent } from '@withwiz/ui/react/hooks/useExitIntent';

const { showPopup, closePopup, dismissForever } = useExitIntent({
  cooldown: 86400000, // 24 hours
  delay: 5000,        // activate after 5 seconds
  storageKey: 'my-popup',
});

if (showPopup) {
  return <Modal onClose={closePopup} onDismiss={dismissForever} />;
}
```

## 📋 Checklist

- [ ] Verify React 18+ version
- [ ] Install required dependencies
- [ ] Test hook usage
- [ ] Verify there are no memory leaks

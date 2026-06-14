# Shared Components

This folder contains React components that can be reused across other projects.

## 📁 Structure

- `ui/` - Base UI components
- `forms/` - Form-related components  
- `charts/` - Chart components

## 🧩 UI Components

### DataTable
A general-purpose data table component

**Features:**
- Filtering, sorting, and pagination support
- Bulk action functionality
- Responsive design
- Selection support
- Loading and error state handling

**Usage:**
```tsx
import { DataTable } from '@/shared/components/ui/DataTable';

const columns = [
  {
    key: 'name',
    header: '이름',
    accessorKey: 'name',
    sortable: true
  },
  {
    key: 'email',
    header: '이메일',
    accessorKey: 'email',
    sortable: true
  }
];

<DataTable
  data={users}
  columns={columns}
  pagination={{
    page: 1,
    pageSize: 10,
    total: 100,
    onPageChange: setPage,
    onPageSizeChange: setPageSize
  }}
  selectable={true}
  getRowId={(user) => user.id}
/>
```

### LoadingBar
A loading state indicator component

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'primary' | 'secondary'
- `className`: Additional CSS classes

**Usage:**
```tsx
import { LoadingBar } from '@/shared/components/ui/loading-bar';

<LoadingBar size="md" variant="primary" />
```

### TimezoneDisplay
A timezone information display component

**Props:**
- `showIcon`: Whether to show the icon
- `showOffset`: Whether to show the offset
- `variant`: 'default' | 'secondary' | 'outline'

**Usage:**
```tsx
import { TimezoneDisplay } from '@/shared/components/ui/TimezoneDisplay';

<TimezoneDisplay showIcon={true} showOffset={true} />
```

## 📋 Checklist

- [ ] Install required UI libraries (shadcn/ui, Lucide React)
- [ ] Configure Tailwind CSS
- [ ] Customize component styles
- [ ] Accessibility testing

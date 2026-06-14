# 훅 (`@withwiz/ui/react/hooks`)

`@withwiz/ui/react/hooks/*` 경로로 파일 단위 import 하는 React 훅.

> 영어 버전: [README.md](./README.md)

## 🎣 훅 목록

### useDataTable
데이터 테이블의 상태 관리: 필터, 정렬, 페이지네이션, 선택, 디바운스 검색, 자동 새로고침.
[`DataTable`](../components/README.ko.md#-datatable) 컴포넌트와 함께 사용합니다.

```tsx
import { useDataTable } from '@withwiz/ui/react/hooks/useDataTable';

const {
  // 상태
  data, loading, error, total, filters, sort, pagination, selectedIds,
  // 데이터 setter
  setData, setLoading, setError, setTotal,
  // 필터
  setFilters, updateFilter, clearFilters,
  // 정렬 / 페이지네이션
  setSort, setPage, setPageSize,
  // 선택
  setSelectedIds, toggleSelection, selectAll, clearSelection,
  // 액션
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

**옵션** (`UseDataTableOptions<T>`): `initialFilters`, `initialSort` (기본
`{ sort: 'createdAt', order: 'desc' }`), `initialPagination` (기본
`{ page: 1, pageSize: 10, total: 0 }`), `debounceMs` (기본 `500`), `onDataChange`.

**동작:**
- 새로고침 전에 `filters.search` 를 디바운스.
- 검색/정렬/페이지네이션 변경 시 `onDataChange` 를 (`refresh` 통해) 자동 호출.
- 필터/정렬/페이지 크기 변경 및 디바운스 검색어 변경 시 페이지를 1로 리셋.
- `bulkAction(fn)` 은 `fn(selectedIds)` 실행 → 선택 해제 → 새로고침.
- `selectAll()` 은 모든 행의 `item.id` 를 선택.

**그룹화 리턴 (위 flat 리턴과 함께 제공):** `state`, `dataActions`,
`filterActions`, `sortActions`, `paginationActions`, `selectionActions`, `actions` —
동일한 setter/값을 관심사별로 묶어 제공. 네임스페이스 접근을 선호하는 컴포넌트용.

### useDebounce
`delay` ms 동안 변화가 없을 때만 갱신되는 값을 반환.

```tsx
import { useDebounce } from '@withwiz/ui/react/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debounced = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debounced) performSearch(debounced);
}, [debounced]);
```
- 시그니처: `useDebounce<T>(value: T, delay: number): T`
- 값이 참조상 동일하면 갱신을 건너뜀.

### useTimezone
사용자 타임존을 해석 (`@withwiz/toolkit/core/utils/timezone` 사용).

```tsx
import { useTimezone } from '@withwiz/ui/react/hooks/useTimezone';

const { timezone, offset, offsetFormatted, isLoading, refreshTimezone } = useTimezone();
```
- 리턴: `timezone` (문자열, 기본 `'UTC'`), `offset` (분 단위), `offsetFormatted`
  (예: `'+09:00'`), `isLoading`, `refreshTimezone()`.
- 해석 실패 시 UTC로 fallback.

**`useSimpleTimezone`** 도 export — `{ timezone, offsetFormatted, isLoading, display }`,
`display` 는 `` `${timezone} (${offsetFormatted})` ``.
[`TimezoneDisplay`](../components/README.ko.md#timezonedisplay) 컴포넌트가 사용.

### useExitIntent
Exit Intent 감지: 마우스가 뷰포트 상단을 벗어날 때 발동. 쿨다운, 지연, 영구 해제를
`localStorage` 에 저장.

```tsx
import { useExitIntent } from '@withwiz/ui/react/hooks/useExitIntent';

const { showPopup, closePopup, dismissForever } = useExitIntent({
  cooldown: 86400000, // 24시간 (기본)
  delay: 5000,        // 5초 후 활성화 (기본)
  storageKey: 'my-popup',
  disabled: false,
});

if (showPopup) return <Modal onClose={closePopup} onDismiss={dismissForever} />;
```
- 옵션 (`UseExitIntentOptions`): `cooldown` (기본 24시간), `delay` (기본 `5000`),
  `storageKey` (기본 `'exit-intent-popup'`), `disabled` (기본 `false`).
- 리턴: `showPopup`, `closePopup()`, `dismissForever()`.
- `delay` 이후에만 발동, `${storageKey}-last-shown` 으로 쿨다운,
  `${storageKey}-dismissed` 로 영구 해제 적용.

## 📋 체크리스트

- [ ] React 18+ 확인 (`react` peer dep)
- [ ] `useTimezone` 은 `@withwiz/toolkit >=0.8.0` 필요 (`@withwiz/toolkit/core/utils/timezone` import)
- [ ] 메모리 누수 없음 확인 (모든 훅이 타이머/리스너 정리)

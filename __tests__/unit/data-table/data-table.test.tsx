// @vitest-environment jsdom
/**
 * DataTable 렌더 테스트
 *
 * 테스트 범위:
 * - 컬럼 렌더(cell / accessorKey / hidden / responsive)
 * - 상태 표시(loading / error / empty)
 * - 정렬 헤더 상호작용과 접근성(button + aria-sort)
 * - 선택(전체/개별)과 벌크 액션
 * - 페이지네이션 구조·라벨·비활성 처리
 * - 검색바 렌더 조건과 페이지 크기 선택기
 *
 * a11y 회귀 방지: 0.1.2~0.1.4에서 고친 항목(폼 컨트롤 접근 가능한 이름,
 * 페이지네이션 목록 구조)을 여기서 고정한다.
 */

import { render, screen, within, cleanup, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "@withwiz/ui/react/components/ui/data-table/DataTable";
import type { ColumnDef } from "@withwiz/ui/react/components/ui/data-table/types";

afterEach(cleanup);

type Row = { id: string; name: string; qty: number };

const ROWS: Row[] = [
  { id: "a", name: "서울대병원", qty: 3 },
  { id: "b", name: "서울성모병원", qty: 7 },
];

const COLUMNS: ColumnDef<Row>[] = [
  { key: "name", header: "기관", accessorKey: "name", sortable: true },
  { key: "qty", header: "수량", cell: (r) => <span data-testid={`qty-${r.id}`}>{r.qty}</span> },
];

function renderTable(props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {}) {
  return render(
    <DataTable<Row> data={ROWS} columns={COLUMNS} getRowId={(r) => r.id} {...props} />
  );
}

describe("DataTable — 컬럼 렌더", () => {
  it("cell 과 accessorKey 를 모두 렌더한다", () => {
    renderTable();
    expect(screen.getByText("서울대병원")).toBeDefined();
    expect(screen.getByTestId("qty-b").textContent).toBe("7");
  });

  it("hidden 컬럼은 th/td 모두 렌더하지 않는다", () => {
    renderTable({ columns: [...COLUMNS, { key: "secret", header: "내부", hidden: true }] });
    expect(screen.queryByText("내부")).toBeNull();
    expect(document.querySelectorAll("thead th").length).toBe(2);
  });

  it("모든 th 에 scope=col 이 있다 (WCAG 1.3.1)", () => {
    renderTable({ selectable: true });
    const ths = [...document.querySelectorAll("thead th")];
    expect(ths.length).toBeGreaterThan(0);
    expect(ths.every((th) => th.getAttribute("scope") === "col")).toBe(true);
  });

  it("width/minWidth/maxWidth 를 th 스타일로 반영한다", () => {
    renderTable({
      columns: [{ key: "name", header: "기관", accessorKey: "name", width: "120px", maxWidth: "200px" }],
    });
    const th = document.querySelector("thead th") as HTMLElement;
    expect(th.style.width).toBe("120px");
    expect(th.style.minWidth).toBe("120px"); // width 로 fallback
    expect(th.style.maxWidth).toBe("200px");
  });
});

describe("DataTable — 상태 표시", () => {
  it("loading 이면 로딩 라벨을 본문에 표시한다", () => {
    renderTable({ loading: true, labels: { loading: "불러오는 중" } });
    expect(screen.getByText("불러오는 중")).toBeDefined();
    expect(screen.queryByText("서울대병원")).toBeNull();
  });

  it("data 가 비면 emptyMessage 를 표시한다", () => {
    renderTable({ data: [], emptyMessage: "기록 없음" });
    expect(screen.getByText("기록 없음")).toBeDefined();
  });

  it("error 는 Alert 와 본문 양쪽에 표시한다", () => {
    renderTable({ error: "조회 실패" });
    expect(screen.getAllByText("조회 실패").length).toBe(2);
  });
});

describe("DataTable — 정렬", () => {
  it("sortable 헤더 클릭 시 asc 로 정렬 요청한다", () => {
    const onSortChange = vi.fn();
    renderTable({ sort: { sort: "", order: "asc", onSortChange } });
    fireEvent.click(screen.getByText("기관"));
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");
  });

  it("같은 컬럼 재클릭 시 방향을 뒤집는다", () => {
    const onSortChange = vi.fn();
    renderTable({ sort: { sort: "name", order: "asc", onSortChange } });
    fireEvent.click(screen.getByText("기관"));
    expect(onSortChange).toHaveBeenCalledWith("name", "desc");
  });

  it("sortable 이 아닌 헤더는 정렬 요청을 보내지 않는다", () => {
    const onSortChange = vi.fn();
    renderTable({ sort: { sort: "", order: "asc", onSortChange } });
    fireEvent.click(screen.getByText("수량"));
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it("정렬 헤더는 키보드로 조작 가능한 button 이고 th 에 aria-sort 를 노출한다", () => {
    renderTable({ sort: { sort: "name", order: "desc", onSortChange: vi.fn() } });
    const th = screen.getByText("기관").closest("th") as HTMLElement;
    expect(th.getAttribute("aria-sort")).toBe("descending");
    expect(within(th).getByRole("button")).toBeDefined();
  });

  it("정렬되지 않은 컬럼의 th 에는 aria-sort 가 none 이다", () => {
    renderTable({ sort: { sort: "qty", order: "asc", onSortChange: vi.fn() } });
    const th = screen.getByText("기관").closest("th") as HTMLElement;
    expect(th.getAttribute("aria-sort")).toBe("none");
  });
});

describe("DataTable — 선택", () => {
  it("전체 선택·행 선택 체크박스에 접근 가능한 이름이 있다", () => {
    renderTable({ selectable: true, labels: { selectAll: "전체 선택", selectRow: "행 선택" } });
    expect(screen.getByLabelText("전체 선택")).toBeDefined();
    expect(screen.getByLabelText("행 선택 a")).toBeDefined();
  });

  it("전체 선택은 모든 행 id 로 콜백한다", () => {
    const onSelectionChange = vi.fn();
    renderTable({ selectable: true, onSelectionChange });
    fireEvent.click(screen.getByTestId("select-all-checkbox"));
    expect(onSelectionChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("개별 해제는 나머지 id 만 남긴다", () => {
    const onSelectionChange = vi.fn();
    renderTable({ selectable: true, selectedIds: ["a", "b"], onSelectionChange });
    fireEvent.click(screen.getByTestId("row-checkbox-a"));
    expect(onSelectionChange).toHaveBeenCalledWith(["b"]);
  });
});

describe("DataTable — 페이지네이션", () => {
  const pagination = {
    page: 1,
    pageSize: 10,
    total: 25,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it("showing 라벨을 치환해 표시한다", () => {
    renderTable({ pagination, labels: { showing: "총 {total}건 · {start}–{end}" } });
    expect(screen.getByText("총 25건 · 1–10")).toBeDefined();
  });

  it("total 이 0 이면 페이지네이션을 렌더하지 않는다", () => {
    renderTable({ data: [], pagination: { ...pagination, total: 0 } });
    expect(document.querySelector("nav")).toBeNull();
  });

  it("페이지 목록의 직계 자식은 모두 li 다 (listitem 위반 회귀 방지)", () => {
    renderTable({ pagination });
    const list = document.querySelector("nav ul") as HTMLElement;
    expect(list).not.toBeNull();
    expect([...list.children].every((el) => el.tagName === "LI")).toBe(true);
  });

  it("첫 페이지에서 이전 버튼은 aria-disabled 다", () => {
    renderTable({ pagination, labels: { previous: "이전" } });
    const prev = screen.getByText("이전").closest("a") as HTMLElement;
    expect(prev.getAttribute("aria-disabled")).toBe("true");
  });

  it("페이지 번호 클릭 시 onPageChange 를 호출한다", () => {
    const onPageChange = vi.fn();
    renderTable({ pagination: { ...pagination, onPageChange } });
    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("건수 안내는 내비게이션 목록 밖에 둔다 (이동 항목과 같은 목록 항목으로 읽히지 않게)", () => {
    renderTable({ pagination, labels: { showing: "총 {total}건 · {start}–{end}" } });
    const info = screen.getByText("총 25건 · 1–10");
    expect(info.closest("nav")).toBeNull();
    expect(info.closest("ul")).toBeNull();
  });

  it("이동 항목 목록은 가로로 흩어지지 않는다 (justify-between 회귀 방지)", () => {
    renderTable({ pagination });
    const list = document.querySelector("nav ul") as HTMLElement;
    expect(list.className).not.toContain("justify-between");
    expect(list.className).not.toContain("w-full");
  });

  it("pagination 슬롯의 글자 크기가 건수 안내·이동 버튼에 함께 적용된다", () => {
    renderTable({
      pagination,
      labels: { showing: "총 {total}건 · {start}–{end}", previous: "이전" },
      classNames: { pagination: "text-xs" },
    });
    const bar = screen.getByText("총 25건 · 1–10").parentElement as HTMLElement;
    expect(bar.className).toContain("text-xs");
    expect(bar.className).not.toContain("text-sm");
    // 컨트롤은 프리미티브의 text-sm 대신 바에서 상속받는다
    const prev = screen.getByText("이전").closest("a") as HTMLElement;
    expect(prev.className).toContain("text-[length:inherit]");
    expect(prev.className).not.toContain("text-sm");
  });
});

describe("DataTable — 행 강조 (rowClassName)", () => {
  it("행별 className 을 tr 에 붙인다", () => {
    renderTable({ rowClassName: (r) => (r.id === "b" ? "row-changed" : undefined) });
    const rows = [...document.querySelectorAll("tbody tr")];
    expect(rows[0].className).not.toContain("row-changed");
    expect(rows[1].className).toContain("row-changed");
  });

  it("index 를 두 번째 인자로 넘긴다", () => {
    const seen: number[] = [];
    renderTable({ rowClassName: (_r, i) => { seen.push(i); return undefined; } });
    expect(seen).toEqual([0, 1]);
  });

  it("classNames.row 는 모든 행에 공통 적용된다", () => {
    renderTable({ classNames: { row: "dense" } });
    expect([...document.querySelectorAll("tbody tr")].every((tr) => tr.className.includes("dense"))).toBe(true);
  });
});

describe("DataTable — footer", () => {
  it("footer 를 tfoot 으로 렌더한다", () => {
    renderTable({
      footer: (
        <tr>
          <td colSpan={2}>합계 10</td>
        </tr>
      ),
    });
    const tfoot = document.querySelector("tfoot");
    expect(tfoot).not.toBeNull();
    expect(within(tfoot as HTMLElement).getByText("합계 10")).toBeDefined();
  });

  it("tfoot 행은 tbody 행으로 세지 않는다", () => {
    renderTable({ footer: <tr><td colSpan={2}>합계</td></tr> });
    expect(document.querySelectorAll("tbody tr").length).toBe(2);
  });

  it("loading·error 중에는 footer 를 숨긴다", () => {
    renderTable({ loading: true, footer: <tr><td colSpan={2}>합계</td></tr> });
    expect(document.querySelector("tfoot")).toBeNull();
  });
});

describe("DataTable — 헤더 확장", () => {
  it("header 로 노드를 받는다", () => {
    renderTable({
      columns: [{ key: "name", header: <em data-testid="hdr">기관</em>, accessorKey: "name" }],
    });
    expect(screen.getByTestId("hdr")).toBeDefined();
  });

  it("headerTitle 을 th 의 title 로 노출한다", () => {
    renderTable({
      columns: [{ key: "name", header: "IRB 승인", accessorKey: "name", headerTitle: "파생 값 — IRB 대장" }],
    });
    const th = document.querySelector("thead th") as HTMLElement;
    expect(th.getAttribute("title")).toBe("파생 값 — IRB 대장");
  });
});

describe("DataTable — 빈 상태 노드", () => {
  it("emptyContent 가 있으면 emptyMessage 대신 노드를 렌더한다", () => {
    renderTable({
      data: [],
      emptyMessage: "무시됨",
      emptyContent: <p data-testid="empty">등록된 기관이 없습니다</p>,
    });
    expect(screen.getByTestId("empty")).toBeDefined();
    expect(screen.queryByText("무시됨")).toBeNull();
  });
});

describe("DataTable — classNames 슬롯", () => {
  it("table 슬롯으로 최소 폭을 강제할 수 있다", () => {
    renderTable({ classNames: { table: "min-w-[1400px]" } });
    expect((document.querySelector("table") as HTMLElement).className).toContain("min-w-[1400px]");
  });

  it("wrapper 슬롯은 tailwind-merge 로 기본 테두리를 덮어쓴다", () => {
    renderTable({ classNames: { wrapper: "border-0 rounded-none" } });
    const wrapper = document.querySelector("table")?.closest("div")?.parentElement as HTMLElement;
    expect(wrapper.className).toContain("border-0");
    expect(wrapper.className).not.toContain("rounded-lg");
  });

  it("headerRow 슬롯으로 헤더 배경 밴드를 제거할 수 있다", () => {
    renderTable({ classNames: { headerRow: "bg-transparent" } });
    const tr = document.querySelector("thead tr") as HTMLElement;
    expect(tr.className).toContain("bg-transparent");
    expect(tr.className).not.toContain("bg-muted/50");
  });

  it("cell 슬롯은 모든 td 에 적용된다", () => {
    renderTable({ classNames: { cell: "py-1.5" } });
    const tds = [...document.querySelectorAll("tbody td")];
    expect(tds.every((td) => td.className.includes("py-1.5"))).toBe(true);
    expect(tds.every((td) => !td.className.includes("py-3"))).toBe(true);
  });

  it("search 슬롯은 검색 패널의 배경 밴드를 덮는다", () => {
    renderTable({
      onSearch: vi.fn(),
      classNames: { search: "bg-transparent p-0" },
    });
    const panel = screen.getByTestId("search-input").closest("div")?.parentElement
      ?.parentElement as HTMLElement;
    expect(panel.className).toContain("bg-transparent");
    expect(panel.className).not.toContain("bg-muted");
  });

  // 필터 패널은 lazy 라 첫 렌더에 나오지 않는다 — 로드될 때까지 기다린다
  it("filters 슬롯은 필터 패널의 배경 밴드를 덮는다", async () => {
    renderTable({
      onSearch: vi.fn(),
      showFilters: true,
      filters: [{ key: "status", label: "상태", type: "text" }],
      classNames: { filters: "bg-transparent" },
    });
    const input = await screen.findByTestId("filter-status");
    const panel = input.closest("div")?.parentElement?.parentElement as HTMLElement;
    expect(panel.className).toContain("bg-transparent");
    expect(panel.className).not.toContain("bg-muted/50");
  });
});

describe("DataTable — 페이지네이션 링크 주소", () => {
  const base = {
    page: 2,
    pageSize: 10,
    total: 50,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  // 본문 셀에도 "3"이 있으므로(qty) 페이지 링크는 nav 안에서만 찾는다
  const pageLink = (n: string) =>
    within(document.querySelector("nav") as HTMLElement).getByText(n).closest("a") as HTMLAnchorElement;

  it("getPageHref 를 주면 실제 주소를 링크에 넣는다", () => {
    renderTable({ pagination: { ...base, getPageHref: (p) => `?page=${p}` } });
    expect(pageLink("3").getAttribute("href")).toBe("?page=3");
  });

  it("getPageHref 가 없으면 종전대로 # 이다", () => {
    renderTable({ pagination: base });
    expect(pageLink("3").getAttribute("href")).toBe("#");
  });

  it("일반 클릭은 여전히 onPageChange 로 가로챈다", () => {
    const onPageChange = vi.fn();
    renderTable({ pagination: { ...base, onPageChange, getPageHref: (p) => `?page=${p}` } });
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    pageLink("3").dispatchEvent(ev);
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(ev.defaultPrevented).toBe(true);
  });

  it("Ctrl/Cmd 클릭은 가로채지 않는다 (새 탭 열기)", () => {
    const onPageChange = vi.fn();
    renderTable({ pagination: { ...base, onPageChange, getPageHref: (p) => `?page=${p}` } });
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true });
    pageLink("3").dispatchEvent(ev);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
  });
});

describe("DataTable — 필터 활성 판정", () => {
  const filters = [{ key: "status", label: "상태", type: "select" as const }];

  it("도메인과 무관한 임의 키도 활성으로 인식한다", () => {
    renderTable({
      onSearch: vi.fn(),
      filters,
      onToggleFilters: vi.fn(),
      filterValues: { deviationType: "MAJOR" },
      labels: { filterActive: "적용됨" },
    });
    expect(screen.getByText("적용됨")).toBeDefined();
  });

  it("'all'·빈 값·false 는 활성이 아니다", () => {
    renderTable({
      onSearch: vi.fn(),
      filters,
      onToggleFilters: vi.fn(),
      filterValues: { a: "all", b: "", c: false, d: null, e: {} },
      labels: { filterActive: "적용됨" },
    });
    expect(screen.queryByText("적용됨")).toBeNull();
  });

  it("중첩 객체는 하위 값이 하나라도 차 있으면 활성이다", () => {
    renderTable({
      onSearch: vi.fn(),
      filters,
      onToggleFilters: vi.fn(),
      filterValues: { range: { start: "", end: "2026-01-01" } },
      labels: { filterActive: "적용됨" },
    });
    expect(screen.getByText("적용됨")).toBeDefined();
  });
});

describe("DataTable — 검색바", () => {
  const pagination = {
    page: 1,
    pageSize: 10,
    total: 25,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it("onSearch·createButton 이 없으면 검색 입력을 렌더하지 않는다", () => {
    renderTable();
    expect(screen.queryByTestId("search-input")).toBeNull();
  });

  it("onSearch 가 있으면 검색 입력과 버튼을 렌더한다", () => {
    renderTable({ onSearch: vi.fn(), searchValue: "" });
    expect(screen.getByTestId("search-input")).toBeDefined();
    expect(screen.getByTestId("search-btn")).toBeDefined();
  });

  it("Enter 키로 검색을 실행한다", () => {
    const onSearch = vi.fn();
    renderTable({ onSearch, searchValue: "가나" });
    fireEvent.keyDown(screen.getByTestId("search-input"), { key: "Enter" });
    expect(onSearch).toHaveBeenCalledWith("가나");
  });

  it("검색바가 없어도 페이지 크기 선택기는 노출된다", () => {
    renderTable({ pagination });
    expect(screen.getByTestId("page-size-select")).toBeDefined();
  });

  it("페이지 크기 선택기는 접근 가능한 이름을 가진다", () => {
    renderTable({ pagination, labels: { perPage: "{size}개씩" } });
    const select = screen.getByTestId("page-size-select") as HTMLSelectElement;
    expect(select.getAttribute("aria-label")).toBe("10개씩");
  });
});

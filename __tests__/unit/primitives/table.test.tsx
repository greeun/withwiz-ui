/**
 * Table 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from '@withwiz/ui/react/primitives/table';

describe('Table', () => {
  it('기본 Table이 렌더링된다', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>셀</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('data-slot', 'table');
    expect(screen.getByText('셀')).toBeInTheDocument();
  });

  it('모든 하위 컴포넌트가 렌더링된다', () => {
    const { container } = render(
      <Table>
        <TableCaption>테이블 캡션</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>헤더</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>데이터</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>푸터</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-caption"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-head"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow className="custom-row">
            <TableCell className="custom-cell">값</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const row = container.querySelector('[data-slot="table-row"]');
    const cell = container.querySelector('[data-slot="table-cell"]');
    expect(row!.className).toContain('custom-row');
    expect(cell!.className).toContain('custom-cell');
    expect(row).toBeInTheDocument();
  });
});

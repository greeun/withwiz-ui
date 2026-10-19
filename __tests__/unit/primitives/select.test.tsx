/**
 * Select 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@withwiz/ui/react/primitives/select';

describe('Select', () => {
  it('SelectTrigger가 렌더링된다', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">옵션 A</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    expect(trigger).toHaveAttribute('role', 'combobox');
  });

  it('defaultValue로 선택된 값이 표시된다', () => {
    const { container } = render(
      <Select defaultValue="opt1">
        <SelectTrigger>
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt1">옵션 1</SelectItem>
          <SelectItem value="opt2">옵션 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('옵션 1')).toBeInTheDocument();
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    expect(trigger).toBeInTheDocument();
  });

  it('커스텀 className이 트리거에 적용된다', () => {
    const { container } = render(
      <Select>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="테스트" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">X</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger!.className).toContain('w-64');
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
  });
});

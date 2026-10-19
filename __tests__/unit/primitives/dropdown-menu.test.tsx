/**
 * DropdownMenu 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@withwiz/ui/react/primitives/dropdown-menu';

describe('DropdownMenu', () => {
  it('트리거가 렌더링된다', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>항목 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('메뉴 열기');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('트리거 클릭으로 메뉴가 열린다', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>라벨</DropdownMenuLabel>
          <DropdownMenuItem>항목 A</DropdownMenuItem>
          <DropdownMenuItem>항목 B</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('메뉴'));

    expect(screen.getByText('라벨')).toBeInTheDocument();
    expect(screen.getByText('항목 A')).toBeInTheDocument();
    expect(screen.getByText('항목 B')).toBeInTheDocument();
  });

  it('DropdownMenuShortcut이 렌더링된다', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            복사
            <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText('메뉴'));

    expect(screen.getByText('Ctrl+C')).toBeInTheDocument();
    expect(screen.getByText('복사')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+C')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
  });
});

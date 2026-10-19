/**
 * Sheet 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@withwiz/ui/react/primitives/sheet';

describe('Sheet', () => {
  it('트리거가 렌더링된다', () => {
    render(
      <Sheet>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>시트 제목</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    const trigger = screen.getByText('열기');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('트리거 클릭으로 시트가 열린다', async () => {
    render(
      <Sheet>
        <SheetTrigger>시트 열기</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>시트 제목</SheetTitle>
            <SheetDescription>시트 설명</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    await userEvent.click(screen.getByText('시트 열기'));

    expect(screen.getByText('시트 제목')).toBeInTheDocument();
    expect(screen.getByText('시트 설명')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('SheetHeader와 SheetFooter의 data-slot이 올바르다', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader data-testid="header">
            <SheetTitle>제목</SheetTitle>
          </SheetHeader>
          <SheetFooter data-testid="footer">
            <button>확인</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    expect(header).toHaveAttribute('data-slot', 'sheet-header');
    expect(footer).toHaveAttribute('data-slot', 'sheet-footer');
    expect(header).toBeInTheDocument();
  });
});

/**
 * Dialog 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@withwiz/ui/react/primitives/dialog';

describe('Dialog', () => {
  it('트리거가 렌더링된다', () => {
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제목</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('열기');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('트리거 클릭으로 다이얼로그가 열린다', async () => {
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>다이얼로그 제목</DialogTitle>
            <DialogDescription>다이얼로그 설명</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByText('열기'));

    expect(screen.getByText('다이얼로그 제목')).toBeInTheDocument();
    expect(screen.getByText('다이얼로그 설명')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('DialogHeader와 DialogFooter의 data-slot이 올바르다', async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>제목</DialogTitle>
          </DialogHeader>
          <DialogFooter data-testid="footer">
            <button>확인</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    expect(header).toHaveAttribute('data-slot', 'dialog-header');
    expect(footer).toHaveAttribute('data-slot', 'dialog-footer');
    expect(header).toBeInTheDocument();
  });
});

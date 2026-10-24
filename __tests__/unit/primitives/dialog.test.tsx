/**
 * Dialog 컴포넌트 유닛테스트
 */
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

/** 트리거 없이 open 상태로만 제어하는 소비자 패턴 */
function ControlledDialog({
  contentProps,
  hideOpenerWhenOpen = false,
  withTrigger = false,
}: {
  contentProps?: React.ComponentProps<typeof DialogContent>;
  hideOpenerWhenOpen?: boolean;
  withTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!(hideOpenerWhenOpen && open) && (
        <button type="button" onClick={() => setOpen(true)}>
          외부 열기
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        {withTrigger && <DialogTrigger>트리거</DialogTrigger>}
        <DialogContent {...contentProps}>
          <DialogTitle>제목</DialogTitle>
          <input aria-label="이름" />
        </DialogContent>
      </Dialog>
    </>
  );
}

describe('Dialog 닫힘 후 포커스 복원', () => {
  it('트리거 없이 제어되는 Dialog 를 닫으면 열기 전 포커스 요소로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<ControlledDialog />);
    const opener = screen.getByText('외부 열기');

    await user.click(opener);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(opener).not.toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('소비자가 onCloseAutoFocus 에서 preventDefault 하면 개입하지 않는다', async () => {
    const user = userEvent.setup();
    const onCloseAutoFocus = vi.fn((event: Event) => event.preventDefault());
    render(<ControlledDialog contentProps={{ onCloseAutoFocus }} />);
    const opener = screen.getByText('외부 열기');

    await user.click(opener);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));
    expect(opener).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
  });

  it('소비자가 넘긴 onOpenAutoFocus 도 호출된다', async () => {
    const user = userEvent.setup();
    const onOpenAutoFocus = vi.fn();
    render(<ControlledDialog contentProps={{ onOpenAutoFocus }} />);

    await user.click(screen.getByText('외부 열기'));
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
  });

  it('DialogTrigger 로 연 경우 계속 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByText('열기');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('클릭이 포커스를 주지 않아 열기 전 포커스가 body 였으면 트리거 복원에 맡긴다', async () => {
    const user = userEvent.setup();
    render(<ControlledDialog withTrigger />);
    const trigger = screen.getByText('트리거');

    // 클릭해도 버튼에 포커스가 가지 않는 브라우저를 흉내 내어 포커스 없이 연다.
    expect(document.activeElement).toBe(document.body);
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('열기 전 포커스 요소가 문서에서 사라졌으면 트리거 복원에 맡긴다', async () => {
    const user = userEvent.setup();
    render(<ControlledDialog withTrigger hideOpenerWhenOpen />);
    const opener = screen.getByText('외부 열기');
    const trigger = screen.getByText('트리거');

    await user.click(opener);
    expect(opener).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

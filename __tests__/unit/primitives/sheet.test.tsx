/**
 * Sheet 컴포넌트 유닛테스트
 */
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

/** 트리거 없이 open 상태로만 제어하는 소비자 패턴 */
function ControlledSheet({
  contentProps,
}: {
  contentProps?: React.ComponentProps<typeof SheetContent>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        외부 열기
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent {...contentProps}>
          <SheetTitle>제목</SheetTitle>
          <SheetDescription>설명</SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}

describe('Sheet 닫힘 후 포커스 복원', () => {
  it('트리거 없이 제어되는 Sheet 를 닫으면 열기 전 포커스 요소로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<ControlledSheet />);
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
    render(<ControlledSheet contentProps={{ onCloseAutoFocus }} />);
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
    render(<ControlledSheet contentProps={{ onOpenAutoFocus }} />);

    await user.click(screen.getByText('외부 열기'));
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
  });

  it('SheetTrigger 로 연 경우 계속 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent>
          <SheetTitle>제목</SheetTitle>
          <SheetDescription>설명</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const trigger = screen.getByText('열기');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

/**
 * AlertDialog 컴포넌트 유닛테스트
 */
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@withwiz/ui/react/primitives/alert-dialog';

describe('AlertDialog', () => {
  it('트리거가 렌더링된다', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>확인</AlertDialogTitle>
            <AlertDialogDescription>정말 삭제하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    const trigger = screen.getByText('삭제');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'alert-dialog-trigger');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('트리거 클릭으로 다이얼로그가 열린다', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>열기</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제목</AlertDialogTitle>
            <AlertDialogDescription>설명</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await userEvent.click(screen.getByText('열기'));

    expect(screen.getByText('제목')).toBeInTheDocument();
    expect(screen.getByText('설명')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('AlertDialogHeader와 AlertDialogFooter의 data-slot이 올바르다', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader data-testid="header">
            <AlertDialogTitle>제목</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter data-testid="footer">
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    expect(header).toHaveAttribute('data-slot', 'alert-dialog-header');
    expect(footer).toHaveAttribute('data-slot', 'alert-dialog-footer');
    expect(header).toBeInTheDocument();
  });
});

/** 트리거 없이 open 상태로만 제어하는 소비자 패턴 */
function ControlledAlertDialog({
  contentProps,
}: {
  contentProps?: React.ComponentProps<typeof AlertDialogContent>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        외부 삭제
      </button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent {...contentProps}>
          <AlertDialogTitle>확인</AlertDialogTitle>
          <AlertDialogDescription>정말 삭제하시겠습니까?</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

describe('AlertDialog 닫힘 후 포커스 복원', () => {
  it('트리거 없이 제어되는 AlertDialog 를 닫으면 열기 전 포커스 요소로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<ControlledAlertDialog />);
    const opener = screen.getByText('외부 삭제');

    await user.click(opener);
    // AlertDialog 는 열릴 때 취소 버튼으로 포커스를 옮긴다(기존 동작 유지).
    expect(screen.getByText('취소')).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('취소 버튼으로 닫아도 열기 전 포커스 요소로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<ControlledAlertDialog />);
    const opener = screen.getByText('외부 삭제');

    await user.click(opener);
    await user.click(screen.getByText('취소'));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('소비자가 onCloseAutoFocus 에서 preventDefault 하면 개입하지 않는다', async () => {
    const user = userEvent.setup();
    const onCloseAutoFocus = vi.fn((event: Event) => event.preventDefault());
    render(<ControlledAlertDialog contentProps={{ onCloseAutoFocus }} />);
    const opener = screen.getByText('외부 삭제');

    await user.click(opener);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));
    expect(opener).not.toHaveFocus();
    expect(document.activeElement).toBe(document.body);
  });

  it('소비자가 넘긴 onOpenAutoFocus 도 호출된다', async () => {
    const user = userEvent.setup();
    const onOpenAutoFocus = vi.fn();
    render(<ControlledAlertDialog contentProps={{ onOpenAutoFocus }} />);

    await user.click(screen.getByText('외부 삭제'));
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
  });

  it('AlertDialogTrigger 로 연 경우 계속 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>확인</AlertDialogTitle>
          <AlertDialogCancel>취소</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );
    const trigger = screen.getByText('삭제');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

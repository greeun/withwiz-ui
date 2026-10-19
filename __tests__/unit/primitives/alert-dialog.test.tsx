/**
 * AlertDialog 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

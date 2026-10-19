/**
 * Alert 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@withwiz/ui/react/primitives/alert';

describe('Alert', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Alert>알림 내용</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('data-slot', 'alert');
    expect(alert).toHaveTextContent('알림 내용');
  });

  it('variant="destructive"로 렌더링된다', () => {
    render(<Alert variant="destructive">에러 알림</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.className).toContain('destructive');
    expect(alert).toHaveAttribute('data-slot', 'alert');
  });

  it('AlertTitle, AlertDescription이 함께 렌더링된다', () => {
    render(
      <Alert>
        <AlertTitle data-testid="title">경고</AlertTitle>
        <AlertDescription data-testid="desc">상세 설명입니다.</AlertDescription>
      </Alert>
    );

    const title = screen.getByTestId('title');
    const desc = screen.getByTestId('desc');
    expect(title).toHaveAttribute('data-slot', 'alert-title');
    expect(desc).toHaveAttribute('data-slot', 'alert-description');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

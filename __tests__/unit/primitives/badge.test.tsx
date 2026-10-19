/**
 * Badge 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@withwiz/ui/react/primitives/badge';

describe('Badge', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Badge>기본 배지</Badge>);

    const badge = screen.getByText('기본 배지');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge.tagName).toBe('SPAN');
  });

  it('variant="destructive"로 렌더링된다', () => {
    render(<Badge variant="destructive">위험 배지</Badge>);

    const badge = screen.getByText('위험 배지');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge.className).toContain('destructive');
  });

  it('커스텀 className이 적용된다', () => {
    render(<Badge className="custom-class">커스텀 배지</Badge>);

    const badge = screen.getByText('커스텀 배지');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('custom-class');
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });
});

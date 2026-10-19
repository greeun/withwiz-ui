/**
 * Label 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@withwiz/ui/react/primitives/label';

describe('Label', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Label>이름</Label>);

    const label = screen.getByText('이름');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label.tagName).toBe('LABEL');
  });

  it('htmlFor 속성이 적용된다', () => {
    render(<Label htmlFor="email-input">이메일</Label>);

    const label = screen.getByText('이메일');
    expect(label).toHaveAttribute('for', 'email-input');
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    render(<Label className="text-red-500">필수 항목</Label>);

    const label = screen.getByText('필수 항목');
    expect(label).toBeInTheDocument();
    expect(label.className).toContain('text-red-500');
    expect(label).toHaveAttribute('data-slot', 'label');
  });
});

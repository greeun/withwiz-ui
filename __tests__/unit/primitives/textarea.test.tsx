/**
 * Textarea 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@withwiz/ui/react/primitives/textarea';

describe('Textarea', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Textarea placeholder="내용을 입력하세요" />);

    const textarea = screen.getByPlaceholderText('내용을 입력하세요');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('커스텀 className이 적용된다', () => {
    render(<Textarea className="min-h-32" placeholder="메모" />);

    const textarea = screen.getByPlaceholderText('메모');
    expect(textarea).toBeInTheDocument();
    expect(textarea.className).toContain('min-h-32');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('사용자 입력이 동작한다', async () => {
    const handleChange = vi.fn();
    render(<Textarea placeholder="입력" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('입력');
    await userEvent.type(textarea, '테스트 내용');

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });
});

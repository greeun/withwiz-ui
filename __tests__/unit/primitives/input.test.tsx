/**
 * Input 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@withwiz/ui/react/primitives/input';

describe('Input', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Input placeholder="입력하세요" />);

    const input = screen.getByPlaceholderText('입력하세요');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input.tagName).toBe('INPUT');
  });

  it('type props가 적용된다', () => {
    render(<Input type="password" placeholder="비밀번호" />);

    const input = screen.getByPlaceholderText('비밀번호');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toBeInTheDocument();
  });

  it('사용자 입력이 동작한다', async () => {
    const handleChange = vi.fn();
    render(<Input placeholder="텍스트 입력" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('텍스트 입력');
    await userEvent.type(input, '테스트');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });
});

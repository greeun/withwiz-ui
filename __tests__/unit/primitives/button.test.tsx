/**
 * Button 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@withwiz/ui/react/primitives/button';

describe('Button', () => {
  it('기본 props로 렌더링된다', () => {
    render(<Button>클릭</Button>);

    const button = screen.getByRole('button', { name: '클릭' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('variant와 size props가 적용된다', () => {
    render(<Button variant="outline" size="sm">작은 버튼</Button>);

    const button = screen.getByRole('button', { name: '작은 버튼' });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('border');
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('클릭 이벤트가 동작한다', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭 버튼</Button>);

    const button = screen.getByRole('button', { name: '클릭 버튼' });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('disabled 상태가 적용된다', () => {
    render(<Button disabled>비활성 버튼</Button>);

    const button = screen.getByRole('button', { name: '비활성 버튼' });
    expect(button).toBeDisabled();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
  });
});

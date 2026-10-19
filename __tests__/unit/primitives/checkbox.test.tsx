/**
 * Checkbox 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@withwiz/ui/react/primitives/checkbox';

describe('Checkbox', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(<Checkbox />);

    const checkbox = container.querySelector('[data-slot="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
    expect(checkbox).toHaveAttribute('role', 'checkbox');
  });

  it('disabled 상태가 적용된다', () => {
    const { container } = render(<Checkbox disabled />);

    const checkbox = container.querySelector('[data-slot="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-disabled', '');
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('클릭으로 체크 상태가 변경된다', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = container.querySelector('[data-slot="checkbox"]');
    expect(checkbox).toBeInTheDocument();

    await userEvent.click(checkbox!);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });
});

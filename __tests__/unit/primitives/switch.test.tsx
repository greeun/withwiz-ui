/**
 * Switch 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '@withwiz/ui/react/primitives/switch';

describe('Switch', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(<Switch />);

    const switchEl = container.querySelector('[data-slot="switch"]');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('role', 'switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
  });

  it('checked 상태로 렌더링된다', () => {
    const { container } = render(<Switch checked />);

    const switchEl = container.querySelector('[data-slot="switch"]');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('data-state', 'checked');
    expect(switchEl).toHaveAttribute('data-slot', 'switch');
  });

  it('클릭으로 상태가 변경된다', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Switch onCheckedChange={handleChange} />);

    const switchEl = container.querySelector('[data-slot="switch"]');
    expect(switchEl).toBeInTheDocument();

    await userEvent.click(switchEl!);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(switchEl).toHaveAttribute('data-slot', 'switch');
  });
});

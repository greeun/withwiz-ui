/**
 * RadioGroup 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '@withwiz/ui/react/primitives/radio-group';

describe('RadioGroup', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    );

    const group = container.querySelector('[data-slot="radio-group"]');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('role', 'radiogroup');

    const items = container.querySelectorAll('[data-slot="radio-group-item"]');
    expect(items.length).toBe(2);
  });

  it('기본 값이 선택 상태로 렌더링된다', () => {
    const { container } = render(
      <RadioGroup defaultValue="opt1">
        <RadioGroupItem value="opt1" />
        <RadioGroupItem value="opt2" />
      </RadioGroup>
    );

    const items = container.querySelectorAll('[data-slot="radio-group-item"]');
    expect(items[0]).toHaveAttribute('data-state', 'checked');
    expect(items[1]).toHaveAttribute('data-state', 'unchecked');
    expect(items[0]).toBeInTheDocument();
  });

  it('클릭으로 선택이 변경된다', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup defaultValue="a" onValueChange={handleChange}>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    );

    const items = container.querySelectorAll('[data-slot="radio-group-item"]');
    await userEvent.click(items[1]);

    expect(handleChange).toHaveBeenCalledWith('b');
    expect(items[1]).toBeInTheDocument();
    expect(items[1]).toHaveAttribute('data-slot', 'radio-group-item');
  });
});

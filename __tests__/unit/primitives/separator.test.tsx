/**
 * Separator 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from '@withwiz/ui/react/primitives/separator';

describe('Separator', () => {
  it('기본 props로 렌더링된다 (horizontal)', () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('vertical orientation으로 렌더링된다', () => {
    const { container } = render(<Separator orientation="vertical" />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<Separator className="my-4" />);

    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator!.className).toContain('my-4');
    expect(separator).toHaveAttribute('data-slot', 'separator');
  });
});

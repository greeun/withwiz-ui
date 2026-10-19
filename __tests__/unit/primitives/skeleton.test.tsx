/**
 * Skeleton 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@withwiz/ui/react/primitives/skeleton';

describe('Skeleton', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton!.tagName).toBe('DIV');
    expect(skeleton!.className).toContain('animate-pulse');
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);

    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton!.className).toContain('h-4');
    expect(skeleton!.className).toContain('w-32');
  });

  it('children이 렌더링된다', () => {
    const { container } = render(<Skeleton data-testid="sk">내용</Skeleton>);

    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveTextContent('내용');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });
});

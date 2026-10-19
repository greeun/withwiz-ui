/**
 * Progress 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from '@withwiz/ui/react/primitives/progress';

describe('Progress', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(<Progress value={50} />);

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();
    expect(progress!.tagName).toBeDefined();
    // Indicator 존재 확인
    const indicator = progress!.firstElementChild;
    expect(indicator).toBeInTheDocument();
  });

  it('value=0으로 렌더링된다', () => {
    const { container } = render(<Progress value={0} />);

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();
    expect(progress!.tagName).toBeDefined();
    // indicator의 transform 스타일 확인
    const indicator = progress!.firstElementChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-100%)');
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<Progress value={75} className="h-2" />);

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();
    expect(progress!.className).toContain('h-2');
    // indicator의 transform으로 value 반영 확인
    const indicator = progress!.firstElementChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-25%)');
  });
});

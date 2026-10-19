/**
 * ScrollArea 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from '@withwiz/ui/react/primitives/scroll-area';

describe('ScrollArea', () => {
  it('기본 props로 렌더링된다', () => {
    const { container } = render(
      <ScrollArea>
        <div>스크롤 콘텐츠</div>
      </ScrollArea>
    );

    const scrollArea = container.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toBeInTheDocument();
    expect(screen.getByText('스크롤 콘텐츠')).toBeInTheDocument();
    expect(scrollArea!.tagName).toBeDefined();
  });

  it('children이 올바르게 렌더링된다', () => {
    render(
      <ScrollArea>
        <p>항목 1</p>
        <p>항목 2</p>
        <p>항목 3</p>
      </ScrollArea>
    );

    expect(screen.getByText('항목 1')).toBeInTheDocument();
    expect(screen.getByText('항목 2')).toBeInTheDocument();
    expect(screen.getByText('항목 3')).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(
      <ScrollArea className="h-48">
        <div>콘텐츠</div>
      </ScrollArea>
    );

    const scrollArea = container.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea!.className).toContain('h-48');
    expect(scrollArea).toHaveAttribute('data-slot', 'scroll-area');
  });
});

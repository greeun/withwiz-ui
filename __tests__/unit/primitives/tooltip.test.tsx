/**
 * Tooltip 컴포넌트 유닛테스트
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipProvider } from '@withwiz/ui/react/primitives/tooltip';

describe('Tooltip', () => {
  it('TooltipProvider가 렌더링된다', () => {
    const { container } = render(
      <TooltipProvider>
        <div data-testid="child">자식 요소</div>
      </TooltipProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('자식 요소')).toBeInTheDocument();
    expect(container).toBeDefined();
  });

  it('Tooltip과 TooltipTrigger가 렌더링된다', () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <button>호버</button>
        </TooltipTrigger>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: '호버' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('호버');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('TooltipTrigger에 커스텀 children이 렌더링된다', () => {
    render(
      <Tooltip>
        <TooltipTrigger>
          <span data-testid="trigger-content">도움말</span>
        </TooltipTrigger>
      </Tooltip>
    );

    expect(screen.getByTestId('trigger-content')).toBeInTheDocument();
    expect(screen.getByText('도움말')).toBeInTheDocument();
    expect(screen.getByTestId('trigger-content').tagName).toBe('SPAN');
  });
});

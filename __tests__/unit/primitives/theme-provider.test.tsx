/**
 * ThemeProvider 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next-themes
const mockNextThemesProvider = vi.fn().mockImplementation(({ children, ...props }: any) => (
  <div data-testid="next-themes-provider" data-theme={props.defaultTheme}>{children}</div>
));
vi.mock('next-themes', () => ({
  ThemeProvider: (props: any) => mockNextThemesProvider(props),
}));

import { ThemeProvider } from '@withwiz/ui/react/primitives/theme-provider';

describe('ThemeProvider 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    it('children이 올바르게 렌더링된다', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Hello</div>
        </ThemeProvider>
      );
      expect(screen.getByTestId('child')).toBeDefined();
      expect(screen.getByTestId('child').textContent).toBe('Hello');
      expect(screen.getByTestId('next-themes-provider')).toBeDefined();
    });

    it('NextThemesProvider가 호출된다', () => {
      render(
        <ThemeProvider>
          <span>Test</span>
        </ThemeProvider>
      );
      expect(mockNextThemesProvider).toHaveBeenCalled();
      expect(screen.getByTestId('next-themes-provider')).toBeDefined();
      expect(screen.getByText('Test')).toBeDefined();
    });

    it('여러 children이 렌더링된다', () => {
      render(
        <ThemeProvider>
          <div data-testid="a">A</div>
          <div data-testid="b">B</div>
        </ThemeProvider>
      );
      expect(screen.getByTestId('a')).toBeDefined();
      expect(screen.getByTestId('b')).toBeDefined();
      expect(screen.getByTestId('next-themes-provider')).toBeDefined();
    });
  });

  describe('Props 전달', () => {
    it('attribute prop이 전달된다', () => {
      render(
        <ThemeProvider attribute="class">
          <div>Test</div>
        </ThemeProvider>
      );
      const props = mockNextThemesProvider.mock.calls[0][0];
      expect(props.attribute).toBe('class');
      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('next-themes-provider')).toBeDefined();
    });

    it('defaultTheme prop이 전달된다', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Test</div>
        </ThemeProvider>
      );
      const props = mockNextThemesProvider.mock.calls[0][0];
      expect(props.defaultTheme).toBe('dark');
      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Test')).toBeDefined();
    });

    it('enableSystem prop이 전달된다', () => {
      render(
        <ThemeProvider enableSystem>
          <div>Test</div>
        </ThemeProvider>
      );
      const props = mockNextThemesProvider.mock.calls[0][0];
      expect(props.enableSystem).toBe(true);
      expect(mockNextThemesProvider).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('next-themes-provider')).toBeDefined();
    });
  });
});

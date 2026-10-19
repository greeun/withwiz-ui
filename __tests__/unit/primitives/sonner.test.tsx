/**
 * Sonner (Toaster) 컴포넌트 유닛테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock next-themes
const mockUseTheme = vi.fn().mockReturnValue({ theme: 'light' });
vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock sonner
const mockSonner = vi.fn().mockImplementation((props: any) => (
  <div data-testid="sonner" data-theme={props.theme} className={props.className} />
));
vi.mock('sonner', () => ({
  Toaster: (props: any) => mockSonner(props),
}));

import { Toaster } from '@withwiz/ui/react/primitives/sonner';

describe('Toaster (Sonner) 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  describe('기본 렌더링', () => {
    it('Toaster가 올바르게 렌더링된다', () => {
      render(<Toaster />);
      expect(mockSonner).toHaveBeenCalled();
      expect(mockSonner.mock.calls[0][0].theme).toBe('light');
      expect(mockSonner.mock.calls[0][0].className).toBe('toaster group');
    });

    it('CSS 변수가 style에 포함된다', () => {
      render(<Toaster />);
      const props = mockSonner.mock.calls[0][0];
      expect(props.style['--normal-bg']).toBe('var(--popover)');
      expect(props.style['--normal-text']).toBe('var(--foreground)');
      expect(props.style['--normal-border']).toBe('var(--border)');
    });

    it('description CSS 변수가 포함된다', () => {
      render(<Toaster />);
      const props = mockSonner.mock.calls[0][0];
      expect(props.style['--normal-description']).toBe('var(--muted-foreground)');
      expect(props.className).toBe('toaster group');
      expect(props.theme).toBe('light');
    });
  });

  describe('테마 연동', () => {
    it('dark 테마가 적용된다', () => {
      mockUseTheme.mockReturnValue({ theme: 'dark' });
      render(<Toaster />);
      expect(mockSonner.mock.calls[0][0].theme).toBe('dark');
      expect(mockSonner.mock.calls[0][0].className).toBe('toaster group');
      expect(mockSonner).toHaveBeenCalledTimes(1);
    });

    it('system 테마가 적용된다', () => {
      mockUseTheme.mockReturnValue({ theme: 'system' });
      render(<Toaster />);
      expect(mockSonner.mock.calls[0][0].theme).toBe('system');
      expect(mockSonner).toHaveBeenCalledTimes(1);
      expect(mockSonner.mock.calls[0][0].className).toContain('toaster');
    });

    it('테마가 undefined일 때 기본값 system이 사용된다', () => {
      mockUseTheme.mockReturnValue({});
      render(<Toaster />);
      expect(mockSonner.mock.calls[0][0].theme).toBe('system');
      expect(mockSonner).toHaveBeenCalledTimes(1);
      expect(mockSonner.mock.calls[0][0].className).toBe('toaster group');
    });
  });

  describe('Props 전달', () => {
    it('추가 props가 Sonner에 전달된다', () => {
      render(<Toaster position="top-right" />);
      expect(mockSonner.mock.calls[0][0].position).toBe('top-right');
      expect(mockSonner.mock.calls[0][0].theme).toBe('light');
      expect(mockSonner).toHaveBeenCalledTimes(1);
    });

    it('closeButton prop이 전달된다', () => {
      render(<Toaster closeButton />);
      expect(mockSonner.mock.calls[0][0].closeButton).toBe(true);
      expect(mockSonner).toHaveBeenCalledTimes(1);
      expect(mockSonner.mock.calls[0][0].className).toBe('toaster group');
    });

    it('richColors prop이 전달된다', () => {
      render(<Toaster richColors />);
      expect(mockSonner.mock.calls[0][0].richColors).toBe(true);
      expect(mockSonner.mock.calls[0][0].theme).toBe('light');
      expect(mockSonner).toHaveBeenCalledTimes(1);
    });
  });
});

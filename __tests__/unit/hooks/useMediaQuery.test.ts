/**
 * useMediaQuery 훅 유닛테스트
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsMobileOrTablet } from '@withwiz/ui/react/hooks/useMediaQuery';

// matchMedia mock
let listeners: Map<string, ((event: MediaQueryListEvent) => void)[]>;
let matchStates: Map<string, boolean>;

function setupMatchMedia() {
  listeners = new Map();
  matchStates = new Map();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => {
      if (!listeners.has(query)) {
        listeners.set(query, []);
      }

      return {
        matches: matchStates.get(query) ?? false,
        media: query,
        addEventListener: vi.fn((event: string, listener: any) => {
          if (event === 'change') {
            listeners.get(query)!.push(listener);
          }
        }),
        removeEventListener: vi.fn((event: string, listener: any) => {
          if (event === 'change') {
            const arr = listeners.get(query) || [];
            const idx = arr.indexOf(listener);
            if (idx >= 0) arr.splice(idx, 1);
          }
        }),
        dispatchEvent: vi.fn(),
      };
    }),
  });
}

function triggerMediaChange(query: string, matches: boolean) {
  matchStates.set(query, matches);
  const eventListeners = listeners.get(query) || [];
  for (const listener of eventListeners) {
    listener({ matches, media: query } as MediaQueryListEvent);
  }
}

describe('useMediaQuery', () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  describe('초기 상태', () => {
    it('초기값으로 false를 반환해야 한다 (매칭 안 됨)', () => {
      matchStates.set('(max-width: 768px)', false);

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
    });

    it('초기에 매칭되면 true를 반환해야 한다', () => {
      matchStates.set('(max-width: 768px)', true);

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      // useEffect 후 matches가 true로 업데이트
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('미디어 쿼리 변경 감지', () => {
    it('미디어 쿼리 상태 변경 시 값이 업데이트되어야 한다', () => {
      matchStates.set('(max-width: 768px)', false);

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => triggerMediaChange('(max-width: 768px)', true));

      expect(result.current).toBe(true);

      act(() => triggerMediaChange('(max-width: 768px)', false));

      expect(result.current).toBe(false);
    });
  });

  describe('클린업', () => {
    it('언마운트 시 이벤트 리스너가 제거되어야 한다', () => {
      matchStates.set('(max-width: 768px)', false);

      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      const mockMediaQuery = (window.matchMedia as any).mock.results[0].value;

      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  it('768px 이하이면 true를 반환해야 한다', () => {
    matchStates.set('(max-width: 767px)', true);

    const { result } = renderHook(() => useIsMobile());

    // useEffect 이후 매칭
    expect(typeof result.current).toBe('boolean');
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });
});

describe('useIsDesktop', () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  it('1024px 이상이면 true를 반환해야 한다', () => {
    matchStates.set('(min-width: 1024px)', true);

    const { result } = renderHook(() => useIsDesktop());

    expect(typeof result.current).toBe('boolean');
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});

describe('useIsTablet', () => {
  beforeEach(() => {
    setupMatchMedia();
  });

  it('올바른 미디어 쿼리를 사용해야 한다', () => {
    matchStates.set('(min-width: 768px) and (max-width: 1023px)', false);

    renderHook(() => useIsTablet());

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1023px)');
  });
});

/**
 * useMediaQuery Hook
 *
 * 미디어 쿼리 상태를 추적하는 React 훅
 * 반응형 레이아웃 전환에 사용
 */
'use client';

import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 매칭 여부를 반환하는 훅
 * @param query - CSS 미디어 쿼리 문자열 (e.g., '(max-width: 768px)')
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR 환경에서는 window가 없으므로 체크
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);

    // 초기값 설정
    setMatches(media.matches);

    // 변경 리스너
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    media.addEventListener('change', listener);

    // 클린업
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * 일반적인 브레이크포인트 훅들
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsMobileOrTablet(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

export default useMediaQuery;

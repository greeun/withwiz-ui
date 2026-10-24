// Radix Dialog 계열 Content 의 닫힘 후 포커스 복원 보완
// 이 파일은 클라이언트 컴포넌트에서만 사용해야 합니다.
//
// Radix modal Content 는 onCloseAutoFocus 에서 FocusScope 의 기본 복원(열기 직전 요소)을
// 막고 트리거로만 포커스를 돌려보낸다. 트리거 없이 open 상태로만 제어하면 포커스가
// body 로 떨어지므로(WCAG 2.4.3), 열기 직전 포커스 요소를 기억했다가 되돌린다.

import * as React from "react"

type AutoFocusHandler = (event: Event) => void

export function useRestoreFocusOnClose({
  onOpenAutoFocus,
  onCloseAutoFocus,
}: {
  onOpenAutoFocus?: AutoFocusHandler
  onCloseAutoFocus?: AutoFocusHandler
}) {
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null)

  const handleOpenAutoFocus = React.useCallback(
    (event: Event) => {
      // FocusScope 가 포커스를 옮기기 전이므로 activeElement 는 열기 직전 요소다.
      const active = document.activeElement
      previouslyFocusedRef.current =
        active instanceof HTMLElement ? active : null
      onOpenAutoFocus?.(event)
    },
    [onOpenAutoFocus]
  )

  const handleCloseAutoFocus = React.useCallback(
    (event: Event) => {
      const target = previouslyFocusedRef.current
      previouslyFocusedRef.current = null
      onCloseAutoFocus?.(event)
      if (event.defaultPrevented) return
      // 기억한 요소가 body 이거나(클릭이 포커스를 주지 않는 브라우저) 이미 문서에서
      // 사라졌으면 Radix 기본 동작(트리거 복원)에 맡긴다.
      if (!target || target === document.body || !target.isConnected) return
      // 닫히는 사이 포커스가 이미 다른 요소로 옮겨졌으면 그대로 둔다.
      const active = document.activeElement
      if (active && active !== document.body) return
      event.preventDefault()
      target.focus({ preventScroll: true })
    },
    [onCloseAutoFocus]
  )

  return { onOpenAutoFocus: handleOpenAutoFocus, onCloseAutoFocus: handleCloseAutoFocus }
}

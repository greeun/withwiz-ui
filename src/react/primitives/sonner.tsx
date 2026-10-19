/**
 * sonner
 *
 * sonner Component
 * - shadcn/ui 기반 UI 컴포넌트
 */
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--normal-description": "var(--muted-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

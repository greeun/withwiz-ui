/**
 * skeleton
 *
 * skeleton Component
 * - shadcn/ui 기반 UI 컴포넌트
 */
import { cn } from "@withwiz/ui/react/utils/client-utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }

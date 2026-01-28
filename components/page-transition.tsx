import { cn } from "@/lib/utils"

function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in zoom-in duration-500",
        className
      )}
    >
      {children}
    </div>
  )
}

export { PageTransition }

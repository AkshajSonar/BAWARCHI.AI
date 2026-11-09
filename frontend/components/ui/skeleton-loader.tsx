export function SkeletonLoader({
  className = "",
  rows = 4,
}: {
  className?: string
  rows?: number
}) {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      <div className="h-8 bg-slate-200/80 rounded-xl w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200/70 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200/60 rounded-2xl" />
    </div>
  )
}

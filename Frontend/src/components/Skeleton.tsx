interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: string
}

export function Skeleton({ className = '', width, height, rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, var(--muted) 25%, var(--secondary) 50%, var(--muted) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
      <div
        className={`${rounded} animate-shimmer ${className}`}
        style={{ width, height }}
      />
    </>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4 bg-card border border-slate-500/20 rounded-3xl shadow-md">
      <div className="flex items-center gap-4">
        <Skeleton width={44} height={44} rounded="rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} width="60%" />
          <Skeleton height={11} width="40%" />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton height={12} width="85%" />
      <Skeleton height={12} width="70%" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`sk-stat-${i}`} className="card p-5 space-y-3 bg-card border border-slate-500/20 rounded-3xl shadow-md">
            <Skeleton width={44} height={44} rounded="rounded-2xl" />
            <Skeleton height={28} width="50%" />
            <Skeleton height={12} width="70%" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`sk-card-${i}`} />
        ))}
      </div>
    </div>
  )
}
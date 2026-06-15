export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <Skeleton className="h-48 sm:h-52 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-screen min-h-[500px] sm:min-h-[700px] bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-6">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-16 sm:h-20 w-full" />
          <Skeleton className="h-16 sm:h-20 w-3/4" />
          <Skeleton className="h-6 w-96 max-w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimoniSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-4">
      <Skeleton className="h-20 w-20 rounded-full mx-auto" />
      <div className="flex justify-center gap-1">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-5 rounded" />)}
      </div>
      <Skeleton className="h-16 w-full max-w-xl mx-auto" />
      <Skeleton className="h-5 w-40 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  )
}

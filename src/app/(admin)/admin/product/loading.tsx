export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-[#e4eae2]" />
            <div className="h-8 w-44 rounded-lg bg-[#dfe6dd]" />
            <div className="h-4 w-72 rounded bg-[#e8eee6]" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-[#dfe6dd]" />
        </div>

        {/* Stats Skeleton */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
              <div className="h-3 w-24 rounded bg-[#edf2eb]" />
              <div className="mt-2 h-7 w-16 rounded bg-[#dfe6dd]" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white p-5 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 border-b border-[#f0f4ee] pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-[#e6ede4]" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-40 rounded bg-[#dfe6dd]" />
                    <div className="h-3 w-24 rounded bg-[#edf2eb]" />
                  </div>
                </div>
                <div className="h-5 w-20 rounded-full bg-[#edf2eb]" />
                <div className="h-4 w-14 rounded bg-[#dfe6dd]" />
                <div className="h-5 w-16 rounded-full bg-[#edf2eb]" />
                <div className="h-8 w-16 rounded-lg bg-[#f0f4ee]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}


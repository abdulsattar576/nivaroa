export default function EditProductLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="mb-5 h-9 w-36 rounded-lg bg-[#e4eae2]" />

        <section className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="size-11 rounded-2xl bg-[#eaf2e8]" />
              <div className="h-7 w-48 rounded bg-[#dfe6dd]" />
              <div className="h-4 w-96 rounded bg-[#edf2eb]" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 pt-4 border-t border-[#edf0eb]">
              <div className="h-11 rounded-xl bg-[#f0f4ee] sm:col-span-2" />
              <div className="h-11 rounded-xl bg-[#f0f4ee]" />
              <div className="h-11 rounded-xl bg-[#f0f4ee]" />
              <div className="h-11 rounded-xl bg-[#f0f4ee] sm:col-span-2" />
              <div className="h-28 rounded-xl bg-[#f0f4ee] sm:col-span-2" />
            </div>

            <div className="h-36 rounded-2xl border-2 border-dashed border-[#e0e8df] bg-[#fbfcfb]" />
          </div>
        </section>
      </div>
    </main>
  );
}


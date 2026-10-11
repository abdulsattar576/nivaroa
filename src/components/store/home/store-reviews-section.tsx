import Link from "next/link";
import { Star, CheckCircle, Quote, Sparkles } from "lucide-react";
import { getStoreCustomerReviews } from "@/features/reviews/actions/reviews";

export async function StoreReviewsSection() {
  const reviews = await getStoreCustomerReviews(4);

  // If no reviews yet in the database, don't show an empty or broken box
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 py-4">
      <div className="rounded-3xl border border-[#e2ebe0] bg-gradient-to-b from-[#fbfdfa] to-[#f4f7f2] p-6 sm:p-10 shadow-xs">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d2e0d1] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#194c3a] shadow-2xs">
            <Sparkles className="size-3 text-amber-500 fill-amber-500" /> Verified Buyers
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#163324] sm:text-3xl">
            What Our Customers Say
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5f7365]">
            Authentic feedback from real buyers who have experienced our craftsmanship and fit.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5ece3] bg-white p-5 shadow-2xs transition-all hover:border-[#b4cbb7] hover:shadow-sm"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-500 mb-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${
                        star <= r.rating ? "fill-current text-amber-500" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                {r.title && (
                  <h4 className="text-xs font-bold text-[#183526] line-clamp-1 mb-1">
                    {r.title}
                  </h4>
                )}
                <p className="text-xs text-[#526558] line-clamp-3 leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-full bg-[#edf3eb] text-[#1c4d37] text-xs font-bold">
                    {r.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1a3325]">
                      {r.customerName}
                    </p>
                    {r.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700">
                        <CheckCircle className="size-2.5" /> Verified Order
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/product/${r.productId}`}
                  className="text-[10px] font-semibold text-[#174c3a] hover:underline"
                >
                  View Item &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


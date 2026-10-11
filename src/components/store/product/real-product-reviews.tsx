"use client";

import { useState } from "react";
import { Star, CheckCircle, MessageSquarePlus, Send, User } from "lucide-react";
import { submitProductReview, type ProductReviewItem } from "@/features/reviews/actions/reviews";

interface RealProductReviewsProps {
  productId: string;
  initialReviews: ProductReviewItem[];
}

export function RealProductReviews({ productId, initialReviews }: RealProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReviewItem[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 5.0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await submitProductReview({
      productId,
      rating,
      customerName: name,
      customerEmail: email,
      title: title || undefined,
      comment,
    });

    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: res.message });
      // Prepend review optimistically
      const newReview: ProductReviewItem = {
        id: crypto.randomUUID(),
        productId,
        customerName: name,
        rating,
        title: title || null,
        comment,
        isVerifiedBuyer: true,
        createdAt: new Date().toISOString(),
      };
      setReviews([newReview, ...reviews]);
      setName("");
      setEmail("");
      setTitle("");
      setComment("");
      setTimeout(() => setShowForm(false), 2000);
    } else {
      setStatusMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="space-y-6 text-[#293d31]">
      {/* Reviews Summary Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e5ede4] bg-[#fbfdfb] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {reviews.length > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-[#173827]">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4.5 ${
                        star <= Math.round(averageRating)
                          ? "fill-current text-amber-500"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-[#63766a]">
                Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from verified buyers
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-slate-300">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="size-4.5 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-[#63766a]">
                No customer ratings recorded yet. Ratings are calculated exclusively from real buyer feedback.
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#103d31]"
        >
          <MessageSquarePlus className="size-4" />
          {showForm ? "Close Form" : "Write a Review"}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#dce7db] bg-white p-5 shadow-xs sm:p-6 space-y-4"
        >
          <h4 className="text-sm font-bold text-[#183526]">Share Your Experience</h4>

          {statusMessage && (
            <div
              className={`rounded-xl p-3 text-xs font-medium ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3b5242] mb-1">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-6 ${
                      star <= (hoverRating || rating)
                        ? "fill-current text-amber-500"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#3b5242] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-[#d5ded3] px-3.5 py-2 text-xs text-[#192b21] outline-none transition focus:border-[#174c3a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3b5242] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full rounded-xl border border-[#d5ded3] px-3.5 py-2 text-xs text-[#192b21] outline-none transition focus:border-[#174c3a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3b5242] mb-1">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional fabric quality and fit"
              className="w-full rounded-xl border border-[#d5ded3] px-3.5 py-2 text-xs text-[#192b21] outline-none transition focus:border-[#174c3a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3b5242] mb-1">
              Your Comments *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other shoppers what you loved about this piece..."
              className="w-full rounded-xl border border-[#d5ded3] px-3.5 py-2 text-xs text-[#192b21] outline-none transition focus:border-[#174c3a]"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#174c3a] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#103d31] disabled:opacity-50"
            >
              <Send className="size-3.5" />
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>
      )}

      {/* Customer Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d5dfd3] p-8 text-center bg-[#fafcfa]">
          <p className="text-sm font-semibold text-[#203c2c]">No Customer Reviews Yet</p>
          <p className="mt-1 text-xs text-[#718578] max-w-sm mx-auto">
            Be the first customer to leave feedback on this product!
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-[#d0dbcf] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1a4a35] shadow-2xs hover:bg-[#f6f9f5]"
          >
            Leave First Review
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[#e5ebe4] bg-white p-5 shadow-2xs transition hover:border-[#ccd9cb]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-full bg-[#eef4ec] text-[#22503a] font-bold text-xs">
                    {r.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1c3325]">
                        {r.customerName}
                      </span>
                      {r.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-800">
                          <CheckCircle className="size-2.5 text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#86978a]">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${
                        star <= r.rating ? "fill-current text-amber-500" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {r.title && (
                <h5 className="mt-2 text-xs font-bold text-[#1c3325]">
                  {r.title}
                </h5>
              )}
              <p className="mt-1 text-xs leading-relaxed text-[#5a6f62]">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


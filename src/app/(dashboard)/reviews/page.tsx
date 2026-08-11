'use client';

import { useEffect, useState } from 'react';
import { reviewService, Review } from '../../../services/review.service';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      setError('');

      const response = await reviewService.getMyReviews();

      setReviews(response.data);
    } catch (err: any) {
      console.error('REVIEWS LOAD ERROR:', err);

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to load reviews.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            My Reviews
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Your barber ratings and feedback.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
            <p className="mt-4 text-sm text-zinc-400">
              Loading reviews...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-2xl">
              ★
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No reviews yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Your reviews will appear here after you rate a completed appointment.
            </p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-zinc-700'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="text-xs text-zinc-500">
                    {new Date(
                      review.createdAt,
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm leading-6 text-zinc-300">
                    {review.comment || 'No comment provided.'}
                  </p>
                </div>

                <div className="mt-5 border-t border-zinc-800 pt-4">
                  <p className="text-xs text-zinc-500">
                    Appointment
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-zinc-300">
                    {review.appointmentId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
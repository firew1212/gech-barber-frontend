'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;

  customer: {
    user: {
      fullName: string;
      phoneNumber: string;
    };
  };

  barber: {
    user: {
      fullName: string;
    };
  };

  appointment?: {
    id: string;
    appointmentDate: string;
  } | null;
}

export default function ReviewsPage() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const response =
        await adminService.getReviews();

      setReviews(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load reviews.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Reviews
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          View customer reviews and ratings.
        </p>
      </div>

      {loading && <Loading />}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">
                    {
                      review.customer.user
                        .fullName
                    }
                  </h2>

                  <p className="text-xs text-zinc-500">
                    {
                      review.customer.user
                        .phoneNumber
                    }
                  </p>
                </div>

                <div className="text-lg text-yellow-400">
                  {'★'.repeat(
                    Math.max(
                      0,
                      Math.min(
                        5,
                        review.rating,
                      ),
                    ),
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-zinc-400">
                  Barber:{' '}
                  <span className="text-white">
                    {
                      review.barber.user
                        .fullName
                    }
                  </span>
                </p>
              </div>

              {review.comment && (
                <div className="mt-5 rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
                  "{review.comment}"
                </div>
              )}

              <p className="mt-4 text-xs text-zinc-600">
                {new Date(
                  review.createdAt,
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function Loading() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
      Loading...
    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">
      {message}
    </div>
  );
}
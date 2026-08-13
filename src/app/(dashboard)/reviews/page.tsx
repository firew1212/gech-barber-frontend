'use client';

import { useEffect, useState } from 'react';

import DashboardShell from '../../../components/layout/DashboardShell';

import {
  reviewService,
  Review,
} from '../../../services/review.service';

import {
  appointmentService,
} from '../../../services/appointment.service';

import type {
  Appointment,
} from '../../../types/appointment';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedAppointment, setSelectedAppointment] =
    useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [
        reviewsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        reviewService.getMyReviews(),
        appointmentService.getMyAppointments(),
      ]);

      setReviews(
        Array.isArray(reviewsResponse.data)
          ? reviewsResponse.data
          : [],
      );

      setAppointments(
        Array.isArray(appointmentsResponse.data)
          ? appointmentsResponse.data
          : [],
      );
    } catch (err: any) {
      console.error('REVIEWS LOAD ERROR:', err);

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to load reviews.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedAppointment) {
      setError('Please select an appointment.');
      return;
    }

    try {
      setSubmitting(true);

      await reviewService.create({
        appointmentId: selectedAppointment,
        rating,
        comment: comment.trim() || undefined,
      });

      setSuccess(
        'Your review has been submitted successfully.',
      );

      setSelectedAppointment('');
      setRating(5);
      setComment('');

      await loadData();
    } catch (err: any) {
      console.error('REVIEW CREATE ERROR:', err);

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to submit your review.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const reviewedAppointmentIds = new Set(
    reviews.map((review) => review.appointmentId),
  );

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'COMPLETED' &&
      !reviewedAppointmentIds.has(appointment.id),
  );

  return (
    <DashboardShell>
      <div className="space-y-8">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Reviews
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Rate your completed barber appointments.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-700/50 bg-red-950/50 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-sm text-yellow-400">
            {success}
          </div>
        )}

        {/* Review form */}
        {!loading && completedAppointments.length > 0 && (
          <section className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-red-950/70 to-zinc-950 p-6 shadow-xl sm:p-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
              Rate Your Experience
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Leave a review
            </h2>

            <form
              onSubmit={submitReview}
              className="mt-6 space-y-5"
            >

              {/* Appointment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Appointment
                </label>

                <select
                  value={selectedAppointment}
                  onChange={(event) =>
                    setSelectedAppointment(
                      event.target.value,
                    )
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-red-900 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500"
                >
                  <option value="">
                    Select completed appointment
                  </option>

                  {completedAppointments.map(
                    (appointment) => (
                      <option
                        key={appointment.id}
                        value={appointment.id}
                      >
                        {new Date(
                          appointment.appointmentDate,
                        ).toLocaleString()}
                        {' — '}
                        {appointment.barber?.fullName ||
                          'Barber'}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Rating
                </label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition ${
                        star <= rating
                          ? 'text-yellow-400'
                          : 'text-zinc-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-300">
                  Comment
                </label>

                <textarea
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  rows={4}
                  disabled={submitting}
                  placeholder="Tell us about your experience..."
                  className="w-full resize-none rounded-xl border border-red-900 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-yellow-500"
                />
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !selectedAppointment
                }
                className="w-full rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-red-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? 'Submitting...'
                  : 'Submit Review ★'}
              </button>

            </form>
          </section>
        )}

        {/* Existing reviews */}
        <section>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
              Your Reviews
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Review history
            </h2>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-zinc-900 p-10 text-center">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-red-900/50 bg-zinc-950 p-10 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950 text-2xl text-yellow-400">
                ★
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No reviews yet
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Complete an appointment to leave your
                first review.
              </p>

            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-red-900/50 bg-zinc-950 p-6 shadow-xl"
                >

                  <div className="flex justify-between gap-4">

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
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
                        ),
                      )}
                    </div>

                    <span className="text-xs text-zinc-600">
                      {new Date(
                        review.createdAt,
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <p className="mt-5 text-sm leading-6 text-zinc-300">
                    {review.comment ||
                      'No comment provided.'}
                  </p>

                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <p className="text-xs text-zinc-600">
                      Appointment
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {review.appointmentId}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </DashboardShell>
  );
}
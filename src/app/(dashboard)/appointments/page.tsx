'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import DashboardShell from '../../../components/layout/DashboardShell';
import { appointmentService } from '../../../services/appointment.service';

import type {
  Appointment,
  AppointmentStatus,
} from '../../../types/appointment';

function getStatusStyle(status: AppointmentStatus) {
  switch (status) {
    case 'PENDING':
      return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';

    case 'CONFIRMED':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';

    case 'IN_QUEUE':
      return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';

    case 'IN_SERVICE':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-300';

    case 'COMPLETED':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';

    case 'CANCELLED':
      return 'border-red-500/30 bg-red-500/10 text-red-300';

    case 'NO_SHOW':
      return 'border-red-500/30 bg-red-500/10 text-red-300';

    default:
      return 'border-zinc-700 bg-zinc-800 text-zinc-400';
  }
}

function formatStatus(status: AppointmentStatus) {
  return status.replaceAll('_', ' ');
}

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function canCancel(status: AppointmentStatus) {
  return (
    status === 'PENDING' ||
    status === 'CONFIRMED' ||
    status === 'IN_QUEUE'
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await appointmentService.getMyAppointments();

      const data = response.data;

      setAppointments(
        Array.isArray(data)
          ? data
          : data?.appointments ?? [],
      );
    } catch (err: any) {
      console.error(
        'MY APPOINTMENTS ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to load your appointments.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function handleCancel(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(id);
      setError('');
      setSuccess('');

      await appointmentService.cancel(id);

      setSuccess(
        'Your appointment has been cancelled.',
      );

      await loadAppointments();
    } catch (err: any) {
      console.error(
        'CANCEL APPOINTMENT ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to cancel this appointment.',
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
              Fire Barber
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Appointments
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              View your bookings, check their status,
              and manage your upcoming visits.
            </p>
          </div>

          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:from-red-600 hover:to-red-500"
          >
            Book Appointment
            <span>→</span>
          </Link>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-2xl border border-yellow-500/30 bg-yellow-950/20 px-5 py-4 text-sm text-yellow-300"
          >
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl border border-red-950 bg-zinc-900"
              />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-red-950 bg-gradient-to-br from-zinc-900 to-red-950/20 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-2xl text-yellow-400">
              ✂
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              No appointments yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              You haven't booked an appointment yet.
              Choose a barber and reserve your first
              visit.
            </p>

            <Link
              href="/book"
              className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 text-sm font-bold text-white transition hover:from-red-600 hover:to-red-500"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          /* Appointments */
          <div className="grid gap-5 md:grid-cols-2">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="overflow-hidden rounded-3xl border border-red-950 bg-zinc-900/90 shadow-xl shadow-black/20"
              >
                {/* Top */}
                <div className="border-b border-red-950 bg-gradient-to-r from-red-950/70 to-zinc-900 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
                        Appointment
                      </p>

                      <p className="mt-2 text-sm text-zinc-400">
                        {formatDate(
                          appointment.appointmentDate,
                        )}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getStatusStyle(
                        appointment.status,
                      )}`}
                    >
                      {formatStatus(
                        appointment.status,
                      )}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">
                  {/* Barber */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Barber
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {appointment.barber?.fullName ||
                        'Barber'}
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Services
                    </p>

                    {appointment.services?.length ? (
                      <div className="mt-2 space-y-2">
                        {appointment.services.map(
                          (service) => (
                            <div
                              key={service.id}
                              className="flex justify-between gap-4 text-sm"
                            >
                              <span className="text-zinc-300">
                                {service.name}
                              </span>

                              <span className="text-zinc-500">
                                ETB{' '}
                                {Number(
                                  service.price,
                                ).toLocaleString()}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-500">
                        No service information
                      </p>
                    )}
                  </div>

                  {/* Queue */}
                  {appointment.queueEntry && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-yellow-600">
                            Queue Position
                          </p>

                          <p className="mt-1 text-2xl font-black text-yellow-400">
                            #
                            {
                              appointment.queueEntry
                                .queuePosition
                            }
                          </p>
                        </div>

                        <Link
                          href="/queue"
                          className="rounded-lg border border-yellow-500/20 px-3 py-2 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
                        >
                          View Queue
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between border-t border-red-950 pt-5">
                    <span className="text-sm text-zinc-500">
                      Total
                    </span>

                    <span className="text-xl font-black text-yellow-400">
                      ETB{' '}
                      {Number(
                        appointment.totalPrice,
                      ).toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {appointment.status ===
                      'COMPLETED' && (
                      <Link
                        href={`/reviews?appointmentId=${appointment.id}`}
                        className="flex-1 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-400 transition hover:bg-yellow-500/20"
                      >
                        Leave Review
                      </Link>
                    )}

                    {canCancel(
                      appointment.status,
                    ) && (
                      <button
                        type="button"
                        disabled={
                          cancellingId ===
                          appointment.id
                        }
                        onClick={() =>
                          handleCancel(
                            appointment.id,
                          )
                        }
                        className="flex-1 rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId ===
                        appointment.id
                          ? 'Cancelling...'
                          : 'Cancel Appointment'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh */}
        {!loading && appointments.length > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={loadAppointments}
              className="rounded-xl border border-red-950 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-yellow-500/30 hover:text-yellow-400"
            >
              Refresh Appointments
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
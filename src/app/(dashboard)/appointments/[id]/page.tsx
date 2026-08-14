'use client';

import { useEffect, useState } from 'react';

import { appointmentService } from '../../../../services/appointment.service';

interface AppointmentService {
  id: string;
  service?: {
    id: string;
    name: string;
    price: string | number;
  };
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  totalAmount: string | number;
  notes?: string | null;

  barber?: {
    user?: {
      fullName: string;
    };
  };

  services?: AppointmentService[];

  queueEntry?: {
    queuePosition: number;
    status: string;
  } | null;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function formatPrice(price: string | number) {
  return `${Number(price).toLocaleString()} ETB`;
}

function getStatusClass(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

    case 'CANCELLED':
      return 'border-red-500/20 bg-red-500/10 text-red-400';

    case 'IN_SERVICE':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-400';

    case 'IN_QUEUE':
      return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';

    case 'NO_SHOW':
      return 'border-orange-500/20 bg-orange-500/10 text-orange-400';

    default:
      return 'border-zinc-700 bg-zinc-800 text-zinc-300';
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAppointments() {
    try {
      setLoading(true);
      setError('');

      const response =
        await appointmentService.getMyAppointments();

      setAppointments(response.data);
    } catch (err: any) {
      console.error(
        'APPOINTMENTS LOAD ERROR:',
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
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleCancel(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?',
    );

    if (!confirmed) return;

    try {
      await appointmentService.cancel(id);

      await loadAppointments();
    } catch (err: any) {
      console.error(
        'APPOINTMENT CANCEL ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to cancel appointment.',
      );
    }
  }

  return (
    <main className="min-h-full bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Selam Barber
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              My Appointments
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              View and manage your upcoming and previous
              barber appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-2xl">
              ✂
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No appointments yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              You don't have any appointments yet.
              Book your next barber service to see it
              here.
            </p>
          </div>
        ) : (
          /* Appointment List */
          <div className="grid gap-5 lg:grid-cols-2">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-zinc-700 sm:p-6"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Appointment
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {formatDate(
                        appointment.appointmentDate,
                      )}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status.replace(
                      '_',
                      ' ',
                    )}
                  </span>
                </div>

                {/* Barber */}
                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Barber
                  </p>

                  <p className="mt-1 font-semibold text-zinc-200">
                    {appointment.barber?.user
                      ?.fullName || 'Barber'}
                  </p>
                </div>

                {/* Services */}
                <div className="mt-5">
                  <p className="mb-3 text-xs uppercase tracking-wider text-zinc-600">
                    Services
                  </p>

                  <div className="space-y-2">
                    {appointment.services?.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl bg-zinc-800/50 px-3 py-2.5"
                        >
                          <span className="text-sm text-zinc-300">
                            {item.service?.name ||
                              'Service'}
                          </span>

                          <span className="text-sm font-semibold text-zinc-200">
                            {formatPrice(
                              item.service?.price ||
                                0,
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Queue */}
                {appointment.queueEntry && (
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-yellow-500/10 bg-yellow-500/5 px-4 py-3">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Queue position
                      </p>

                      <p className="mt-1 text-sm font-semibold text-yellow-400">
                        #{appointment.queueEntry.queuePosition}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-zinc-500">
                      {appointment.queueEntry.status}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Notes
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Bottom */}
                <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-zinc-600">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {formatPrice(
                        appointment.totalAmount,
                      )}
                    </p>
                  </div>

                  {appointment.status !==
                    'CANCELLED' &&
                    appointment.status !==
                      'COMPLETED' &&
                    appointment.status !==
                      'IN_SERVICE' &&
                    appointment.status !==
                      'NO_SHOW' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(
                            appointment.id,
                          )
                        }
                        className="rounded-xl border border-red-900/60 bg-red-950/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-800 hover:bg-red-950/40"
                      >
                        Cancel Appointment
                      </button>
                    )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
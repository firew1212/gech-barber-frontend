'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface QueueEntry {
  id: string;
  queuePosition: number;
  status: string;
  appointmentId?: string;
  barber?: {
    user?: {
      fullName: string;
    };
  };
  appointment?: {
    appointmentDate: string;
    status: string;
  };
}

function getStatusClass(status: string) {
  switch (status) {
    case 'WAITING':
      return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';

    case 'IN_SERVICE':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-400';

    case 'COMPLETED':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

    case 'NO_SHOW':
      return 'border-red-500/20 bg-red-500/10 text-red-400';

    default:
      return 'border-zinc-700 bg-zinc-800 text-zinc-400';
  }
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadQueue() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/queue/my');

      setQueue(response.data);
    } catch (err: any) {
      console.error('QUEUE LOAD ERROR:', err);

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to load your queue.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <main className="min-h-full bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Queue
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Track your position and appointment progress.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        ) : queue.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-2xl">
              ✂
            </div>

            <h2 className="mt-5 text-xl font-bold">
              You're not in the queue
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              When you book an appointment, your queue
              position will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {queue.map((entry) => (
              <div
                key={entry.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/10"
              >
                {/* Position */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Queue Position
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-5xl font-black tracking-tight">
                        #{entry.queuePosition}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                          entry.status,
                        )}`}
                      >
                        {entry.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-xl">
                    ✂
                  </div>
                </div>

                {/* Barber */}
                <div className="mt-7 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Barber
                  </p>

                  <p className="mt-1 font-semibold text-zinc-200">
                    {entry.barber?.user?.fullName ||
                      'Barber'}
                  </p>
                </div>

                {/* Appointment */}
                {entry.appointment && (
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Appointment
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {new Date(
                        entry.appointment.appointmentDate,
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Status message */}
                <div className="mt-5">
                  {entry.status === 'WAITING' && (
                    <p className="text-sm leading-6 text-zinc-400">
                      Please wait. The barber will serve
                      customers according to the queue.
                    </p>
                  )}

                  {entry.status === 'IN_SERVICE' && (
                    <p className="text-sm leading-6 text-blue-400">
                      Your appointment is currently being
                      served.
                    </p>
                  )}

                  {entry.status === 'COMPLETED' && (
                    <p className="text-sm leading-6 text-emerald-400">
                      Your appointment has been completed.
                    </p>
                  )}

                  {entry.status === 'NO_SHOW' && (
                    <p className="text-sm leading-6 text-red-400">
                      This appointment was marked as no-show.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh */}
        {!loading && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={loadQueue}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              Refresh Queue
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
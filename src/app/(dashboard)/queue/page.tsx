'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import DashboardShell from '../../../components/layout/DashboardShell';
import api from '../../../lib/api';

interface QueueEntry {
  id: string;
  queuePosition: number;
  status: string;

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

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/queue/my');

      setQueue(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (err: any) {
      console.error('QUEUE LOAD ERROR:', err);

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to load your queue.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-7">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
            Selam Barber
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            My Queue
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Track your position and appointment progress.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-700/50 bg-red-950/50 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-60 animate-pulse rounded-3xl bg-zinc-900"
              />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-red-900/50 bg-zinc-950 p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950 text-2xl text-yellow-400">
              #
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              You're not in the queue
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              When you book an appointment, your queue
              position will appear here.
            </p>

            <Link
              href="/book"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-red-950"
            >
              Book Appointment
            </Link>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {queue.map((entry) => (
              <div
                key={entry.id}
                className="rounded-3xl border border-red-900/50 bg-zinc-950 p-6 shadow-xl"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Queue Position
                    </p>

                    <p className="mt-2 text-5xl font-black text-yellow-400">
                      #{entry.queuePosition}
                    </p>
                  </div>

                  <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    {entry.status.replace('_', ' ')}
                  </span>

                </div>

                <div className="mt-7 rounded-2xl border border-red-900/40 bg-red-950/30 p-4">

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Barber
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {entry.barber?.user?.fullName ||
                      'Barber'}
                  </p>

                </div>

                {entry.appointment && (
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

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

              </div>
            ))}

          </div>
        )}

        {!loading && queue.length > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={loadQueue}
              className="rounded-xl border border-red-800 bg-red-950/40 px-5 py-3 text-sm font-semibold text-yellow-400 transition hover:border-yellow-500/50"
            >
              Refresh Queue
            </button>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
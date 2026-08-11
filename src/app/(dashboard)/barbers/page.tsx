'use client';

import { useEffect, useState } from 'react';

import { barberService } from '../../../services/barber.service';
import type { Barber } from '../../../types/barber';

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBarbers() {
      try {
        setLoading(true);
        setError('');

        const data = await barberService.getAll();

        setBarbers(data);
      } catch (err) {
        console.error('BARBERS ERROR:', err);
        setError('Unable to load barbers.');
      } finally {
        setLoading(false);
      }
    }

    loadBarbers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-zinc-500">
          Fire Barber
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Our Barbers
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Choose your preferred barber and continue with your appointment.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="h-14 w-14 rounded-full bg-zinc-800" />

              <div className="mt-5 h-5 w-32 rounded bg-zinc-800" />

              <div className="mt-3 h-4 w-24 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5">
          <p className="text-sm font-semibold text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && barbers.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-xl">
            ✂
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No barbers available
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            There are currently no barbers available.
          </p>
        </div>
      )}

      {/* Barber Cards */}
      {!loading && !error && barbers.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/80 hover:shadow-2xl"
            >
              {/* Avatar */}
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
                  {barber.user?.fullName?.charAt(0)?.toUpperCase() ?? 'B'}
                </div>

                <span className="rounded-full border border-emerald-900/50 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400">
                  Available
                </span>
              </div>

              {/* Info */}
              <div className="mt-5">
                <h2 className="text-lg font-semibold text-white">
                  {barber.user?.fullName ?? 'Barber'}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Professional Barber
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                Book with this barber
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
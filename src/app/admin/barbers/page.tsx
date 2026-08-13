'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

type BarberStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'UNAVAILABLE'
  | 'VACATION';

interface Barber {
  id: string;
  status: BarberStatus;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
  };
}

const statuses: BarberStatus[] = [
  'AVAILABLE',
  'BUSY',
  'UNAVAILABLE',
  'VACATION',
];

export default function BarbersPage() {
  const [barbers, setBarbers] =
    useState<Barber[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadBarbers();
  }, []);

  async function loadBarbers() {
    try {
      const response =
        await adminService.getBarbers();

      setBarbers(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load barbers.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(
    id: string,
    status: BarberStatus,
  ) {
    try {
      await adminService.updateBarberStatus(
        id,
        status,
      );

      setBarbers((current) =>
        current.map((barber) =>
          barber.id === id
            ? {
                ...barber,
                status,
              }
            : barber,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to update barber status.',
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Barbers
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage barber availability.
        </p>
      </div>

      {loading && <Loading />}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <h2 className="text-lg font-bold">
                {barber.user.fullName}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {barber.user.phoneNumber}
              </p>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-zinc-500">
                  Status
                </label>

                <select
                  value={barber.status}
                  onChange={(event) =>
                    changeStatus(
                      barber.id,
                      event.target.value as BarberStatus,
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm outline-none focus:border-yellow-400"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
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
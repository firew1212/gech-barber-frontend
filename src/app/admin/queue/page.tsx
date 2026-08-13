'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

interface QueueEntry {
  id: string;
  queuePosition: number;
  status: QueueStatus;
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
    status: string;
  } | null;
}

const statuses: QueueStatus[] = [
  'WAITING',
  'CALLED',
  'IN_SERVICE',
  'COMPLETED',
  'NO_SHOW',
];

export default function QueuePage() {
  const [queue, setQueue] =
    useState<QueueEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      const response =
        await adminService.getQueue();

      setQueue(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load queue.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(
    id: string,
    status: QueueStatus,
  ) {
    try {
      await adminService.updateQueueStatus(
        id,
        status,
      );

      setQueue((current) =>
        current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                status,
              }
            : entry,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to update queue.',
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Queue
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Monitor the barber queue.
        </p>
      </div>

      {loading && <Loading />}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="p-4">Position</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Barber</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {queue.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="p-4 text-xl font-black text-yellow-400">
                    #{entry.queuePosition}
                  </td>

                  <td className="p-4">
                    <p className="font-semibold">
                      {
                        entry.customer.user
                          .fullName
                      }
                    </p>

                    <p className="text-xs text-zinc-500">
                      {
                        entry.customer.user
                          .phoneNumber
                      }
                    </p>
                  </td>

                  <td className="p-4">
                    {
                      entry.barber.user
                        .fullName
                    }
                  </td>

                  <td className="p-4">
                    <select
                      value={entry.status}
                      onChange={(event) =>
                        changeStatus(
                          entry.id,
                          event.target
                            .value as QueueStatus,
                        )
                      }
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs"
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

type AppointmentStatus =
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

interface Appointment {
  id: string;
  appointmentDate: string;
  status: AppointmentStatus;
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
  services: {
    service: {
      name: string;
      price: string | number;
    };
  }[];
}

const statuses: AppointmentStatus[] = [
  'CONFIRMED',
  'IN_QUEUE',
  'IN_SERVICE',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const response =
        await adminService.getAppointments();

      setAppointments(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load appointments.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(
    id: string,
    status: AppointmentStatus,
  ) {
    try {
      await adminService.updateAppointmentStatus(
        id,
        status,
      );

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status,
              }
            : appointment,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to update appointment.',
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Appointments
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage all appointments.
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
                <th className="p-4">Customer</th>
                <th className="p-4">Barber</th>
                <th className="p-4">Date</th>
                <th className="p-4">Services</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(
                (appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-zinc-800 last:border-0"
                  >
                    <td className="p-4">
                      <p className="font-semibold">
                        {
                          appointment.customer
                            .user.fullName
                        }
                      </p>

                      <p className="text-xs text-zinc-500">
                        {
                          appointment.customer
                            .user.phoneNumber
                        }
                      </p>
                    </td>

                    <td className="p-4">
                      {
                        appointment.barber
                          .user.fullName
                      }
                    </td>

                    <td className="p-4 text-zinc-400">
                      {new Date(
                        appointment.appointmentDate,
                      ).toLocaleString()}
                    </td>

                    <td className="p-4 text-zinc-400">
                      {appointment.services
                        .map(
                          (item) =>
                            item.service.name,
                        )
                        .join(', ')}
                    </td>

                    <td className="p-4">
                      <select
                        value={
                          appointment.status
                        }
                        onChange={(event) =>
                          changeStatus(
                            appointment.id,
                            event.target
                              .value as AppointmentStatus,
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
                ),
              )}
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
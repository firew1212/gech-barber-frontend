'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardShell from '../../../../components/layout/DashboardShell';

import { profileService } from '../../../../services/profile.service';
import { barberService } from '../../../../services/barber.service';
import { appointmentService } from '../../../../services/appointment.service';
import { queueService } from '../../../../services/queue.service';

import type { ProfileUser } from '../../../../services/profile.service';
import type { Barber } from '../../../../types/barber';

type AppointmentStatus =
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

type QueueStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'NO_SHOW';

interface Appointment {
  id: string;
  appointmentDate: string;
  status: AppointmentStatus;
  totalAmount?: number;
  totalPrice?: number;
  customer?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      phoneNumber: string;
    };
  };
  barber?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
    };
  };
  services?: {
    service?: {
      id: string;
      name: string;
      price: number;
    };
  }[];
}

interface QueueEntry {
  id: string;
  queuePosition: number;
  status: QueueStatus;
  customer?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      phoneNumber: string;
    };
  };
  appointment?: {
    id: string;
    appointmentDate: string;
    status: AppointmentStatus;
  };
}

export default function BarberDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  async function loadDashboard(showLoader = true) {
  try {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError('');

    const profileResponse = await profileService.getProfile();
    const profileData = profileResponse.data;

    console.log('PROFILE DATA');
    console.log(profileData);

    setProfile(profileData);

    const barberResponse = await barberService.getAll();

    const barberList = Array.isArray(barberResponse.data)
      ? barberResponse.data
      : [];

    console.log('BARBER LIST');
    console.log(barberList);

    const currentBarber = barberList.find(
      (item: any) => item.user?.id === profileData?.id,
    );

    console.log('FOUND BARBER');
    console.log(currentBarber);

    if (!currentBarber) {
      throw new Error(
        `Barber profile was not found. Profile ID = ${profileData?.id}`,
      );
    }

    setBarber(currentBarber);

    const [appointmentsResponse, queueResponse] =
      await Promise.all([
        appointmentService.getAll(),
        queueService.getBarberQueue(currentBarber.id),
      ]);

    const allAppointments = Array.isArray(
      appointmentsResponse.data,
    )
      ? appointmentsResponse.data
      : [];

    const myAppointments = allAppointments.filter(
      (appointment: any) =>
        appointment.barber?.id === currentBarber.id,
    );

    setAppointments(myAppointments);

    setQueue(
      Array.isArray(queueResponse.data)
        ? queueResponse.data
        : [],
    );
  } catch (err: any) {
    console.error('BARBER DASHBOARD ERROR:', err);

    const message = err?.response?.data?.message;

    setError(
      Array.isArray(message)
        ? message[0]
        : message ||
            err?.message ||
            'Unable to load barber dashboard.',
    );
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

  useEffect(() => {
    loadDashboard();
  }, []);

  const todayAppointments = useMemo(() => {
    const today = new Date();

    return appointments.filter((appointment) => {
      const date = new Date(appointment.appointmentDate);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    });
  }, [appointments]);

  const waitingCount = queue.filter(
    (item) => item.status === 'WAITING',
  ).length;

  const inServiceCount = queue.filter(
    (item) => item.status === 'IN_SERVICE',
  ).length;

  const completedToday = todayAppointments.filter(
    (item) => item.status === 'COMPLETED',
  ).length;

  const nextCustomer = queue.find(
    (item) => item.status === 'WAITING',
  );

  async function updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    try {
      setActionLoading(appointmentId);
      setError('');

      await appointmentService.updateStatus(
        appointmentId,
        { status },
      );

      await loadDashboard(false);
    } catch (err: any) {
      console.error(
        'APPOINTMENT STATUS ERROR:',
        err,
      );

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to update appointment status.',
      );
    } finally {
      setActionLoading('');
    }
  }

  async function updateQueueStatus(
    queueId: string,
    status: QueueStatus,
  ) {
    try {
      setActionLoading(queueId);
      setError('');

      await queueService.updateStatus(
        queueId,
        { status },
      );

      await loadDashboard(false);
    } catch (err: any) {
      console.error('QUEUE STATUS ERROR:', err);

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to update queue status.',
      );
    } finally {
      setActionLoading('');
    }
  }

  function customerName(entry: QueueEntry) {
    return (
      entry.customer?.user?.fullName ||
      'Customer'
    );
  }

  function customerPhone(entry: QueueEntry) {
    return (
      entry.customer?.user?.phoneNumber ||
      'No phone number'
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-yellow-400" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading barber dashboard...
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error && !barber) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-500/30 bg-red-950/30 p-8 text-red-300">
          {error}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
              Selam Barber
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Barber Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Welcome back,{' '}
              <span className="font-semibold text-zinc-300">
                {profile?.fullName || 'Barber'}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => loadDashboard(false)}
              disabled={refreshing}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/30 hover:text-yellow-400 disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-300"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/30 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* BARBER STATUS */}
        {barber && (
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-zinc-900 to-red-950/30 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Barber Status
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    barber.status === 'AVAILABLE'
                      ? 'bg-emerald-400'
                      : barber.status === 'BUSY'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                  }`}
                />

                <span className="font-bold text-white">
                  {barber.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-500">
              Customers can see your current availability.
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Today's Appointments"
            value={todayAppointments.length}
            description="Scheduled for today"
          />

          <StatCard
            title="Waiting"
            value={waitingCount}
            description="Customers in queue"
          />

          <StatCard
            title="In Service"
            value={inServiceCount}
            description="Currently being served"
          />

          <StatCard
            title="Completed Today"
            value={completedToday}
            description="Finished appointments"
          />

        </div>

        {/* NEXT CUSTOMER */}
        <section className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-zinc-950 to-red-950/30 p-6 shadow-xl sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Next Customer
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {nextCustomer
                  ? customerName(nextCustomer)
                  : 'No waiting customer'}
              </h2>

              {nextCustomer && (
                <p className="mt-1 text-sm text-zinc-500">
                  {customerPhone(nextCustomer)}
                </p>
              )}
            </div>

            {nextCustomer && (
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-yellow-400 px-5 py-3 text-center text-black">
                  <p className="text-xs font-bold uppercase">
                    Queue
                  </p>

                  <p className="text-2xl font-black">
                    #{nextCustomer.queuePosition}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    actionLoading === nextCustomer.id
                  }
                  onClick={() =>
                    updateQueueStatus(
                      nextCustomer.id,
                      'CALLED',
                    )
                  }
                  className="rounded-2xl bg-white px-5 py-3 font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                  {actionLoading === nextCustomer.id
                    ? 'Calling...'
                    : 'Call Customer'}
                </button>
              </div>
            )}

          </div>
        </section>

        {/* QUEUE */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl sm:p-7">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Live Queue
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Today's Queue
              </h2>
            </div>

            <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              {queue.length} customers
            </span>
          </div>

          {queue.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No customers are currently in your queue.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {queue.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black/30 p-4 lg:flex-row lg:items-center lg:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 font-black text-black">
                      {entry.queuePosition}
                    </div>

                    <div>
                      <p className="font-bold text-white">
                        {customerName(entry)}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {customerPhone(entry)}
                      </p>

                      {entry.appointment && (
                        <p className="mt-1 text-xs text-zinc-600">
                          {formatDate(
                            entry.appointment.appointmentDate,
                          )}
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                      {entry.status}
                    </span>

                    {entry.status === 'CALLED' && (
                      <button
                        type="button"
                        disabled={
                          actionLoading === entry.id
                        }
                        onClick={() =>
                          updateQueueStatus(
                            entry.id,
                            'IN_SERVICE',
                          )
                        }
                        className="rounded-xl bg-yellow-400 px-4 py-2 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
                      >
                        Start Service
                      </button>
                    )}

                    {entry.status === 'IN_SERVICE' && (
                      <button
                        type="button"
                        disabled={
                          actionLoading === entry.id
                        }
                        onClick={() =>
                          updateQueueStatus(
                            entry.id,
                            'COMPLETED',
                          )
                        }
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}

                    {entry.status === 'WAITING' && (
                      <button
                        type="button"
                        disabled={
                          actionLoading === entry.id
                        }
                        onClick={() =>
                          updateQueueStatus(
                            entry.id,
                            'CALLED',
                          )
                        }
                        className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50"
                      >
                        Call
                      </button>
                    )}

                    {entry.status !== 'COMPLETED' &&
                      entry.status !== 'NO_SHOW' && (
                        <button
                          type="button"
                          disabled={
                            actionLoading === entry.id
                          }
                          onClick={() =>
                            updateQueueStatus(
                              entry.id,
                              'NO_SHOW',
                            )
                          }
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          No Show
                        </button>
                      )}

                  </div>
                </div>
              ))}

            </div>
          )}
        </section>

        {/* APPOINTMENTS */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl sm:p-7">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
              Appointments
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              My Appointments
            </h2>
          </div>

          {appointments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-600">
                    <th className="px-4 py-4">
                      Customer
                    </th>

                    <th className="px-4 py-4">
                      Date
                    </th>

                    <th className="px-4 py-4">
                      Services
                    </th>

                    <th className="px-4 py-4">
                      Total
                    </th>

                    <th className="px-4 py-4">
                      Status
                    </th>

                    <th className="px-4 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {appointments.map((appointment) => {

                    const customer =
                      appointment.customer?.user;

                    const services =
                      appointment.services
                        ?.map(
                          (item) =>
                            item.service?.name,
                        )
                        .filter(Boolean)
                        .join(', ');

                    const total =
                      appointment.totalAmount ??
                      appointment.totalPrice ??
                      0;

                    return (
                      <tr
                        key={appointment.id}
                        className="border-b border-zinc-800/70"
                      >

                        <td className="px-4 py-4">
                          <p className="font-semibold text-white">
                            {customer?.fullName ||
                              'Customer'}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {customer?.phoneNumber ||
                              'No phone'}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-zinc-400">
                          {formatDate(
                            appointment.appointmentDate,
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-zinc-400">
                          {services ||
                            'No services'}
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-yellow-400">
                          ETB{' '}
                          {Number(total).toLocaleString()}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                            {appointment.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">

                          {appointment.status ===
                            'IN_QUEUE' && (
                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                appointment.id
                              }
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  'IN_SERVICE',
                                )
                              }
                              className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
                            >
                              Start
                            </button>
                          )}

                          {appointment.status ===
                            'IN_SERVICE' && (
                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                appointment.id
                              }
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  'COMPLETED',
                                )
                              }
                              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
                            >
                              Complete
                            </button>
                          )}

                          {appointment.status !==
                            'COMPLETED' &&
                            appointment.status !==
                              'CANCELLED' &&
                            appointment.status !==
                              'NO_SHOW' &&
                            appointment.status !==
                              'IN_SERVICE' &&
                            appointment.status !==
                              'IN_QUEUE' && (
                              <button
                                type="button"
                                disabled={
                                  actionLoading ===
                                  appointment.id
                                }
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.id,
                                    'IN_QUEUE',
                                  )
                                }
                                className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50"
                              >
                                Queue
                              </button>
                            )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </DashboardShell>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>
    </div>
  );
}
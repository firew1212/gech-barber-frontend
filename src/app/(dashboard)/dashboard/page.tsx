'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';


import DashboardShell from '../../../components/layout/DashboardShell';
import { appointmentService } from '../../../services/appointment.service';
import { reviewService } from '../../../services/review.service';
import api from '../../../lib/api';

interface DashboardAppointment {
  id: string;
  appointmentDate: string;
  status: string;
  totalPrice: number;
  barber?: {
    fullName?: string;
  };
}

interface DashboardQueue {
  id: string;
  queuePosition: number;
  status: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<
    DashboardAppointment[]
  >([]);

  const [queue, setQueue] = useState<DashboardQueue[]>([]);
  const [reviewCount, setReviewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');

      const [
        appointmentsResponse,
        queueResponse,
        reviewsResponse,
      ] = await Promise.allSettled([
        appointmentService.getMyAppointments(),
        api.get('/queue/my'),
        reviewService.getMyReviews(),
      ]);

      if (appointmentsResponse.status === 'fulfilled') {
        setAppointments(
          Array.isArray(appointmentsResponse.value.data)
            ? appointmentsResponse.value.data
            : [],
        );
      }

      if (queueResponse.status === 'fulfilled') {
        setQueue(
          Array.isArray(queueResponse.value.data)
            ? queueResponse.value.data
            : [],
        );
      }

      if (reviewsResponse.status === 'fulfilled') {
        setReviewCount(
          Array.isArray(reviewsResponse.value.data)
            ? reviewsResponse.value.data.length
            : 0,
        );
      }

      if (
        appointmentsResponse.status === 'rejected' &&
        queueResponse.status === 'rejected' &&
        reviewsResponse.status === 'rejected'
      ) {
        setError('Unable to load dashboard information.');
      }
    } catch (err) {
      console.error('CUSTOMER DASHBOARD ERROR:', err);
      setError('Unable to load dashboard information.');
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.appointmentDate) >= now &&
      appointment.status !== 'CANCELLED' &&
      appointment.status !== 'COMPLETED' &&
      appointment.status !== 'NO_SHOW',
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'COMPLETED',
  );

  const activeQueue = queue.filter(
    (entry) =>
      entry.status === 'WAITING' ||
      entry.status === 'CALLED' ||
      entry.status === 'IN_SERVICE',
  );

  const nextAppointment = upcomingAppointments
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    )[0];

  return (
    <DashboardShell>
      <div className="space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-red-800/50 bg-gradient-to-br from-red-950 via-red-900 to-zinc-950 p-6 shadow-2xl sm:p-8">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
              Fire Barber
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Customer Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100/70">
              Manage your appointments, follow your queue,
              and keep track of your barber experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-red-950 shadow-lg shadow-yellow-500/10 transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Book Appointment →
              </Link>

              <Link
                href="/appointments"
                className="rounded-xl border border-red-700 bg-red-950/60 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-500/60"
              >
                My Appointments
              </Link>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-700/60 bg-red-950/50 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-500">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Your activity
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Appointments"
              value={loading ? '—' : appointments.length}
              description="All your bookings"
            />

            <StatCard
              title="Upcoming"
              value={loading ? '—' : upcomingAppointments.length}
              description="Future appointments"
            />

            <StatCard
              title="Completed"
              value={loading ? '—' : completedAppointments.length}
              description="Finished appointments"
            />

            <StatCard
              title="Reviews"
              value={loading ? '—' : reviewCount}
              description="Your submitted reviews"
            />

          </div>
        </section>

        {/* Next appointment + queue */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Next appointment */}
          <section className="rounded-3xl border border-red-900/60 bg-zinc-950 p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                  Next Appointment
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {nextAppointment
                    ? 'Your upcoming booking'
                    : 'No upcoming appointment'}
                </h2>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-950 text-xl">
                ✂
              </span>
            </div>

            {nextAppointment ? (
              <div className="mt-6 space-y-4">

                <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4">
                  <p className="text-xs text-red-200/50">
                    Date & Time
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {new Date(
                      nextAppointment.appointmentDate,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-xs text-zinc-500">
                    Barber
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {nextAppointment.barber?.fullName ||
                      'Assigned barber'}
                  </p>
                </div>

                <Link
                  href="/appointments"
                  className="block text-center rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/20"
                >
                  View Appointment
                </Link>

              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/60 p-6 text-center">

                <p className="text-sm text-zinc-500">
                  You do not have an upcoming appointment.
                </p>

                <Link
                  href="/book"
                  className="mt-4 inline-flex rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-red-950 hover:bg-yellow-300"
                >
                  Book Now
                </Link>

              </div>
            )}
          </section>

          {/* Queue */}
          <section className="rounded-3xl border border-red-900/60 bg-zinc-950 p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                  Queue
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {activeQueue.length
                    ? 'You are in the queue'
                    : 'Queue status'}
                </h2>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-950 text-xl">
                #
              </span>
            </div>

            {activeQueue.length > 0 ? (
              <div className="mt-6 space-y-4">

                {activeQueue.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-red-950 to-zinc-950 p-5"
                  >
                    <div>
                      <p className="text-xs text-zinc-500">
                        Queue Position
                      </p>

                      <p className="mt-1 text-4xl font-black text-yellow-400">
                        #{entry.queuePosition}
                      </p>
                    </div>

                    <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
                      {entry.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}

                <Link
                  href="/queue"
                  className="block text-center rounded-xl border border-red-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/50 hover:text-yellow-400"
                >
                  Open Queue
                </Link>

              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/60 p-6 text-center">

                <p className="text-sm text-zinc-500">
                  You currently have no active queue position.
                </p>

                <Link
                  href="/book"
                  className="mt-4 inline-flex rounded-xl bg-red-900 px-4 py-2.5 text-sm font-bold text-yellow-400 hover:bg-red-800"
                >
                  Book Appointment
                </Link>

              </div>
            )}

          </section>
        </div>

        {/* Quick actions */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-500">
              Quick Actions
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ActionCard
              href="/book"
              icon="✂"
              title="Book"
              description="Reserve a barber"
            />

            <ActionCard
              href="/appointments"
              icon="📅"
              title="Appointments"
              description="Manage bookings"
            />

            <ActionCard
              href="/queue"
              icon="#"
              title="Queue"
              description="Track your position"
            />

            <ActionCard
              href="/reviews"
              icon="★"
              title="Reviews"
              description="Rate your experience"
            />

          </div>
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
  value: number | string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-red-950/70 to-zinc-950 p-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-black text-yellow-400">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-red-900/50 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-yellow-500/40 hover:bg-red-950/30"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-950 text-lg text-yellow-400 transition group-hover:bg-yellow-400 group-hover:text-red-950">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        {description}
      </p>
    </Link>
  );
}
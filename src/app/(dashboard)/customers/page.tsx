'use client';

import Link from 'next/link';
import DashboardShell from '../../../components/layout/DashboardShell';

const quickActions = [
  {
    href: '/book',
    title: 'Book Appointment',
    description: 'Choose your services, barber, date and time.',
    icon: '✦',
  },
  {
    href: '/appointments',
    title: 'My Appointments',
    description: 'View and manage your upcoming appointments.',
    icon: '▣',
  },
  {
    href: '/queue',
    title: 'Queue Status',
    description: 'Check your current position in the queue.',
    icon: '◉',
  },
  {
    href: '/reviews',
    title: 'Leave a Review',
    description: 'Rate your recent Fire Barber experience.',
    icon: '★',
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">

        {/* Header */}
        <section>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
                Selam Barber
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Customer Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Manage your appointments.
              </p>
            </div>

            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:from-red-500 hover:to-amber-400"
            >
              <span>Book Appointment</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Overview */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Overview
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Your Selam Barber activity
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Upcoming */}
            <Link
              href="/appointments"
              className="group rounded-2xl border border-red-900/40 bg-gradient-to-br from-red-950/70 to-zinc-950 p-5 transition hover:-translate-y-1 hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  Upcoming
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-900/40 text-amber-400">
                  ◷
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-white">
                —
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                View appointments
              </p>

              <span className="mt-4 block text-xs font-semibold text-amber-500 opacity-0 transition group-hover:opacity-100">
                Open appointments →
              </span>
            </Link>

            {/* Completed */}
            <Link
              href="/appointments"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-amber-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  Completed
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  ✓
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-white">
                —
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Appointment history
              </p>
            </Link>

            {/* Queue */}
            <Link
              href="/queue"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-amber-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  Queue
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  ◉
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-white">
                —
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Current queue position
              </p>
            </Link>

            {/* Reviews */}
            <Link
              href="/reviews"
              className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-amber-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  Reviews
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  ★
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-white">
                —
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Your submitted reviews
              </p>
            </Link>

          </div>
        </section>

        {/* Main actions */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Quick Actions
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-500/50"
              >
                {/* Red glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-600/10 blur-3xl transition group-hover:bg-red-600/20" />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-gradient-to-br from-red-950 to-amber-950 text-lg text-amber-400">
                    {action.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {action.description}
                    </p>

                    <span className="mt-4 inline-block text-xs font-bold text-amber-500 transition group-hover:translate-x-1">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </section>

        {/* Next appointment placeholder */}
        <section className="overflow-hidden rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/80 via-zinc-950 to-amber-950/30">
          <div className="relative p-6 sm:p-8">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                Next Appointment
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                No appointment loaded yet
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Your upcoming appointment will appear here once you make
                a booking.
              </p>

              <Link
                href="/book"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
              >
                Book Your Next Visit
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

      </div>
    </DashboardShell>
  );
}
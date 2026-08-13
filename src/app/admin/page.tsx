'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import AdminLayout from './components/AdminLayout';
import { adminService } from '../../services/admin.service';

interface DashboardData {
  users: {
    total: number;
    customers: number;
    barbers: number;
  };

  barbers: {
    total: number;
    available: number;
  };

  services: {
    total: number;
    active: number;
  };

  appointments: {
    total: number;
    today: number;
  };

  payments: {
    pending: number;
    revenue: string | number;
  };

  reviews: {
    total: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');

      const response =
        await adminService.getDashboard();

      setData(response.data);
    } catch (err: any) {
      console.error(
        'ADMIN DASHBOARD ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Failed to load admin dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }

  const revenue = Number(
    data?.payments.revenue ?? 0,
  );

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-500">
                Fire Barber
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Monitor your barber shop, appointments,
              customers, payments and daily operations.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="w-fit rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </section>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-300"
          >
            <p className="font-semibold">
              Dashboard Error
            </p>

            <p className="mt-1 text-red-400/80">
              {error}
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && !data && (
          <DashboardSkeleton />
        )}

        {/* ================================================== */}
        {/* DASHBOARD */}
        {/* ================================================== */}

        {data && (
          <>
            {/* ================= KPI CARDS ================= */}

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Overview
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Current system statistics
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                  title="Total Users"
                  value={data.users.total}
                  subtitle={`${data.users.customers} customers`}
                  icon="U"
                />

                <StatCard
                  title="Barbers"
                  value={data.barbers.total}
                  subtitle={`${data.barbers.available} available now`}
                  icon="B"
                  accent
                />

                <StatCard
                  title="Appointments"
                  value={data.appointments.total}
                  subtitle={`${data.appointments.today} today`}
                  icon="A"
                />

                <StatCard
                  title="Revenue"
                  value={`ETB ${revenue.toLocaleString()}`}
                  subtitle="Total paid revenue"
                  icon="₿"
                  accent
                />

              </div>
            </section>

            {/* ================= OPERATIONS ================= */}

            <section className="grid gap-6 xl:grid-cols-3">

              {/* Barber availability */}

              <DashboardPanel
                title="Barber Availability"
                description="Current barber status"
              >
                <div className="space-y-5">

                  <ProgressRow
                    label="Available"
                    value={data.barbers.available}
                    total={data.barbers.total}
                  />

                  <ProgressRow
                    label="Unavailable"
                    value={
                      Math.max(
                        data.barbers.total -
                          data.barbers.available,
                        0,
                      )
                    }
                    total={data.barbers.total}
                  />

                </div>

                <Link
                  href="/admin/barbers"
                  className="mt-6 block rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  Manage Barbers →
                </Link>
              </DashboardPanel>

              {/* Services */}

              <DashboardPanel
                title="Services"
                description="Services available to customers"
              >
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Active
                    </p>

                    <p className="mt-1 text-3xl font-black text-yellow-400">
                      {data.services.active}
                    </p>
                  </div>

                  <div>
                    <p className="text-right text-xs uppercase tracking-wider text-zinc-600">
                      Total
                    </p>

                    <p className="mt-1 text-right text-2xl font-bold text-white">
                      {data.services.total}
                    </p>
                  </div>

                </div>

                <Link
                  href="/admin/services"
                  className="mt-6 block rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  Manage Services →
                </Link>
              </DashboardPanel>

              {/* Payments */}

              <DashboardPanel
                title="Payments"
                description="Payment activity"
              >
                <div className="space-y-4">

                  <InfoRow
                    label="Pending payments"
                    value={data.payments.pending}
                  />

                  <InfoRow
                    label="Total revenue"
                    value={`ETB ${revenue.toLocaleString()}`}
                    highlight
                  />

                  <InfoRow
                    label="Reviews"
                    value={data.reviews.total}
                  />

                </div>

                <Link
                  href="/admin/payments"
                  className="mt-6 block rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  View Payments →
                </Link>
              </DashboardPanel>

            </section>

            {/* ================= APPOINTMENTS ================= */}

            <section className="grid gap-6 lg:grid-cols-2">

              {/* Today's appointments */}

              <div className="relative overflow-hidden rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/70 via-zinc-950 to-zinc-950 p-6">

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/5 blur-3xl" />

                <div className="relative">

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                        Today
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-white">
                        Today's Appointments
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                      A
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-5xl font-black text-white">
                      {data.appointments.today}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      appointments scheduled today
                    </p>
                  </div>

                  <Link
                    href="/admin/appointments"
                    className="mt-7 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                  >
                    View Appointments →
                  </Link>

                </div>
              </div>

              {/* System summary */}

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                  System Summary
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Fire Barber
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <SummaryBox
                    label="Users"
                    value={data.users.total}
                    href="/admin/users"
                  />

                  <SummaryBox
                    label="Customers"
                    value={data.users.customers}
                    href="/admin/customers"
                  />

                  <SummaryBox
                    label="Appointments"
                    value={data.appointments.total}
                    href="/admin/appointments"
                  />

                  <SummaryBox
                    label="Reviews"
                    value={data.reviews.total}
                    href="/admin/reviews"
                  />

                </div>

              </div>

            </section>

            {/* ================= QUICK ACTIONS ================= */}

            <section>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-white">
                  Quick Management
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  Quickly access important admin sections
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <QuickLink
                  href="/admin/users"
                  title="Users"
                  description="Manage accounts"
                />

                <QuickLink
                  href="/admin/customers"
                  title="Customers"
                  description="View customer records"
                />

                <QuickLink
                  href="/admin/queue"
                  title="Queue"
                  description="Monitor barber queues"
                />

                <QuickLink
                  href="/admin/reviews"
                  title="Reviews"
                  description="Review customer feedback"
                />

              </div>

            </section>
          </>
        )}

      </div>
    </AdminLayout>
  );
}

/* ========================================================== */
/* STAT CARD */
/* ========================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
        accent
          ? 'border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-zinc-900'
          : 'border-zinc-800 bg-zinc-900/70'
      }`}
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-black text-white sm:text-3xl">
            {value}
          </p>

          <p className="mt-2 text-xs text-zinc-600">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black ${
            accent
              ? 'bg-yellow-400 text-black'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

/* ========================================================== */
/* PANEL */
/* ========================================================== */

function DashboardPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">

      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-zinc-600">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

/* ========================================================== */
/* PROGRESS */
/* ========================================================== */

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-bold text-white">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="mt-1 text-right text-[11px] text-zinc-700">
        {percentage}%
      </p>
    </div>
  );
}

/* ========================================================== */
/* INFO ROW */
/* ========================================================== */

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0">

      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${
          highlight
            ? 'text-yellow-400'
            : 'text-white'
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* ========================================================== */
/* SUMMARY BOX */
/* ========================================================== */

function SummaryBox({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-yellow-500/30 hover:bg-zinc-900"
    >
      <p className="text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </Link>
  );
}

/* ========================================================== */
/* QUICK LINK */
/* ========================================================== */

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:-translate-y-0.5 hover:border-yellow-500/30 hover:bg-zinc-900"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="font-bold text-white transition group-hover:text-yellow-400">
            {title}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            {description}
          </p>
        </div>

        <span className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-yellow-400">
          →
        </span>

      </div>
    </Link>
  );
}

/* ========================================================== */
/* SKELETON */
/* ========================================================== */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-zinc-900"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-zinc-900"
          />
        ))}
      </div>

    </div>
  );
}
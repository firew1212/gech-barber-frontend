import DashboardShell  from '../../../components/layout/DashboardShell';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <section>
          <p className="text-sm text-zinc-500">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Welcome to your Fire Barber workspace.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Appointments', '0'],
            ['Queue', '0'],
            ['Services', '0'],
            ['Payments', '0'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
            >
              <p className="text-sm text-zinc-500">
                {label}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {value}
              </p>
            </div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { logout } from '../../../lib/auth';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/users', label: 'Users', icon: '◉' },
  { href: '/admin/customers', label: 'Customers', icon: '●' },
  { href: '/admin/barbers', label: 'Barbers', icon: '✂' },
  { href: '/admin/services', label: 'Services', icon: '▦' },
  { href: '/admin/appointments', label: 'Appointments', icon: '▣' },
  { href: '/admin/queue', label: 'Queue', icon: '☷' },
  { href: '/admin/payments', label: 'Payments', icon: '$' },
  { href: '/admin/reviews', label: 'Reviews', icon: '★' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-red-950/70 bg-gradient-to-b from-red-950 via-zinc-950 to-zinc-950 lg:flex lg:flex-col">

      {/* Brand */}
      <div className="border-b border-red-900/40 px-5 py-6">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-lg font-black text-red-950 shadow-lg shadow-yellow-500/10">
            F
          </div>

          <div>
            <p className="font-black text-white">
              Fire Barber
            </p>

            <p className="text-xs text-red-200/40">
              Administration
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Management
        </p>

        <div className="space-y-1.5">
          {links.map((link) => {
            const active =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center gap-3 rounded-xl px-3 py-3',
                  'text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-yellow-400 text-red-950 shadow-lg shadow-yellow-500/10'
                    : 'text-zinc-400 hover:bg-red-950/60 hover:text-yellow-400',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-lg text-sm',
                    active
                      ? 'bg-red-950/10'
                      : 'bg-zinc-900 text-zinc-500',
                  ].join(' ')}
                >
                  {link.icon}
                </span>

                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-red-900/40 p-4">

        <div className="mb-3 rounded-xl bg-black/30 px-3 py-3">
          <p className="text-xs font-semibold text-yellow-500">
            Admin Panel
          </p>

          <p className="mt-1 text-[11px] text-zinc-600">
            Fire Barber management
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm font-semibold text-red-300 transition hover:border-red-700 hover:bg-red-900/50 hover:text-white"
        >
          Logout
        </button>

      </div>
    </aside>
  );
}
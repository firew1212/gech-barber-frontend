'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '⌂',
  },
  {
    href: '/book',
    label: 'Book Appointment',
    icon: '✂',
  },
  {
    href: '/appointments',
    label: 'My Appointments',
    icon: '▣',
  },
  {
    href: '/queue',
    label: 'Queue Status',
    icon: '#',
  },
  {
    href: '/reviews',
    label: 'Reviews',
    icon: '★',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: '●',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-gradient-to-b from-red-950/90 via-zinc-950 to-zinc-950">
      <div className="flex h-screen flex-col p-5">

        {/* Brand */}
        <div className="mb-8">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 font-black text-red-950 shadow-lg shadow-yellow-500/10">
              F
            </div>

            <div>
              <p className="font-black text-white">
                Fire Barber
              </p>

              <p className="text-xs text-red-200/40">
                Customer Portal
              </p>
            </div>
          </Link>

        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center gap-3 rounded-xl px-4 py-3',
                  'text-sm font-semibold transition',
                  active
                    ? 'bg-yellow-400 text-red-950 shadow-lg shadow-yellow-500/10'
                    : 'text-zinc-400 hover:bg-red-950 hover:text-yellow-400',
                ].join(' ')}
              >
                <span className="w-5 text-center text-base">
                  {link.icon}
                </span>

                <span>
                  {link.label}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-red-900/50 pt-5">
          <p className="text-xs font-semibold text-yellow-500/60">
            Fire Barber
          </p>

          <p className="mt-1 text-[11px] text-zinc-700">
            Professional appointment booking
          </p>
        </div>

      </div>
    </aside>
  );
}
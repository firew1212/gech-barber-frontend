'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/appointments',
    label: 'Appointments',
  },
  {
    href: '/queue',
    label: 'Queue',
  },
  {
    href: '/services',
    label: 'Services',
  },
  {
    href: '/barbers',
    label: 'Barbers',
  },
  {
    href: '/customers',
    label: 'Customers',
  },
  {
    href: '/payments',
    label: 'Payments',
  },
  {
    href: '/profile',
    label: 'Profile',
  },
  {
  label: 'Reviews',
  href: '/reviews',
}
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-5">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-black">
              F
            </div>

            <div>
              <p className="font-bold text-white">
                Fire Barber
              </p>

              <p className="text-xs text-zinc-500">
                Booking System
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(
                `${link.href}/`,
              );

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center rounded-xl px-4 py-3',
                  'text-sm font-medium transition',
                  active
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-5">
          <p className="text-xs text-zinc-600">
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
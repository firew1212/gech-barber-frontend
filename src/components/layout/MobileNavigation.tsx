'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: '▣',
  },
  {
    label: 'Queue',
    href: '/queue',
    icon: '☷',
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: '$',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: '●',
  },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 px-2 py-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition ${
                active
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
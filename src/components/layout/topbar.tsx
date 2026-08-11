// src/components/layout/topbar.tsx

'use client';

import { useRouter } from 'next/navigation';

import { logout } from '../../lib/auth';

export function Topbar() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur-xl sm:px-6">
      <div>
        <h1 className="text-sm font-semibold text-white">
          Fire Barber
        </h1>

        <p className="hidden text-xs text-zinc-500 sm:block">
          Barber management system
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
      >
        Logout
      </button>
    </header>
  );
}
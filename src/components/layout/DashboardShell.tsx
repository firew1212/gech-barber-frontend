'use client';

import { ReactNode } from 'react';

import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { MobileNavigation } from './MobileNavigation';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
        <Sidebar />
      </aside>

      {/* Main Area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
          <Topbar />
        </header>

        {/* Content */}
        <main className="min-h-[calc(100vh-64px)] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
}
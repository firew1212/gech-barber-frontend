import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="lg:pl-64">

        <main className="min-h-screen">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
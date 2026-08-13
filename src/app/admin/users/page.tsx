'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: 'ADMIN' | 'BARBER' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response =
        await adminService.getUsers();

      setUsers(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load users.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleUser(
    user: User,
  ) {
    try {
      await adminService.setUserActive(
        user.id,
        !user.isActive,
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to update user.',
      );
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description="Manage all Fire Barber users."
      />

      {loading && <Loading />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="p-4 font-semibold text-white">
                    {user.fullName}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {user.phoneNumber}
                  </td>

                  <td className="p-4">
                    <span className="rounded-lg bg-zinc-800 px-3 py-1 text-xs">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        user.isActive
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      {user.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleUser(user)
                      }
                      className="rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold hover:bg-zinc-700"
                    >
                      {user.isActive
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black">
        {title}
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
      Loading...
    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">
      {message}
    </div>
  );
}
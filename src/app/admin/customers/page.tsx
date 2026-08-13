'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

interface Customer {
  id: string;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
  };
  favoriteBarber?: {
    user: {
      fullName: string;
    };
  } | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response =
        await adminService.getCustomers();

      setCustomers(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load customers.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Customers
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          View Fire Barber customers.
        </p>
      </div>

      {loading && (
        <Loading />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Favorite Barber</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="p-4 font-semibold">
                    {customer.user.fullName}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {customer.user.phoneNumber}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {customer.favoriteBarber
                      ?.user.fullName ||
                      'None'}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        customer.user.isActive
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      {customer.user.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </span>
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
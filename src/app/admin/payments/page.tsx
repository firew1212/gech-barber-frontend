'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

interface Payment {
  id: string;
  amount: string | number;
  paymentType: string;
  paymentMethod: string;
  status:
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'CANCELLED';
  paidAt?: string | null;
  createdAt: string;

  appointment: {
    id: string;
    appointmentDate: string;

    customer: {
      user: {
        fullName: string;
        phoneNumber: string;
      };
    };

    barber: {
      user: {
        fullName: string;
      };
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const response =
        await adminService.getPayments();

      setPayments(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load payments.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function markPaid(
    id: string,
  ) {
    try {
      await adminService.markPaymentAsPaid(
        id,
      );

      setPayments((current) =>
        current.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                status: 'PAID',
                paidAt:
                  new Date().toISOString(),
              }
            : payment,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to mark payment as paid.',
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Payments
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage customer payments.
        </p>
      </div>

      {loading && <Loading />}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Barber</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="p-4">
                    <p className="font-semibold">
                      {
                        payment.appointment
                          .customer.user
                          .fullName
                      }
                    </p>

                    <p className="text-xs text-zinc-500">
                      {
                        payment.appointment
                          .customer.user
                          .phoneNumber
                      }
                    </p>
                  </td>

                  <td className="p-4">
                    {
                      payment.appointment
                        .barber.user
                        .fullName
                    }
                  </td>

                  <td className="p-4 font-bold text-yellow-400">
                    {payment.amount} Birr
                  </td>

                  <td className="p-4 text-zinc-400">
                    {payment.paymentMethod}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {payment.paymentType}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        payment.status ===
                        'PAID'
                          ? 'text-green-400'
                          : payment.status ===
                              'PENDING'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {payment.status ===
                      'PENDING' && (
                      <button
                        onClick={() =>
                          markPaid(payment.id)
                        }
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500"
                      >
                        Mark Paid
                      </button>
                    )}
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
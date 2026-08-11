'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  paymentService,
  PaymentMethod,
  PaymentType,
} from '../../../services/payment.service';

import { appointmentService } from '../../../services/appointment.service';

interface Appointment {
  id: string;
  appointmentDate: string;
  totalAmount: string | number;
  status: string;

  barber?: {
    user?: {
      fullName: string;
    };
  };

  services?: Array<{
    service?: {
      name: string;
      price: string | number;
    };
  }>;
}

export default function PaymentsPage() {
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  const [selectedAppointment, setSelectedAppointment] =
    useState('');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('TELEBIRR');

  const [paymentType, setPaymentType] =
    useState<PaymentType>('FULL');

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError('');

      const response =
        await appointmentService.getMyAppointments();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const available = data.filter(
        (appointment: Appointment) =>
          appointment.status !== 'CANCELLED' &&
          appointment.status !== 'COMPLETED',
      );

      setAppointments(available);

      if (available.length > 0) {
        setSelectedAppointment(
          available[0].id,
        );
      }
    } catch (err: any) {
      console.error(
        'PAYMENT APPOINTMENT ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to load appointments.',
      );
    } finally {
      setLoading(false);
    }
  }

  const selected = useMemo(
    () =>
      appointments.find(
        (appointment) =>
          appointment.id === selectedAppointment,
      ),
    [appointments, selectedAppointment],
  );

  const amount = selected
    ? Number(selected.totalAmount)
    : 0;

  async function handlePayment() {
    if (!selected) {
      setError('Please select an appointment.');
      return;
    }

    if (amount <= 0) {
      setError('Invalid appointment amount.');
      return;
    }

    try {
      setPaying(true);
      setError('');
      setSuccess('');

      await paymentService.create({
        appointmentId: selected.id,
        amount,
        paymentType,
        paymentMethod,
      });

      setSuccess(
        'Payment submitted successfully. Your payment is pending confirmation.',
      );
    } catch (err: any) {
      console.error(
        'PAYMENT ERROR:',
        err,
      );

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to create payment.',
      );
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-56 rounded-xl bg-zinc-800" />
            <div className="h-72 rounded-3xl bg-zinc-900" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Payments
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Choose an appointment and submit your
            payment using your preferred method.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-900/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-xl">
              $
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No appointments to pay
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Create an appointment first, then
              return here to submit your payment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Appointments */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl sm:p-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  Select Appointment
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Choose the appointment you want to pay for.
                </p>
              </div>

              <div className="space-y-3">
                {appointments.map(
                  (appointment) => {
                    const isSelected =
                      appointment.id ===
                      selectedAppointment;

                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment.id,
                          )
                        }
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-white bg-white text-black'
                            : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isSelected
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            >
                              Appointment
                            </p>

                            <p
                              className={`mt-1 text-xs ${
                                isSelected
                                  ? 'text-zinc-600'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {new Date(
                                appointment.appointmentDate,
                              ).toLocaleString()}
                            </p>

                            {appointment.barber?.user
                              ?.fullName && (
                              <p
                                className={`mt-2 text-xs ${
                                  isSelected
                                    ? 'text-zinc-700'
                                    : 'text-zinc-400'
                                }`}
                              >
                                Barber:{' '}
                                {
                                  appointment
                                    .barber.user
                                    .fullName
                                }
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                isSelected
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            >
                              {Number(
                                appointment.totalAmount,
                              ).toFixed(2)}
                            </p>

                            <p
                              className={`text-xs ${
                                isSelected
                                  ? 'text-zinc-600'
                                  : 'text-zinc-500'
                              }`}
                            >
                              ETB
                            </p>
                          </div>

                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            {/* Payment Form */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl sm:p-6">

              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Payment Details
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Submit your payment for confirmation.
                </p>
              </div>

              {/* Amount */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Amount
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {amount.toFixed(2)}
                  </span>

                  <span className="pb-1 text-sm text-zinc-500">
                    ETB
                  </span>
                </div>
              </div>

              {/* Payment Type */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Payment Type
                </label>

                <select
                  value={paymentType}
                  onChange={(event) =>
                    setPaymentType(
                      event.target.value as PaymentType,
                    )
                  }
                  disabled={paying}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white"
                >
                  <option value="FULL">
                    Full Payment
                  </option>

                  <option value="PARTIAL">
                    Partial Payment
                  </option>
                </select>
              </div>

              {/* Payment Method */}
              <div className="mt-5">
                <label className="mb-3 block text-sm font-semibold">
                  Payment Method
                </label>

                <div className="grid gap-3">

                  <button
                    type="button"
                    disabled={paying}
                    onClick={() =>
                      setPaymentMethod('TELEBIRR')
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod === 'TELEBIRR'
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'
                    }`}
                  >
                    <p className="font-semibold">
                      Telebirr
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        paymentMethod === 'TELEBIRR'
                          ? 'text-zinc-600'
                          : 'text-zinc-500'
                      }`}
                    >
                      Mobile payment
                    </p>
                  </button>

                  <button
                    type="button"
                    disabled={paying}
                    onClick={() =>
                      setPaymentMethod(
                        'BANK_TRANSFER',
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod ===
                      'BANK_TRANSFER'
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'
                    }`}
                  >
                    <p className="font-semibold">
                      Bank Transfer
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        paymentMethod ===
                        'BANK_TRANSFER'
                          ? 'text-zinc-600'
                          : 'text-zinc-500'
                      }`}
                    >
                      Direct bank payment
                    </p>
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying || !selected}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3.5 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying
                  ? 'Submitting Payment...'
                  : 'Submit Payment'}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
                Your payment will remain pending until
                it is confirmed by the administrator.
              </p>

            </section>
          </div>
        )}
      </div>
    </main>
  );
}
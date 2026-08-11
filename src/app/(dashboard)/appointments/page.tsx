'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { appointmentService } from '../../../services/appointment.service';
import { barberService } from '../../../services/barber.service';
import { serviceService } from '../../../services/service.service';

import type { CreateAppointmentDto } from '../../../types/appointment';
import type { Barber } from '../../../types/barber';
import type { Service } from '../../../types/service';

export default function AppointmentsPage() {
  const router = useRouter();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
   * Load barbers and services
   */
  useEffect(() => {
    async function loadData() {
  try {
    setLoading(true);
    setError('');

    const [barberData, serviceData] =
      await Promise.all([
        barberService.getAll(),
        serviceService.getAll(),
      ]);

    setBarbers(barberData);
    setServices(serviceData);
  } catch (err: any) {
    console.error('APPOINTMENT DATA ERROR:', err);

    const message = err?.response?.data?.message;

    setError(
      Array.isArray(message)
        ? message[0]
        : message || 'Unable to load appointment data.',
    );
  } finally {
    setLoading(false);
  }
}

    loadData();
  }, []);

  /*
   * Calculate total price
   */
  const totalPrice = useMemo(() => {
    return services
      .filter((service) => selectedServices.includes(service.id))
      .reduce(
        (total, service) => total + Number(service.price),
        0,
      );
  }, [services, selectedServices]);

  /*
   * Get selected barber name
   *
   * Backend structure:
   * barber.user.fullName
   */
  const selectedBarberName = useMemo(() => {
    const barber = barbers.find(
      (item) => item.id === selectedBarber,
    );

    return barber?.user?.fullName ?? 'Not selected';
  }, [barbers, selectedBarber]);

  /*
   * Select / unselect service
   */
  function toggleService(serviceId: string) {
    setSelectedServices((current) => {
      if (current.includes(serviceId)) {
        return current.filter((id) => id !== serviceId);
      }

      return [...current, serviceId];
    });
  }

  /*
   * Create appointment
   */
  async function handleBooking(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedBarber) {
      setError('Please select a barber.');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    if (!appointmentDate) {
      setError('Please select an appointment date and time.');
      return;
    }

    try {
      setBooking(true);

      const bookingData: CreateAppointmentDto = {
        barberId: selectedBarber,
        serviceIds: selectedServices,
        appointmentDate,
      };

      await appointmentService.create(bookingData);

      setSuccess(
        'Your appointment has been booked successfully.',
      );

      setSelectedBarber('');
      setSelectedServices([]);
      setAppointmentDate('');
    } catch (err: any) {
      console.error('APPOINTMENT BOOKING ERROR:', err);

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to create your appointment.',
      );
    } finally {
      setBooking(false);
    }
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          Loading appointment options...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Book an Appointment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Choose your barber, select your services,
            and reserve a convenient time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/appointments')}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
        >
          My Appointments
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 px-5 py-4 text-sm text-emerald-300"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleBooking}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        {/* Main content */}
        <div className="space-y-6">
          {/* Barber selection */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Step 01
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Choose your barber
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Select the barber you want to serve you.
              </p>
            </div>

            {barbers.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                No barbers are currently available.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {barbers.map((barber) => {
                  const selected =
                    selectedBarber === barber.id;

                  const barberName =
                    barber.user?.fullName ?? 'Barber';

                  const initial =
                    barberName.charAt(0).toUpperCase();

                  return (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() =>
                        setSelectedBarber(barber.id)
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-white bg-white/[0.07] shadow-lg'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            selected
                              ? 'bg-white text-black'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {initial}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {barberName}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {barber.status === 'AVAILABLE'
                              ? 'Available'
                              : barber.status}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Services */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Step 02
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Select your services
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                You can select multiple services.
              </p>
            </div>

            {services.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                No services are currently available.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const selected =
                    selectedServices.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() =>
                        toggleService(service.id)
                      }
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-white bg-white/[0.07]'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {service.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          ETB{' '}
                          {Number(
                            service.price,
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-white bg-white text-black'
                            : 'border-zinc-700'
                        }`}
                      >
                        {selected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Date and time */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Step 03
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Choose date and time
              </h2>
            </div>

            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(event) =>
                setAppointmentDate(event.target.value)
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-sm text-white outline-none transition focus:border-white focus:ring-4 focus:ring-white/5"
            />

            <p className="mt-3 text-xs leading-5 text-zinc-600">
              The backend will verify barber availability
              when you submit the appointment.
            </p>
          </section>
        </div>

        {/* Booking summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Booking Summary
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Your appointment
            </h2>

            <div className="my-6 h-px bg-zinc-800" />

            <div className="space-y-5">
              {/* Barber */}
              <div>
                <p className="text-xs text-zinc-600">
                  Barber
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {selectedBarberName}
                </p>
              </div>

              {/* Services */}
              <div>
                <p className="text-xs text-zinc-600">
                  Services
                </p>

                {selectedServices.length === 0 ? (
                  <p className="mt-1 text-sm text-zinc-500">
                    No services selected
                  </p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {services
                      .filter((service) =>
                        selectedServices.includes(
                          service.id,
                        ),
                      )
                      .map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="text-zinc-300">
                            {service.name}
                          </span>

                          <span className="text-zinc-500">
                            ETB{' '}
                            {Number(
                              service.price,
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <p className="text-xs text-zinc-600">
                  Date & Time
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {appointmentDate
                    ? new Date(
                        appointmentDate,
                      ).toLocaleString()
                    : 'Not selected'}
                </p>
              </div>
            </div>

            <div className="my-6 h-px bg-zinc-800" />

            {/* Total */}
            <div className="flex items-end justify-between">
              <span className="text-sm text-zinc-500">
                Total
              </span>

              <span className="text-2xl font-bold text-white">
                ETB {totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                booking ||
                !selectedBarber ||
                selectedServices.length === 0 ||
                !appointmentDate
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-semibold text-black shadow-lg shadow-white/5 transition hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {booking ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                  Booking...
                </>
              ) : (
                <>
                  Confirm Appointment
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardShell from '../../components/layout/DashboardShell';

import { appointmentService } from '../../services/appointment.service';
import { barberService } from '../../services/barber.service';
import { serviceService } from '../../services/service.service';

import type { CreateAppointmentDto } from '../../types/appointment';
import type { Barber } from '../../types/barber';
import type { Service } from '../../types/service';

export default function BookAppointmentPage() {
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

  /**
   * Normalize API response.
   *
   * Supports:
   * response.data = [...]
   *
   * and:
   * response.data = { data: [...] }
   */
 

  /**
   * Load barbers and services.
   */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
  try {
    setLoading(true);
    setError('');

    const [barberResponse, serviceResponse] =
      await Promise.all([
        barberService.getAll(),
        serviceService.getAll(),
      ]);

    if (!mounted) return;

    const barberData = Array.isArray(barberResponse.data)
      ? barberResponse.data
      : [];

    const serviceData = Array.isArray(serviceResponse)
      ? serviceResponse
      : [];

    console.log('BARBERS:', barberData);
    console.log('SERVICES:', serviceData);

    setBarbers(barberData);
    setServices(serviceData);
  } catch (err: any) {
    console.error('BOOKING DATA ERROR:', err);

    const message = err?.response?.data?.message;

    setError(
      Array.isArray(message)
        ? message[0]
        : message || 'Unable to load booking options.',
    );
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
}

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Calculate total price.
   */
  const totalPrice = useMemo(() => {
    return services
      .filter((service) =>
        selectedServices.includes(service.id),
      )
      .reduce(
        (total, service) =>
          total + Number(service.price),
        0,
      );
  }, [services, selectedServices]);

  /**
   * Get selected barber name.
   */
  const selectedBarberName = useMemo(() => {
    if (!Array.isArray(barbers)) {
      return 'Not selected';
    }

    const barber = barbers.find(
      (item) => item.id === selectedBarber,
    );

    return barber?.user?.fullName ?? 'Not selected';
  }, [barbers, selectedBarber]);

  /**
   * Select / unselect service.
   */
  function toggleService(serviceId: string) {
    setSelectedServices((current) => {
      if (current.includes(serviceId)) {
        return current.filter(
          (id) => id !== serviceId,
        );
      }

      return [...current, serviceId];
    });
  }

  /**
   * Create appointment.
   */
  async function handleBooking(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedBarber) {
      setError('Please choose a barber.');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    if (!appointmentDate) {
      setError(
        'Please choose your appointment date and time.',
      );
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
        'Appointment booked successfully. Your queue position will be available after booking.',
      );

      setSelectedBarber('');
      setSelectedServices([]);
      setAppointmentDate('');

      setTimeout(() => {
        router.push('/queue');
      }, 1200);
    } catch (err: any) {
      console.error(
        'APPOINTMENT BOOKING ERROR:',
        err,
      );

      const message = err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Unable to create your appointment.',
      );
    } finally {
      setBooking(false);
    }
  }

  /**
   * Loading state.
   */
  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-yellow-400" />

            Loading booking options...
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
              Fire Barber
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Book an Appointment
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Choose your barber, select your services,
              and reserve your appointment.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push('/appointments')
            }
            className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition hover:border-yellow-400/40 hover:bg-yellow-500/20"
          >
            My Appointments
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-sm text-yellow-300"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleBooking}
          className="grid gap-6 lg:grid-cols-[1fr_360px]"
        >

          {/* Main */}
          <div className="space-y-6">

            {/* Barber */}
            <section className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/50 to-zinc-950 p-5 shadow-xl sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Step 01
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Choose your barber
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Select the barber you prefer.
              </p>

              {barbers.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-red-900/30 bg-black/40 p-5 text-sm text-zinc-500">
                  No barbers are currently available.
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {barbers.map((barber) => {
                    const selected =
                      selectedBarber === barber.id;

                    const barberName =
                      barber.user?.fullName ??
                      'Barber';

                    const initial =
                      barberName
                        .charAt(0)
                        .toUpperCase();

                    return (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() =>
                          setSelectedBarber(
                            barber.id,
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-900/20'
                            : 'border-zinc-800 bg-black/40 hover:border-yellow-500/30 hover:bg-red-950/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">

                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              selected
                                ? 'bg-yellow-400 text-black'
                                : 'bg-red-950 text-yellow-500'
                            }`}
                          >
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {barberName}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {barber.status ===
                              'AVAILABLE'
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
            <section className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/50 to-zinc-950 p-5 shadow-xl sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Step 02
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Select your services
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                You can choose multiple services.
              </p>

              {services.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/40 p-5 text-sm text-zinc-500">
                  No services are currently available.
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const selected =
                      selectedServices.includes(
                        service.id,
                      );

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() =>
                          toggleService(
                            service.id,
                          )
                        }
                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-yellow-400 bg-yellow-500/10'
                            : 'border-zinc-800 bg-black/40 hover:border-yellow-500/30'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {service.name}
                          </p>

                          <p className="mt-1 text-sm text-yellow-500">
                            ETB{' '}
                            {Number(
                              service.price,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                            selected
                              ? 'border-yellow-400 bg-yellow-400 text-black'
                              : 'border-zinc-700 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Date */}
            <section className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/50 to-zinc-950 p-5 shadow-xl sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Step 03
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Choose date and time
              </h2>

              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(
                    event.target.value,
                  )
                }
                required
                className="mt-5 w-full rounded-2xl border border-zinc-800 bg-black/60 px-4 py-4 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
              />

              <p className="mt-3 text-xs leading-5 text-zinc-600">
                Your barber's availability will be
                checked when the appointment is
                submitted.
              </p>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-red-950/70 via-zinc-950 to-black p-6 shadow-2xl shadow-red-950/30">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
                Booking Summary
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Your appointment
              </h2>

              <div className="my-6 h-px bg-yellow-500/10" />

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

                            <span className="text-yellow-500">
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

              <div className="my-6 h-px bg-yellow-500/10" />

              {/* Total */}
              <div className="flex items-end justify-between">
                <span className="text-sm text-zinc-500">
                  Total
                </span>

                <span className="text-2xl font-black text-yellow-400">
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-black shadow-lg shadow-yellow-900/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {booking ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-700 border-t-black" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm Appointment
                    <span className="text-lg">
                      →
                    </span>
                  </>
                )}
              </button>

            </div>
          </aside>
        </form>
      </div>
    </DashboardShell>
  );
}
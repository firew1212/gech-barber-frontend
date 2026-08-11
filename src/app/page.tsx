'use client';

import Link from 'next/link';

const services = [
  {
    name: 'Haircut',
    description: 'Clean, modern cuts tailored to your style.',
    price: 'From 100 ETB',
    icon: '✂',
  },
  {
    name: 'Beard Trim',
    description: 'Sharp lines and a clean, confident finish.',
    price: 'From 70 ETB',
    icon: '◒',
  },
  {
    name: 'Hair Wash',
    description: 'A fresh wash before or after your service.',
    price: 'From 50 ETB',
    icon: '◌',
  },
  {
    name: 'Hair Coloring',
    description: 'Professional color with a look made for you.',
    price: 'From 200 ETB',
    icon: '✦',
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose your barber',
    text: 'Browse available barbers and select the one you prefer.',
    icon: '◉',
  },
  {
    number: '02',
    title: 'Select your services',
    text: 'Choose one or multiple services for your appointment.',
    icon: '✦',
  },
  {
    number: '03',
    title: 'Confirm your booking',
    text: 'Reserve your time and receive your digital queue position.',
    icon: '✓',
  },
];

export default function HomePage() {
  return (
   <main className="min-h-screen bg-[#18181B] text-[#FAFAF9]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[120px]" />
        <div className="absolute right-[-180px] top-[35%] h-[500px] w-[500px] rounded-full bg-zinc-700/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-zinc-800/[0.12] blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-black text-black shadow-lg transition duration-300 group-hover:scale-105">
              F
            </div>

            <div>
              <p className="font-bold tracking-tight">Fire Barber</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                Barber Booking
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/[0.05] transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>

          <Link
            href="/register"
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black sm:hidden"
          >
            Book
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-semibold text-zinc-400 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Simple. Fast. No long queues.
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              Your next
              <span className="block text-zinc-600">
                great cut
              </span>
              starts here.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              Choose your barber, select your services, and reserve your
              appointment without wasting time in long waiting lines.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-black shadow-2xl shadow-white/[0.06] transition duration-300 hover:-translate-y-1 hover:bg-zinc-200"
              >
                Book an Appointment
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035] px-7 py-4 font-semibold text-zinc-200 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-zinc-500">
              <span>✓ Choose your barber</span>
              <span>✓ Digital queue</span>
              <span>✓ Multiple services</span>
              <span>✓ Easy payments</span>
            </div>
          </div>

          {/* Hero booking preview */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 rounded-[4rem] bg-white/[0.025] blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/[0.09] bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                    Fire Barber
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Book your visit
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-black shadow-xl">
                  ✦
                </div>
              </div>

              {/* Barber */}
              <div className="mt-7 rounded-2xl border border-white/[0.07] bg-black/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Selected barber
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Available
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900 text-lg font-black ring-1 ring-white/10">
                    B
                  </div>

                  <div>
                    <p className="font-bold">Your Barber</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Professional barber
                    </p>
                  </div>

                  <div className="ml-auto text-zinc-600">›</div>
                </div>
              </div>

              {/* Appointment details */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Appointment
                  </p>

                  <p className="mt-2 font-bold">Your Time</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Choose a slot
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Queue
                  </p>

                  <p className="mt-2 font-bold">Digital</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Track your place
                  </p>
                </div>
              </div>

              {/* CTA preview */}
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-black">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Simple booking
                  </p>

                  <p className="mt-1 text-sm font-black">
                    No long waiting lines
                  </p>
                </div>

                <span className="text-2xl">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                Our Services
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Look sharp.
                <span className="text-zinc-600"> Feel confident.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Select one or multiple services when creating your appointment.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="group rounded-[1.75rem] border border-white/[0.07] bg-zinc-900/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-zinc-900"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-white/[0.06] bg-black text-xl transition duration-300 group-hover:bg-white group-hover:text-black">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {service.name}
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-zinc-500">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-bold text-zinc-200">
                    {service.price}
                  </p>

                  <span className="text-zinc-700 transition group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Simple Process
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Three steps.
            <span className="text-zinc-600"> One great experience.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-zinc-900/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/15"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest text-zinc-700">
                  {step.number}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm text-zinc-400 ring-1 ring-white/[0.06]">
                  {step.icon}
                </span>
              </div>

              <h3 className="mt-10 text-xl font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-16 text-center text-black shadow-2xl shadow-white/[0.04] sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-zinc-200 blur-3xl" />

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
              Fire Barber
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">
              Ready for your next appointment?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Create your account, choose your barber, and book your next
              visit in just a few steps.
            </p>

            <Link
              href="/register"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-black px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-zinc-800"
            >
              Get Started
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="font-bold">Fire Barber</p>
            <p className="mt-1 text-xs text-zinc-600">
              Professional barber appointment booking.
            </p>
          </div>

          <div className="flex items-center gap-5 text-sm text-zinc-500">
            <Link
              href="/login"
              className="transition hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="transition hover:text-white"
            >
              Register
            </Link>
          </div>

          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} Fire Barber
          </p>
        </div>
      </footer>
    </main>
  );
}
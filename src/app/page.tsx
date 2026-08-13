import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    name: 'Haircut',
    description:
      'Sharp, clean and professional cuts tailored to your style.',
    price: 'From ETB 100',
    image: '/images/haircut.jpg',
  },
  {
    name: 'Beard Trim',
    description:
      'Precise beard shaping and finishing for a clean look.',
    price: 'From ETB 80',
    image: '/images/beard-trim.jpg',
  },
  {
    name: 'Hair Wash',
    description:
      'A refreshing wash that leaves your hair clean and ready.',
    price: 'From ETB 70',
    image: '/images/hair-wash.jpg',
  },
  {
    name: 'Hair Coloring',
    description:
      'Professional coloring designed to give you a fresh new look.',
    price: 'From ETB 200',
    image: '/images/hair-coloring.jpg',
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose your barber',
    description:
      'Pick the barber you prefer and see their availability.',
  },
  {
    number: '02',
    title: 'Choose your service',
    description:
      'Select one or multiple services for your appointment.',
  },
  {
    number: '03',
    title: 'Book your time',
    description:
      'Choose a convenient date and time and confirm your booking.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#100718] text-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/barber-hero.jpg"
          alt="Fire Barber"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark purple overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#100718] via-[#17091f]/90 to-[#2b0b38]/45" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#100718] to-transparent" />

        {/* Gold glow */}
        <div className="absolute right-[-120px] top-[15%] h-[450px] w-[450px] rounded-full bg-amber-400/10 blur-[120px]" />

        {/* Purple glow */}
        <div className="absolute left-[-150px] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[120px]" />

        {/* Navigation */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400 text-xl font-black text-[#19091f] shadow-[0_0_30px_rgba(251,191,36,0.2)] transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                F
              </div>

              <div>
                <p className="font-black tracking-wide text-white">
                  Fire Barber
                </p>

                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300/70">
                  Premium Grooming
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#services"
                className="text-sm font-medium text-white/70 transition hover:text-amber-300"
              >
                Services
              </a>

              <a
                href="#how-it-works"
                className="text-sm font-medium text-white/70 transition hover:text-amber-300"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="text-sm font-medium text-white/70 transition hover:text-amber-300"
              >
                About
              </a>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition hover:text-white sm:px-4"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-4 py-2.5 text-sm font-bold text-[#1c0922] shadow-[0_10px_30px_rgba(251,191,36,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(251,191,36,0.35)]"
              >
                Join Us
              </Link>
            </div>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl items-center px-5 pb-28 pt-12 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-[fadeInUp_0.7s_ease-out] inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-black/20 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)]" />

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                Premium Barber Experience
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-7 animate-[fadeInUp_0.9s_ease-out] text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Your style.
              <span className="block bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Our craft.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl animate-[fadeInUp_1.1s_ease-out] text-base leading-7 text-white/65 sm:text-lg">
              Experience professional barbering with easy online
              booking. Choose your barber, select your services and
              reserve your perfect time.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 animate-[fadeInUp_1.3s_ease-out] sm:flex-row">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-7 py-4 font-black text-[#1b0922] shadow-[0_15px_50px_rgba(251,191,36,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(251,191,36,0.4)]"
              >
                Book Appointment

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-amber-300/10"
              >
                Explore Services
              </a>
            </div>

            {/* Trust stats */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-black text-amber-300">
                  100%
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Professional service
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-amber-300">
                  Easy
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Online booking
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-amber-300">
                  4+
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Premium services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#services"
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition hover:text-amber-300 sm:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Discover
          </span>

          <span className="animate-bounce text-lg">
            ↓
          </span>
        </a>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================== */}
      <section
        id="services"
        className="relative bg-[#100718] px-5 py-24 sm:px-8 lg:px-10"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-700/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              Our Services
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Look sharp.
              <span className="block text-amber-400">
                Feel confident.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/50 sm:text-base">
              Choose from our professional grooming services and
              create the look that works for you.
            </p>
          </div>

          {/* Service cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Link
                href="/book"
                key={service.name}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#190b22] transition duration-500 hover:-translate-y-3 hover:border-amber-400/30 hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#190b22] via-transparent to-transparent opacity-80" />

                  {/* Number */}
                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/30 text-xs font-bold text-amber-300 backdrop-blur-md">
                    0{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black">
                    {service.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-400">
                      {service.price}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 transition duration-300 group-hover:border-amber-400/30 group-hover:bg-amber-400 group-hover:text-[#190b22]">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          GOLD DIVIDER
      ========================================================== */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* =========================================================
          ABOUT / EXPERIENCE
      ========================================================== */}
      <section
        id="about"
        className="relative overflow-hidden bg-gradient-to-br from-[#180a21] via-[#210c2d] to-[#100718] px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-400/5 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              The Fire Barber Difference
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              More than a haircut.
              <span className="block text-amber-400">
                It's your signature.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              We believe a great barber experience should be simple,
              comfortable and personal. Choose the barber you trust,
              select the services you need and arrive ready for your
              appointment.
            </p>

            <Link
              href="/book"
              className="mt-8 inline-flex rounded-2xl border border-amber-400/30 bg-amber-400/10 px-6 py-3.5 text-sm font-bold text-amber-300 transition duration-300 hover:-translate-y-1 hover:bg-amber-400 hover:text-[#190b22]"
            >
              Start Your Booking →
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Personal Barber',
                text: 'Choose the barber you prefer.',
              },
              {
                title: 'Easy Booking',
                text: 'Reserve your time in a few clicks.',
              },
              {
                title: 'Digital Queue',
                text: 'Track your appointment progress.',
              },
              {
                title: 'Premium Service',
                text: 'Professional grooming every time.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:border-amber-400/25 hover:bg-amber-400/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 font-black text-[#1b0922] shadow-lg transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {index + 1}
                </div>

                <h3 className="mt-5 font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section
        id="how-it-works"
        className="bg-[#100718] px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              Book in three steps.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
              No complicated process. Just choose, schedule and
              enjoy your appointment.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent md:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-white/10 bg-[#190b22] p-7 text-center transition duration-500 hover:-translate-y-2 hover:border-amber-400/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-300 to-amber-500 text-xl font-black text-[#1b0922] shadow-[0_0_40px_rgba(251,191,36,0.15)]">
                  {step.number}
                </div>

                <h3 className="mt-7 text-xl font-black">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-amber-400/20 bg-gradient-to-br from-[#35103e] via-[#210b2d] to-[#17091f] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-12 lg:p-16">
          {/* Glow */}
          <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-amber-400/10 blur-[100px]" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                Ready when you are
              </p>

              <h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">
                Your next great look
                <span className="text-amber-400">
                  {' '}
                  starts here.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                Book your appointment today and experience Fire
                Barber.
              </p>
            </div>

            <Link
              href="/book"
              className="group shrink-0 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-7 py-4 font-black text-[#1b0922] shadow-[0_15px_50px_rgba(251,191,36,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(251,191,36,0.35)]"
            >
              Book Now

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-white/10 bg-[#0b0510] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-[#19091f]">
                F
              </div>

              <div>
                <p className="font-bold">
                  Fire Barber
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Premium Grooming
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-white/40">
            <a
              href="#services"
              className="transition hover:text-amber-300"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-amber-300"
            >
              How It Works
            </a>

            <Link
              href="/login"
              className="transition hover:text-amber-300"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="transition hover:text-amber-300"
            >
              Register
            </Link>
          </div>

          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Fire Barber
          </p>
        </div>
      </footer>
    </main>
  );
}
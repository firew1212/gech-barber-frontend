'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../../services/auth.service';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters',
      );
      return;
    }

    try {
      setLoading(true);

      await authService.register({
  fullName: fullName.trim(),
  phoneNumber: phoneNumber.trim(),
  password,
});

      router.push('/login');
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message ||
              'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-black shadow-2xl">
            <Link href={"/"}>S</Link>
          </div>

          <h1 className="text-4xl font-bold">
            Selam Barber
          </h1>

          <p className="mt-3 text-zinc-400">
            Create your account and book
            appointments instantly.
          </p>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value,
                  )
                }
                placeholder="John Doe"
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value,
                  )
                }
                placeholder="+2519XXXXXXXX"
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-white"
              />
            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  placeholder="******"
                  disabled={loading}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-20 outline-none transition focus:border-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400"
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>

            {error && (
              <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center">

            <p className="text-sm text-zinc-500">
              Already have an account?
            </p>

            <button
              onClick={() =>
                router.push('/login')
              }
              className="mt-2 font-semibold text-white hover:underline"
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
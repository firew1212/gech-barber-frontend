'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authService } from '../../../services/auth.service';
import { setToken } from '../../../lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const phone = phoneNumber.trim();

    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        phoneNumber: phone,
        password,
      });

      /*
       * Backend response:
       *
       * {
       *   accessToken: "...",
       *   user: {
       *     id: "...",
       *     fullName: "...",
       *     phoneNumber: "...",
       *     role: "CUSTOMER"
       *   }
       * }
       */
      const token = response.data.accessToken;

      if (!token) {
        throw new Error('No access token returned.');
      }

      setToken(token);

      const role = response.data.user.role;

if (role === 'ADMIN') {
  router.replace('/admin');
} else if (role === 'BARBER') {
  router.replace('dashboard/barber');
} else {
  router.replace('/dashboard');
}
    } catch (error: any) {
      console.error('LOGIN ERROR:', error);

      const message = error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Invalid phone number or password.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-white text-2xl font-black text-black shadow-[0_0_50px_rgba(255,255,255,0.08)]">
            F
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
            Sign in to manage your barber appointments.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(event.target.value)
                }
                placeholder="+251 9XX XXX XXX"
                autoComplete="tel"
                disabled={loading}
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-600 hover:border-zinc-500 focus:border-white focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 pr-20 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-600 hover:border-zinc-500 focus:border-white focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm leading-5 text-red-300"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 font-semibold text-black shadow-lg shadow-white/5 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={() => router.push('/register')}
              className="mt-2 text-sm font-semibold text-white transition hover:text-zinc-300 hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-600">
            Fire Barber
          </p>

          <p className="mt-1 text-[11px] text-zinc-700">
            Professional barber appointment booking
          </p>
        </div>
      </div>
    </main>
  );
}
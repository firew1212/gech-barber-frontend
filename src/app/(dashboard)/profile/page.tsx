'use client';

import { useEffect, useState } from 'react';

import {
  profileService,
  ProfileUser,
} from '../../../services/profile.service';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        const response = await profileService.getProfile();

        const data = response.data;

        setProfile({
          id: data?.id ?? '',
          fullName: data?.fullName ?? 'User',
          phoneNumber: data?.phoneNumber ?? '',
          role: data?.role ?? 'CUSTOMER',
          isActive: data?.isActive ?? true,
        });
      } catch (err: any) {
        console.error('PROFILE LOAD ERROR:', err);

        const message = err?.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message[0]
            : message || 'Unable to load profile.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          <p className="mt-4 text-sm text-zinc-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-900/50 bg-red-950/30 p-6 text-sm text-red-300">
          {error || 'Profile not found.'}
        </div>
      </main>
    );
  }

  const displayName = profile.fullName?.trim() || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            View your account information.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <div className="border-b border-zinc-800 bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-3xl font-black text-black shadow-xl">
                {initial}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  {profile.phoneNumber || 'No phone number'}
                </p>

                <span className="mt-3 inline-flex rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  {profile.role}
                </span>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8">

            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Account Information
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-xs text-zinc-500">
                  Full Name
                </p>

                <p className="mt-2 font-semibold text-white">
                  {displayName}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-xs text-zinc-500">
                  Phone Number
                </p>

                <p className="mt-2 font-semibold text-white">
                  {profile.phoneNumber || 'Not available'}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-xs text-zinc-500">
                  Account Role
                </p>

                <p className="mt-2 font-semibold text-white">
                  {profile.role}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-xs text-zinc-500">
                  Account Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      profile.isActive === false
                        ? 'bg-red-500'
                        : 'bg-emerald-500'
                    }`}
                  />

                  <span
                    className={
                      profile.isActive === false
                        ? 'font-semibold text-red-400'
                        : 'font-semibold text-emerald-400'
                    }
                  >
                    {profile.isActive === false
                      ? 'Inactive'
                      : 'Active'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';

import DashboardShell from '../../../components/layout/DashboardShell';

import {
  profileService,
  ProfileUser,
} from '../../../services/profile.service';

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<ProfileUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError('');

      const response =
        await profileService.getProfile();

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

      const message =
        err?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message[0]
          : message || 'Unable to load profile.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-3xl border border-red-900/50 bg-zinc-950 px-10 py-12 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-red-900 border-t-yellow-400" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading profile...
            </p>

          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !profile) {
    return (
      <DashboardShell>
        <div className="rounded-3xl border border-red-700/50 bg-red-950/50 p-6 text-sm text-red-200">
          {error || 'Profile not found.'}
        </div>
      </DashboardShell>
    );
  }

  const displayName =
    profile.fullName?.trim() || 'User';

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-7">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
            Fire Barber
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Your Fire Barber account information.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-red-900/50 bg-zinc-950 shadow-2xl">

          {/* Profile header */}
          <div className="bg-gradient-to-br from-red-950 via-red-900 to-zinc-950 p-7 sm:p-9">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-400 text-4xl font-black text-red-950 shadow-xl">
                {initial}
              </div>

              <div>

                <h2 className="text-2xl font-black text-white">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-red-100/60">
                  {profile.phoneNumber ||
                    'No phone number'}
                </p>

                <span className="mt-3 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  {profile.role}
                </span>

              </div>

            </div>

          </div>

          {/* Information */}
          <div className="p-7 sm:p-9">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500">
              Account Information
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <InfoCard
                label="Full Name"
                value={displayName}
              />

              <InfoCard
                label="Phone Number"
                value={
                  profile.phoneNumber ||
                  'Not available'
                }
              />

              <InfoCard
                label="Account Role"
                value={profile.role}
              />

              <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">

                <p className="text-xs text-zinc-600">
                  Account Status
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      profile.isActive === false
                        ? 'bg-red-500'
                        : 'bg-yellow-400'
                    }`}
                  />

                  <span
                    className={
                      profile.isActive === false
                        ? 'font-semibold text-red-400'
                        : 'font-semibold text-yellow-400'
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
    </DashboardShell>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-red-900/40 bg-zinc-950 p-5">

      <p className="text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>

    </div>
  );
}
'use client';

import { FormEvent, useEffect, useState } from 'react';

import AdminLayout from '../components/AdminLayout';
import { adminService } from '../../../services/admin.service';

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] =
    useState<Service[]>([]);

  const [name, setName] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const response =
        await adminService.getServices();

      setServices(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load services.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function createService(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      alert('Service name is required.');
      return;
    }

    const numericPrice =
      Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      alert('Enter a valid price.');
      return;
    }

    try {
      setSaving(true);

      await adminService.createService({
        name: name.trim(),
        description:
          description.trim() || undefined,
        price: numericPrice,
      });

      setName('');
      setDescription('');
      setPrice('');

      await loadServices();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to create service.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteService(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Are you sure you want to deactivate this service?',
      );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteService(id);

      setServices((current) =>
        current.map((service) =>
          service.id === id
            ? {
                ...service,
                isActive: false,
              }
            : service,
        ),
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to deactivate service.',
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Services
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Create and manage barber services.
        </p>
      </div>

      {/* Create service */}
      <form
        onSubmit={createService}
        className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h2 className="mb-5 text-lg font-bold">
          Add Service
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Service name"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
          />

          <input
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
          />

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {saving
            ? 'Creating...'
            : 'Create Service'}
        </button>
      </form>

      {/* Services */}
      {loading && (
        <Loading />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-zinc-800 last:border-0"
                >
                  <td className="p-4 font-semibold">
                    {service.name}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {service.description ||
                      '—'}
                  </td>

                  <td className="p-4 text-yellow-400">
                    {service.price} Birr
                  </td>

                  <td className="p-4">
                    {service.isActive ? (
                      <span className="text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-400">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {service.isActive && (
                      <button
                        onClick={() =>
                          deleteService(
                            service.id,
                          )
                        }
                        className="rounded-lg bg-red-950 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900"
                      >
                        Deactivate
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
    <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">
      {message}
    </div>
  );
}
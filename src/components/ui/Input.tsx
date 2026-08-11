'use client';

import type {
  InputHTMLAttributes,
} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({
  label,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-200"
      >
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={[
          'w-full rounded-xl border border-zinc-800',
          'bg-zinc-950 px-4 py-3',
          'text-sm text-white',
          'placeholder:text-zinc-600',
          'outline-none transition',
          'focus:border-zinc-400',
          'focus:ring-4 focus:ring-white/5',
          className,
        ].join(' ')}
      />
    </div>
  );
}
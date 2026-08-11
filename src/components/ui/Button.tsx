'use client';

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex min-h-11 items-center justify-center',
        'rounded-xl px-5 py-3 text-sm font-semibold',
        'bg-white text-zinc-950',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:bg-zinc-200',
        'focus:outline-none focus:ring-2 focus:ring-white/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ].join(' ')}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
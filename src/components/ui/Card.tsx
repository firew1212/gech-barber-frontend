import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-zinc-800',
        'bg-zinc-900/80 shadow-xl',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
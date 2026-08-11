import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fire Barber',
  description: 'Professional barber appointment booking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
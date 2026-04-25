import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'CaseAtlas — Track Any Case, Find the Truth',
  description:
    'CaseAtlas is a case-centric platform for tracking real-world incidents, following official updates, and contributing to the public record. Subscribe to any case with a unique Case ID.',
  keywords: ['case tracking', 'missing persons', 'truth', 'incident reports', 'public record'],
  openGraph: {
    title: 'CaseAtlas',
    description: 'Track any case. Find the truth.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

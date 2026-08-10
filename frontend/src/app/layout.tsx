import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quintadinha Online - Hortifrúti Fresco e Orgânico',
  description: 'Compre frutas, verduras e legumes frescos diretamente do produtor com entrega rápida e garantia de qualidade.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen bg-background text-navy antialiased pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}

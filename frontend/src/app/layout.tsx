import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Faro | Plataforma Integral para Restaurantes con IA Multimodal',
  description: 'Gestión inteligente de cartas gastronómicas, códigos QR interactivos, mozos y cocina en tiempo real con Google Gemini, FastAPI y Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-navy-950 text-slate-100`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

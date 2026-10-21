import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export default function PublicLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-emerald-950 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
      >
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="conteudo-principal" tabIndex={-1} className="flex-1 focus:outline-none">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

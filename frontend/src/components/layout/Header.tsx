import { Link } from 'react-router-dom';

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header
      role="banner"
      className="flex flex-wrap items-center justify-between gap-4 bg-emerald-950 px-6 py-4 text-white"
    >
      <Link
        to="/"
        className="text-lg font-bold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        SisTomPatrimônio — SIP-MA
      </Link>
      <nav aria-label="Navegação principal" className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400">
          Mapa Público
        </Link>
        <Link to="/acervo" className="hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400">
          Acervo Público
        </Link>
        <Link
          to="/reportar-inconsistencia"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Reportar Inconsistência
        </Link>
        {authenticated ? (
          <span className="rounded bg-emerald-800 px-3 py-1 text-xs font-semibold">
            Painel administrativo
          </span>
        ) : (
          <Link
            to="/admin/login"
            className="rounded bg-amber-400 px-3 py-1.5 font-semibold text-slate-950 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Acesso técnico
          </Link>
        )}
      </nav>
    </header>
  );
}

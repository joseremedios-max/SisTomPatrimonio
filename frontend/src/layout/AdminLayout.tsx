import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, type PerfilUsuario } from '../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: PerfilUsuario[];
}

/**
 * Moldura Base de Layout do Painel Administrativo do SIP-MA com filtragem RBAC por perfil.
 */
export const AdminLayout: React.FC = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Acervo Cultural', path: '/admin/bens', icon: '🏛️' },
    {
      label: 'Vistorias Técnicas',
      path: '/admin/vistorias',
      icon: '🔍',
      roles: ['ADMIN', 'TECNICO', 'CONSULTOR'],
    },
    {
      label: 'Tombamento & Proteção',
      path: '/admin/protecao',
      icon: '📜',
      roles: ['ADMIN', 'TECNICO'],
    },
    {
      label: 'Salvaguarda Imaterial',
      path: '/admin/salvaguarda',
      icon: '🎭',
      roles: ['ADMIN', 'TECNICO'],
    },
    {
      label: 'Processos Judiciais',
      path: '/admin/processos',
      icon: '⚖️',
      roles: ['ADMIN', 'JURIDICO'],
    },
    { label: 'Documentos & Mídias', path: '/admin/documentos', icon: '📁' },
    {
      label: 'Imóveis em risco',
      path: '/admin/risco',
      icon: '⚠️',
      roles: ['ADMIN', 'TECNICO', 'CONSULTOR', 'LEITOR'],
    },
    {
      label: 'Georreferenciamento',
      path: '/admin/georreferenciamento',
      icon: '🗺️',
      roles: ['ADMIN', 'TECNICO', 'CONSULTOR', 'LEITOR'],
    },
    { label: 'Relatórios', path: '/admin/relatorios', icon: '📈' },
    { label: 'Usuários', path: '/admin/usuarios', icon: '👥', roles: ['ADMIN'] },
    { label: 'Configurações', path: '/admin/configuracoes', icon: '⚙️', roles: ['ADMIN'] },
    {
      label: 'Trilha de Auditoria',
      path: '/admin/auditoria',
      icon: '🛡️',
      roles: ['ADMIN', 'TECNICO'],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Lateral Administrativa */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
        <div className="overflow-y-auto">
          <div className="p-5 border-b border-slate-800">
            <h1 className="text-lg font-bold tracking-wide text-emerald-400">SIP-MA</h1>
            <p className="text-xs text-slate-400">Patrimônio Cultural do Maranhão</p>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              if (item.roles && usuario && !item.roles.includes(usuario.perfil)) {
                return null;
              }
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé com Informações do Usuário Autenticado */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="mb-3">
            <p className="text-sm font-semibold truncate text-slate-200">{usuario?.nome || 'Técnico SECMA'}</p>
            <p className="text-[11px] truncate text-slate-400 mb-1">{usuario?.email}</p>
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900 text-emerald-300">
              PERFIL: {usuario?.perfil || 'TECNICO'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded text-red-400 hover:bg-red-950/50 transition-colors border border-red-900/50"
          >
            🚪 Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
          <h2 className="text-sm font-semibold text-slate-600">
            Painel Administrativo - SECMA / IPHAN-MA
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>
              Sessão RBAC Ativa: <strong className="text-emerald-800">{usuario?.perfil}</strong>
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

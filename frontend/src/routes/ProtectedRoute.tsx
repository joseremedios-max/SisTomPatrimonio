import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { PerfilUsuario } from '../context/AuthContext';

interface ProtectedRouteProps {
  perfisPermitidos?: PerfilUsuario[];
}

/**
 * Guarda de Rotas Protegidas no React Router DOM v6.
 * Aplica controle de acesso baseado em papéis (RBAC) no frontend.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ perfisPermitidos }) => {
  const { autenticado, carregando, possuiPerfil } = useContext(AuthContext);

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-600">Verificando credenciais do SIP-MA...</span>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" replace />;
  }

  if (perfisPermitidos && perfisPermitidos.length > 0 && !possuiPerfil(...perfisPermitidos)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-700">Acesso Restrito (HTTP 403)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Seu perfil de usuário não possui atribuição para acessar este módulo técnico do patrimônio.
          </p>
          <a
          href="/admin"
            className="mt-4 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

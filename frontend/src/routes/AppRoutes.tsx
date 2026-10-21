import { Navigate, Route } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import { AdminLayout } from '../layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import HomeMapPage from '../pages/public/HomeMapPage';
import AcervoPublicoPage from '../pages/public/AcervoPublicoPage';
import FichaPublicaPage from '../pages/public/FichaPublicaPage';
import ReportarInconsistenciaPage from '../pages/public/ReportarInconsistenciaPage';
import LoginPage from '../pages/admin/auth/LoginPage';
import TwoFactorPage from '../pages/admin/auth/TwoFactorPage';
import RecoverCredentialsPage from '../pages/admin/auth/RecoverCredentialsPage';
import DashboardPage from '../pages/admin/DashboardPage';
import { BemCulturalWizardPage } from '../pages/admin/BemCulturalWizardPage';
import { VistoriasPage } from '../pages/admin/VistoriasPage';
import ModuloJuridicoPage from '../pages/admin/ModuloJuridicoPage';
import { SalvaguardaPage } from '../pages/admin/SalvaguardaPage';
import { AuditoriaPage } from '../pages/admin/AuditoriaPage';
import DocumentosPage from '../pages/admin/DocumentosPage';
import UsuariosPage from '../pages/admin/UsuariosPage';
import RiscoPage from '../pages/admin/RiscoPage';
import GeorreferenciamentoPage from '../pages/admin/GeorreferenciamentoPage';
import RelatoriosPage from '../pages/admin/RelatoriosPage';
import ConfiguracoesPage from '../pages/admin/ConfiguracoesPage';
import BensPage from '../pages/admin/BensPage';
import ProtecaoPage from '../pages/admin/ProtecaoPage';
import CategoriaPublicaPage from '../pages/public/CategoriaPublicaPage';
import { NaturezaBem } from '../types/dtos';

export default function AppRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeMapPage />} />
        <Route path="/acervo" element={<AcervoPublicoPage />} />
        <Route
          path="/acervo/imaterial"
          element={<CategoriaPublicaPage natureza={NaturezaBem.IMATERIAL} titulo="Patrimônio imaterial" />}
        />
        <Route
          path="/acervo/arqueologico"
          element={<CategoriaPublicaPage natureza={NaturezaBem.ARQUEOLOGICO} titulo="Sítios arqueológicos" />}
        />
        <Route path="/acervo/:id" element={<FichaPublicaPage />} />
        <Route path="/ficha/:id" element={<FichaPublicaPage />} />
        <Route path="/relatar-inconsistencia" element={<ReportarInconsistenciaPage />} />
        <Route path="/reportar-inconsistencia" element={<ReportarInconsistenciaPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/2fa" element={<TwoFactorPage />} />
      <Route path="/admin/recuperar-credenciais" element={<RecoverCredentialsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Rotas acessíveis a todos os perfis autenticados (ADMIN, TECNICO, JURIDICO, CONSULTOR, LEITOR) */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/bens" element={<BensPage />} />
          <Route path="/admin/documentos" element={<DocumentosPage />} />
          <Route path="/admin/risco" element={<RiscoPage />} />
          <Route path="/admin/georreferenciamento" element={<GeorreferenciamentoPage />} />
          <Route path="/admin/relatorios" element={<RelatoriosPage />} />

          {/* Rotas exclusivas para Corpo Técnico e Peritos (ADMIN, TECNICO, CONSULTOR) */}
          <Route element={<ProtectedRoute perfisPermitidos={['ADMIN', 'TECNICO', 'CONSULTOR']} />}>
            <Route path="/admin/vistorias" element={<VistoriasPage />} />
          </Route>

          {/* Rotas exclusivas de Tombamento, Cadastro Wizard, Salvaguarda e Auditoria (ADMIN, TECNICO) */}
          <Route element={<ProtectedRoute perfisPermitidos={['ADMIN', 'TECNICO']} />}>
            <Route path="/admin/bens/novo" element={<BemCulturalWizardPage />} />
            <Route path="/admin/protecao" element={<ProtecaoPage />} />
            <Route path="/admin/salvaguarda" element={<SalvaguardaPage />} />
            <Route path="/admin/auditoria" element={<AuditoriaPage />} />
          </Route>

          {/* Rota exclusiva da Procuradoria / Módulo Jurídico (ADMIN, JURIDICO) */}
          <Route element={<ProtectedRoute perfisPermitidos={['ADMIN', 'JURIDICO']} />}>
            <Route path="/admin/processos" element={<ModuloJuridicoPage />} />
          </Route>

          {/* Rotas exclusivas de Governança e Administração Geral (ADMIN) */}
          <Route element={<ProtectedRoute perfisPermitidos={['ADMIN']} />}>
            <Route path="/admin/usuarios" element={<UsuariosPage />} />
            <Route path="/admin/configuracoes" element={<ConfiguracoesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );
}

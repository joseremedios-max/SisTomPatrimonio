import { useEffect, useState } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import type { AlertaDTO, DashboardDTO } from '../../types/dtos';

const initialDashboard: DashboardDTO = {
  totalBens: 0, bensPublicados: 0, bensEmRevisao: 0,
  vistoriasPendentes: 0, bensAltoRisco: 0, processosAbertos: 0,
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [alertas, setAlertas] = useState<AlertaDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<DashboardDTO>('/v1/dashboard'),
      api.get<AlertaDTO[]>('/v1/dashboard/alertas'),
    ]).then(([dashboardResponse, alertasResponse]) => {
      setDashboard(dashboardResponse.data);
      setAlertas(alertasResponse.data);
    }).catch((error: Error) => setErro(error.message));
  }, []);

  const cards = [
    ['Bens cadastrados', dashboard.totalBens],
    ['Bens publicados', dashboard.bensPublicados],
    ['Vistorias pendentes', dashboard.vistoriasPendentes],
    ['Bens em revisão', dashboard.bensEmRevisao],
    ['Bens em alto risco', dashboard.bensAltoRisco],
    ['Processos judiciais', dashboard.processosAbertos],
  ];

  return (
    <PageShell title="Dashboard">
      {erro && <p className="mb-4 text-red-700">{erro}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div className="rounded-lg bg-white p-5 shadow" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="text-3xl">{value}</strong>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-lg bg-white p-5 shadow">
        <h2 className="text-lg font-semibold text-emerald-950">Alertas operacionais</h2>
        {alertas.length === 0
          ? <p className="mt-3 text-slate-600">Nenhum alerta de risco no momento.</p>
          : <ul className="mt-3 space-y-2">{alertas.map((alerta) => <li key={`${alerta.referenciaId}-${alerta.tipo}`} className="rounded bg-amber-50 p-3 text-amber-900">{alerta.mensagem}</li>)}</ul>}
      </section>
    </PageShell>
  );
}

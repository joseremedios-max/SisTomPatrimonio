import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { ProcessoJudicialDTO } from '../../types/dtos';

export const ProcessosJudiciaisPage: React.FC = () => {
  const [processos, setProcessos] = useState<ProcessoJudicialDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCnj, setFiltroCnj] = useState('');
  const [, setSelectedProcesso] = useState<ProcessoJudicialDTO | null>(null);

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = async () => {
    try {
      setLoading(true);
      const res = await api.get<ProcessoJudicialDTO[]>('/processos-judiciais');
      setProcessos(res.data);
    } catch (err) {
      console.error('Erro ao carregar processos judiciais:', err);
    } finally {
      setLoading(false);
    }
  };

  const processosFiltrados = processos.filter(p => 
    p.numeroProcesso.toLowerCase().includes(filtroCnj.toLowerCase()) ||
    (p.assunto ?? '').toLowerCase().includes(filtroCnj.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Processos Judiciais e Ações Civis</h1>
          <p className="text-slate-600 text-sm">Gestão de embargos, ações civis públicas e vínculos N:N com bens patrimoniais</p>
        </div>
        <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-sm shadow">
          + Novo Processo Judicial
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Buscar por número CNJ ou objeto do processo..."
          value={filtroCnj}
          onChange={(e) => setFiltroCnj(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Carregando processos judiciais...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Número do processo</th>
                <th className="p-4">Assunto</th>
                <th className="p-4">Tribunal / Vara</th>
                <th className="p-4">Fase Processual</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Nenhum processo judicial cadastrado.
                  </td>
                </tr>
              ) : (
                processosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-medium text-slate-800">{p.numeroProcesso}</td>
                    <td className="p-4">{p.assunto ?? '—'}</td>
                    <td className="p-4">{p.tribunal} ({p.varaComarca ?? '—'})</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {p.fase}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedProcesso(p)}
                        className="text-emerald-700 hover:text-emerald-900 font-medium text-xs underline"
                      >
                        Ver Detalhes / Bens N:N
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

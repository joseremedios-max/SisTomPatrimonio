import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { PageDTO } from '../../types/dtos';

interface LogAuditoria {
  id: number;
  usuarioId: string;
  ocorridoEm: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  dadosAnteriores: Record<string, unknown> | null;
  dadosNovos: Record<string, unknown> | null;
  origem: string;
  correlationId: string;
}

export const AuditoriaPage: React.FC = () => {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLogs();
  }, []);

  const carregarLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<PageDTO<LogAuditoria>>('/v1/auditorias');
      setLogs(res.data.content);
    } catch (err) {
      console.error('Erro ao carregar trilha de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel de Auditoria e Rastreabilidade</h1>
        <p className="text-slate-600 text-sm">Trilha imutável pós-commit com rastreamento por correlation_id e snapshots JSONB</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Carregando trilha de auditoria...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Entidade Afetada</th>
                <th className="p-4">Origem / IP</th>
                <th className="p-4">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-xs">
                    <td className="p-4 font-sans text-slate-800">{new Date(log.ocorridoEm).toLocaleString('pt-BR')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        log.acao === 'INSERT' ? 'bg-emerald-100 text-emerald-800' :
                        log.acao === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.acao}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-slate-700">{log.entidade} ({log.entidadeId?.substring(0, 8)}...)</td>
                    <td className="p-4 text-slate-500">{log.origem || '127.0.0.1'}</td>
                    <td className="p-4 text-slate-400 truncate max-w-[150px]">{log.correlationId}</td>
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

import React, { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useVistoria, type Patologia } from '../../hooks/useVistoria';
import { FileUploadZone } from '../../components/forms/FileUploadZone';
import api from '../../services/api';
import type { BemCulturalDTO, DocumentoDTO, PageDTO } from '../../types/dtos';
import {
  enfileirarLaudoOffline,
  listarLaudosOfflinePendentes,
  removerLaudoOffline,
  type OfflineLaudoRecord,
} from '../../utils/offlineDb';

export const VistoriasPage: React.FC = () => {
  const { vistorias, loading, error, listarVistorias, agendarVistoria, registrarLaudo } = useVistoria();
  const [selectedVistoriaId, setSelectedVistoriaId] = useState<string | null>(null);
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);

  // Estado para agendar nova vistoria
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novoBemId, setNovoBemId] = useState('');
  const [novoNivelRisco, setNovoNivelRisco] = useState<'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'>('MEDIO');

  // Estado para laudo técnico
  const [resumo, setResumo] = useState('');
  const [recomendacao, setRecomendacao] = useState('');
  const [patologias, setPatologias] = useState<Patologia[]>([]);
  const [novaPatologia, setNovaPatologia] = useState<Patologia>({
    tipo: '',
    severidade: 'MEDIA',
    descricao: '',
  });
  const [documentosAnexados, setDocumentosAnexados] = useState<DocumentoDTO[]>([]);
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [laudosOffline, setLaudosOffline] = useState<OfflineLaudoRecord[]>([]);
  const [mensagemOperacao, setMensagemOperacao] = useState<string | null>(null);

  const atualizarFilaOffline = useCallback(async () => {
    const pendentes = await listarLaudosOfflinePendentes();
    setLaudosOffline(pendentes);
  }, []);

  const sincronizarLaudosPendentes = useCallback(async () => {
    const pendentes = await listarLaudosOfflinePendentes();
    if (pendentes.length === 0) return;

    let sincronizados = 0;
    for (const item of pendentes) {
      try {
        await registrarLaudo(item.vistoriaId, item.patologias, item.resumo, item.recomendacao);
        await removerLaudoOffline(item.id);
        sincronizados += 1;
      } catch {
        // Permanece na fila para próxima tentativa
      }
    }

    await atualizarFilaOffline();
    if (sincronizados > 0) {
      setMensagemOperacao(`${sincronizados} laudo(s) offline sincronizado(s) com o servidor.`);
    }
  }, [atualizarFilaOffline, registrarLaudo]);

  useEffect(() => {
    void listarVistorias();
    void atualizarFilaOffline();
    api
      .get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais')
      .then((res) => {
        setBens(res.data.content);
        if (res.data.content.length > 0 && res.data.content[0].id) {
          setNovoBemId(res.data.content[0].id);
        }
      })
      .catch(() => undefined);
  }, [listarVistorias, atualizarFilaOffline]);

  useEffect(() => {
    const aoFicarOnline = () => {
      setOnline(true);
      void sincronizarLaudosPendentes();
    };
    const aoFicarOffline = () => setOnline(false);

    window.addEventListener('online', aoFicarOnline);
    window.addEventListener('offline', aoFicarOffline);
    return () => {
      window.removeEventListener('online', aoFicarOnline);
      window.removeEventListener('offline', aoFicarOffline);
    };
  }, [sincronizarLaudosPendentes]);

  const handleAgendarVistoria = async (event: FormEvent) => {
    event.preventDefault();
    if (!novoCodigo.trim() || !novoBemId) return;
    try {
      await agendarVistoria({
        codigo: novoCodigo.trim(),
        bemId: novoBemId,
        nivelRisco: novoNivelRisco,
        situacaoConservacao: 'REGULAR',
        agendadaEm: new Date().toISOString(),
      });
      setNovoCodigo('');
      setMensagemOperacao('Nova vistoria técnica agendada com sucesso!');
    } catch (err) {
      setMensagemOperacao((err as Error).message);
    }
  };

  const handleAddPatologia = () => {
    if (!novaPatologia.tipo || !novaPatologia.descricao) return;
    setPatologias([...patologias, novaPatologia]);
    setNovaPatologia({ tipo: '', severidade: 'MEDIA', descricao: '' });
  };

  const limparFormulario = () => {
    setSelectedVistoriaId(null);
    setPatologias([]);
    setResumo('');
    setRecomendacao('');
  };

  const handleSalvarLaudo = async () => {
    if (!selectedVistoriaId) return;

    if (!online) {
      await enfileirarLaudoOffline({
        vistoriaId: selectedVistoriaId,
        patologias,
        resumo,
        recomendacao,
      });
      await atualizarFilaOffline();
      setMensagemOperacao(
        'Modo Offline (PWA): Laudo armazenado no dispositivo (IndexedDB) para sincronização automática.',
      );
      limparFormulario();
      return;
    }

    try {
      await registrarLaudo(selectedVistoriaId, patologias, resumo, recomendacao);
      setMensagemOperacao('Laudo de vistoria registrado com sucesso!');
      limparFormulario();
    } catch {
      await enfileirarLaudoOffline({
        vistoriaId: selectedVistoriaId,
        patologias,
        resumo,
        recomendacao,
      });
      await atualizarFilaOffline();
      setMensagemOperacao(
        'Sem conexão com o servidor: Laudo salvo localmente (IndexedDB) para envio posterior.',
      );
      limparFormulario();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Vistorias Técnicas e Fiscalização</h1>
          <p className="text-sm text-gray-600">
            Inspeções prediais, detecção de patologias e laudos de preservação (com suporte PWA Offline)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              online ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {online ? 'Online' : 'Modo Campo Offline (PWA)'}
          </span>
          {laudosOffline.length > 0 && (
            <button
              type="button"
              onClick={() => void sincronizarLaudosPendentes()}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded hover:bg-amber-700"
            >
              Sincronizar ({laudosOffline.length}) pendente(s)
            </button>
          )}
        </div>
      </div>

      {mensagemOperacao && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
          {mensagemOperacao}
        </div>
      )}
      {loading && <div className="text-center py-4 text-gray-500">Carregando vistorias...</div>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Formulário rápido para Agendar Nova Vistoria */}
      <form
        onSubmit={handleAgendarVistoria}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Código da Vistoria</label>
          <input
            type="text"
            required
            placeholder="Ex: VIS-2026-005"
            value={novoCodigo}
            onChange={(e) => setNovoCodigo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Bem Cultural</label>
          <select
            required
            value={novoBemId}
            onChange={(e) => setNovoBemId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          >
            {bens.map((b) => (
              <option key={b.id} value={b.id}>
                {b.codigo} — {b.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nível de Risco Preliminar</label>
          <select
            value={novoNivelRisco}
            onChange={(e) => setNovoNivelRisco(e.target.value as 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO')}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="BAIXO">BAIXO</option>
            <option value="MEDIO">MÉDIO</option>
            <option value="ALTO">ALTO</option>
            <option value="CRITICO">CRÍTICO</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-800 text-white text-sm font-semibold rounded hover:bg-emerald-900"
        >
          + Agendar Vistoria
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Vistorias */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Vistorias Agendadas / Realizadas</h2>
          <div className="divide-y divide-gray-100">
            {vistorias.map((v) => (
              <div key={v.id} className="py-3 flex justify-between items-center gap-2">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 mr-2">
                    {v.codigo}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{v.status}</span>
                  {v.nivelRisco && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Risco: {v.nivelRisco}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Agendada: {v.agendadaEm ? new Date(v.agendadaEm).toLocaleDateString('pt-BR') : 'A definir'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVistoriaId(v.id ?? null)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                >
                  Preencher Laudo
                </button>
              </div>
            ))}
            {vistorias.length === 0 && (
              <p className="text-sm text-gray-500 py-4">Nenhuma vistoria cadastrada.</p>
            )}
          </div>
        </div>

        {/* Formulário de Registro de Laudo e Patologias */}
        {selectedVistoriaId ? (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Preenchimento de Laudo Técnico</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Resumo da Inspeção</label>
              <textarea
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded text-sm focus:ring-blue-500"
                rows={2}
                placeholder="Descreva o estado geral da estrutura..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Recomendação Técnica</label>
              <textarea
                value={recomendacao}
                onChange={(e) => setRecomendacao(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded text-sm focus:ring-blue-500"
                rows={2}
                placeholder="Medidas de escoramento, conservação ou restauro recomendadas..."
              />
            </div>

            {/* Inclusão Dinâmica do Vetor de Patologias */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Registo de Anomalias / Patologias (JSON)</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tipo (ex: Rachadura, Umidade)"
                  value={novaPatologia.tipo}
                  onChange={(e) => setNovaPatologia({ ...novaPatologia, tipo: e.target.value })}
                  className="p-1.5 border rounded text-xs"
                />
                <select
                  value={novaPatologia.severidade}
                  onChange={(e) =>
                    setNovaPatologia({
                      ...novaPatologia,
                      severidade: e.target.value as Patologia['severidade'],
                    })
                  }
                  className="p-1.5 border rounded text-xs"
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Descrição detalhada da patologia"
                value={novaPatologia.descricao}
                onChange={(e) => setNovaPatologia({ ...novaPatologia, descricao: e.target.value })}
                className="w-full p-1.5 border rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddPatologia}
                className="w-full py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
              >
                + Adicionar Patologia ao Laudo
              </button>

              {patologias.length > 0 && (
                <ul className="divide-y divide-gray-200 text-xs">
                  {patologias.map((p, idx) => (
                    <li key={idx} className="py-1.5 flex justify-between">
                      <span>
                        <strong>{p.tipo}</strong> ({p.severidade}): {p.descricao}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Upload de Fotos e Relatórios (Zero Bytea) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Anexo de Fotos / Laudo Assinado
              </label>
              <FileUploadZone
                vistoriaId={selectedVistoriaId}
                categoria="RELATORIO_VISTORIA"
                onUploadSuccess={(doc) => setDocumentosAnexados([...documentosAnexados, doc])}
              />
              {documentosAnexados.length > 0 && (
                <div className="mt-2 text-xs text-green-700">
                  {documentosAnexados.length} documento(s) anexado(s) com sucesso.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVistoriaId(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleSalvarLaudo()}
                className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
              >
                {online ? 'Registrar Laudo' : 'Salvar Laudo Offline'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 flex items-center justify-center text-gray-400 text-sm">
            Selecione uma vistoria ao lado para preencher o laudo técnico e anexar fotos.
          </div>
        )}
      </div>
    </div>
  );
};

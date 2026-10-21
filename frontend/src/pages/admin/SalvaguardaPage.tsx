import { useEffect, useState, type FormEvent } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import type { BemCulturalDTO, PageDTO, SalvaguardaDTO } from '../../types/dtos';

export const SalvaguardaPage = () => {
  const { usuario } = useAuth();
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  const [bemId, setBemId] = useState('');
  const [planos, setPlanos] = useState<SalvaguardaDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [planoAcao, setPlanoAcao] = useState('');
  const [status, setStatus] = useState<'PLANEJADO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO'>('PLANEJADO');
  const [dataInicio, setDataInicio] = useState('2026-10-21');
  const [dataPrevisaoFim, setDataPrevisaoFim] = useState('2027-12-31');

  const carregarPlanos = async (idAlvo: string) => {
    if (!idAlvo) return;
    setCarregando(true);
    setErro(null);
    try {
      const response = await api.get<SalvaguardaDTO[]>(`/v1/salvaguardas/bem/${idAlvo.trim()}`);
      setPlanos(response.data);
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    api
      .get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais', { params: { size: 100 } })
      .then((r) => {
        setBens(r.data.content);
        const bemImaterial = r.data.content.find((b) => b.natureza === 'IMATERIAL');
        const idInicial = bemImaterial?.id || r.data.content[0]?.id || '';
        if (idInicial) {
          setBemId(idInicial);
        }
      })
      .catch((e: Error) => setErro(e.message));
  }, []);

  useEffect(() => {
    if (bemId) {
      void carregarPlanos(bemId);
    }
  }, [bemId]);

  const consultar = async (event: FormEvent) => {
    event.preventDefault();
    await carregarPlanos(bemId);
  };

  const criarPlano = async (event: FormEvent) => {
    event.preventDefault();
    if (!bemId) return;
    setSalvando(true);
    setErro(null);
    setSucesso(null);
    try {
      await api.post('/v1/salvaguardas', {
        bemCulturalId: bemId.trim(),
        planoAcao: planoAcao.trim(),
        status,
        dataInicio: dataInicio || undefined,
        dataPrevisaoFim: dataPrevisaoFim || undefined,
        responsavelId: usuario?.id,
      });
      setSucesso('Plano de salvaguarda cadastrado com sucesso.');
      setPlanoAcao('');
      await carregarPlanos(bemId);
    } catch (error) {
      setErro((error as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  const bemSelecionado = bens.find((b) => b.id === bemId);

  return (
    <PageShell title="Planos de salvaguarda">
      {erro && <p className="mb-4 rounded bg-red-50 p-3 text-sm font-medium text-red-700">{erro}</p>}
      {sucesso && <p className="mb-4 rounded bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{sucesso}</p>}

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="seletor-bem-salvaguarda" className="block text-sm font-semibold text-slate-800">
            Selecionar Bem Cultural (Regra RN02: Exclusivo para Bens Imateriais)
          </label>
          {bemSelecionado && (
            <span
              className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                bemSelecionado.natureza === 'IMATERIAL'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Natureza: {bemSelecionado.natureza}
            </span>
          )}
        </div>
        <form onSubmit={consultar} className="flex flex-wrap gap-2">
          <select
            id="seletor-bem-salvaguarda"
            className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            value={bemId}
            onChange={(e) => setBemId(e.target.value)}
          >
            {bens.map((bem) => (
              <option key={bem.id} value={bem.id}>
                {bem.codigo} — {bem.nome} [{bem.natureza}]
              </option>
            ))}
          </select>
          <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900" type="submit">
            Atualizar Consulta
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={criarPlano} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Cadastrar Novo Plano de Salvaguarda</h2>
          <p className="text-xs text-slate-600">
            Vincule metas de preservação, oficinas de transmissão de saberes e apoio aos mestres e comunidades detentoras.
          </p>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Plano de Ação e Metas *</label>
            <textarea
              value={planoAcao}
              onChange={(e) => setPlanoAcao(e.target.value)}
              required
              className="min-h-28 w-full rounded border border-slate-300 p-3 text-sm"
              placeholder="Descreva as ações de salvaguarda, oficinas, inventário participativo e metas..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PLANEJADO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO')}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm"
              >
                <option value="PLANEJADO">PLANEJADO</option>
                <option value="ATIVO">ATIVO</option>
                <option value="CONCLUIDO">CONCLUIDO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Início da Vigência</label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Previsão de Fim</label>
              <Input type="date" value={dataPrevisaoFim} onChange={(e) => setDataPrevisaoFim(e.target.value)} />
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Registrar Plano de Salvaguarda'}
          </button>
        </form>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Planos de Salvaguarda Vinculados ({planos.length})
          </h2>
          {carregando && <p className="text-sm text-slate-500">Carregando planos...</p>}
          {!carregando && planos.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Nenhum plano de salvaguarda encontrado para este bem.
            </p>
          )}
          <div className="space-y-3">
            {planos.map((plano) => (
              <article key={plano.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {plano.status}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{plano.id}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{plano.planoAcao}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>Início: {plano.dataInicio ?? 'Não informado'}</span>
                  <span>Previsão de término: {plano.dataPrevisaoFim ?? 'Não informada'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
};

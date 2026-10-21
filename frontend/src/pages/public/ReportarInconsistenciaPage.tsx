import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface BemPublicoItem {
  id: string;
  codigo?: string;
  nome?: string;
  titulo?: string;
}

interface RelatoInconsistenciaItem {
  id: string;
  bemId: string;
  bemCodigo: string;
  bemNome: string;
  contato: string;
  descricao: string;
  status: string;
  criadoEm: string;
}

export default function ReportarInconsistenciaPage() {
  const { usuario } = useAuth();
  const [bemId, setBemId] = useState('');
  const [contato, setContato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bens, setBens] = useState<BemPublicoItem[]>([]);
  const [relatos, setRelatos] = useState<RelatoInconsistenciaItem[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const podeTriar = usuario?.perfil === 'ADMIN' || usuario?.perfil === 'TECNICO';

  const carregarDados = async () => {
    try {
      const [resBens, resRelatos] = await Promise.all([
        api.get('/v1/bens-culturais/publicos').catch(() => ({ data: [] })),
        api.get('/v1/cadastros/relatos-inconsistencia').catch(() => ({ data: [] })),
      ]);
      const listaBens = Array.isArray(resBens.data)
        ? resBens.data
        : Array.isArray(resBens.data?.content)
          ? resBens.data.content
          : [];
      setBens(listaBens);
      setRelatos(Array.isArray(resRelatos.data) ? resRelatos.data : []);
    } catch {
      // Ignora falha silenciosa de listagem inicial
    }
  };

  useEffect(() => {
    void carregarDados();
  }, []);

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setEnviado(false);
    setProtocoloGerado(null);
    try {
      const res = await api.post('/v1/cadastros/relatos-inconsistencia', {
        bemId: bemId.trim(),
        contato: contato.trim(),
        descricao: descricao.trim(),
      });
      setEnviado(true);
      if (res.data?.id) {
        setProtocoloGerado(String(res.data.id));
      }
      setBemId('');
      setContato('');
      setDescricao('');
      await carregarDados();
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  const alterarStatus = async (id: string, novoStatus: string) => {
    try {
      await api.patch(`/v1/cadastros/relatos-inconsistencia/${id}/status`, null, {
        params: { status: novoStatus },
      });
      await carregarDados();
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  return (
    <PageShell title="Reportar inconsistência">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={enviar} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Novo Relato Cidadão / Técnico</h2>
          <p className="text-xs text-slate-600">
            Informe divergências cadastrais, coordenadas imprecisas ou riscos à integridade física de um bem cultural.
          </p>

          {bens.length > 0 && (
            <div>
              <label htmlFor="seletor-bem" className="mb-1 block text-sm font-semibold text-slate-800">
                Selecionar Bem Cultural do Acervo (opcional)
              </label>
              <select
                id="seletor-bem"
                value={bemId}
                onChange={(e) => setBemId(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="">-- Escolha um bem cultural ou digite abaixo --</option>
                {bens.map((b) => (
                  <option key={b.id} value={b.codigo || b.id}>
                    {b.codigo ? `${b.codigo} — ` : ''}
                    {b.nome || b.titulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="relato-bem-id" className="mb-1 block text-sm font-semibold text-slate-800">
              Identificador (UUID) ou código do bem cultural
            </label>
            <Input
              id="relato-bem-id"
              name="bemId"
              value={bemId}
              onChange={(e) => setBemId(e.target.value)}
              required
              placeholder="Ex.: SIPMA-MA-0001 ou UUID do bem cultural"
            />
          </div>

          <div>
            <label htmlFor="relato-contato" className="mb-1 block text-sm font-semibold text-slate-800">
              E-mail para contato e retorno institucional
            </label>
            <Input
              id="relato-contato"
              name="contato"
              type="email"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              required
              placeholder="Seu e-mail"
            />
          </div>

          <div>
            <label htmlFor="relato-descricao" className="mb-1 block text-sm font-semibold text-slate-800">
              Descrição da divergência ou risco observado
            </label>
            <textarea
              id="relato-descricao"
              name="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="min-h-32 w-full rounded border border-slate-300 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="Descreva a divergência cadastral ou risco constatado no imóvel/manifestação..."
            />
          </div>

          <button
            className="rounded bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
            type="submit"
          >
            Enviar relato
          </button>

          {enviado && (
            <div role="status" aria-live="polite" className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-semibold">Relato enviado com sucesso.</p>
              {protocoloGerado && (
                <p className="mt-1 font-mono text-xs">Protocolo registrado: {protocoloGerado}</p>
              )}
            </div>
          )}
          {erro && (
            <p role="alert" className="rounded bg-red-50 p-3 text-sm font-medium text-red-800">
              {erro}
            </p>
          )}
        </form>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Protocolos Registrados ({relatos.length})
            </h2>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Ouvidoria / Triagem Técnica
            </span>
          </div>

          {relatos.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum relato de inconsistência registrado até o momento.</p>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {relatos.map((r) => (
                <article key={r.id} className="rounded border border-slate-200 p-4 text-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-800">{r.bemCodigo}</span>
                      <h3 className="font-semibold text-slate-900">{r.bemNome}</h3>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        r.status === 'RESOLVIDO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'EM_ANALISE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-slate-700">{r.descricao}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                    <span>Contato: {r.contato}</span>
                    <span>{new Date(r.criadoEm).toLocaleString('pt-BR')}</span>
                  </div>
                  {podeTriar && (
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => void alterarStatus(r.id, 'EM_ANALISE')}
                        className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                      >
                        Marcar Em Análise
                      </button>
                      <button
                        type="button"
                        onClick={() => void alterarStatus(r.id, 'RESOLVIDO')}
                        className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                      >
                        Marcar Resolvido
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import type { BemCulturalDTO, PageDTO } from '../../types/dtos';

type Protecao = {
  id: string;
  bemId?: string;
  bemNome: string;
  numeroProcesso: string;
  esfera?: string;
  fase?: string;
  tipoProtecao?: string;
  vigente?: boolean;
  dataAbertura?: string;
  criadoEm?: string;
};

export default function ProtecaoPage() {
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  const [bemId, setBemId] = useState('');
  const [protecao, setProtecao] = useState<Protecao[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [esfera, setEsfera] = useState('ESTADUAL');
  const [tipoProtecao, setTipoProtecao] = useState('TOMBAMENTO');
  const [fase, setFase] = useState('EM_INSTRUCAO');
  const [dataAbertura, setDataAbertura] = useState('2026-10-21');
  const [atoNormativo, setAtoNormativo] = useState('');
  const [livroTombo, setLivroTombo] = useState('');
  const [numeroInscricao, setNumeroInscricao] = useState('');
  const [observacao, setObservacao] = useState('');

  const carregarProtecoes = async (idAlvo: string) => {
    if (!idAlvo) return;
    try {
      const r = await api.get<Protecao[]>(`/v1/protecoes/bem/${idAlvo}`);
      setProtecao(r.data);
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  useEffect(() => {
    api
      .get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais', { params: { size: 100 } })
      .then((r) => {
        setBens(r.data.content);
        if (r.data.content[0]?.id) {
          setBemId(r.data.content[0].id);
        }
      })
      .catch((e: Error) => setErro(e.message));
  }, []);

  useEffect(() => {
    void carregarProtecoes(bemId);
  }, [bemId]);

  const cadastrarProtecao = async (event: FormEvent) => {
    event.preventDefault();
    if (!bemId) return;
    setSalvando(true);
    setErro(null);
    setSucesso(null);
    try {
      await api.post('/v1/protecoes', {
        bemId,
        numeroProcesso: numeroProcesso.trim(),
        esfera,
        tipoProtecao,
        fase,
        dataAbertura: dataAbertura || undefined,
        atoNormativo: atoNormativo.trim() || undefined,
        livroTombo: livroTombo.trim() || undefined,
        numeroInscricao: numeroInscricao.trim() || undefined,
        observacao: observacao.trim() || undefined,
      });
      setSucesso('Processo de tombamento/proteção registrado com sucesso.');
      setNumeroProcesso('');
      setAtoNormativo('');
      setLivroTombo('');
      setNumeroInscricao('');
      setObservacao('');
      await carregarProtecoes(bemId);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <PageShell title="Tombamento e proteção">
      {erro && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
      {sucesso && <p className="mb-4 rounded bg-emerald-50 p-3 text-sm text-emerald-800">{sucesso}</p>}

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="seletor-bem-protecao" className="block text-sm font-semibold text-slate-800">
          Selecionar Bem Cultural
        </label>
        <select
          id="seletor-bem-protecao"
          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          value={bemId}
          onChange={(e) => setBemId(e.target.value)}
        >
          {bens.map((bem) => (
            <option key={bem.id} value={bem.id}>
              {bem.codigo} — {bem.nome} ({bem.natureza})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={cadastrarProtecao} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Registrar Ato ou Processo de Proteção</h2>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Número do Processo Administrativo *</label>
            <Input
              value={numeroProcesso}
              onChange={(e) => setNumeroProcesso(e.target.value)}
              placeholder="Ex.: PROC-TOMB-2026/00310-SECMA"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Esfera</label>
              <select
                value={esfera}
                onChange={(e) => setEsfera(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm"
              >
                <option value="ESTADUAL">ESTADUAL</option>
                <option value="FEDERAL">FEDERAL</option>
                <option value="MUNICIPAL">MUNICIPAL</option>
                <option value="INTERNACIONAL">INTERNACIONAL</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Tipo de Proteção</label>
              <select
                value={tipoProtecao}
                onChange={(e) => setTipoProtecao(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm"
              >
                <option value="TOMBAMENTO">TOMBAMENTO</option>
                <option value="REGISTRO">REGISTRO</option>
                <option value="VALORACAO">VALORACAO</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Fase Processual</label>
              <select
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm"
              >
                <option value="EM_ESTUDO">EM_ESTUDO</option>
                <option value="EM_INSTRUCAO">EM_INSTRUCAO</option>
                <option value="PROVISORIO">PROVISORIO</option>
                <option value="HOMOLOGADO">HOMOLOGADO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Data de Abertura</label>
              <Input type="date" value={dataAbertura} onChange={(e) => setDataAbertura(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Ato Normativo (Decreto/Portaria)</label>
              <Input
                value={atoNormativo}
                onChange={(e) => setAtoNormativo(e.target.value)}
                placeholder="Ex.: Decreto Estadual nº 39.812/2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Livro do Tombo / Registro</label>
              <Input
                value={livroTombo}
                onChange={(e) => setLivroTombo(e.target.value)}
                placeholder="Ex.: Livro do Tombo Histórico"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Nº de Inscrição</label>
              <Input
                value={numeroInscricao}
                onChange={(e) => setNumeroInscricao(e.target.value)}
                placeholder="Ex.: INS-MA-0090"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Observações Técnicas</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="min-h-20 w-full rounded border border-slate-300 p-2.5 text-sm"
              placeholder="Parecer resumido ou delimitação da poligonal de entorno..."
            />
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {salvando ? 'Registrando...' : 'Registrar Proteção'}
          </button>
        </form>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Processos Vinculados ao Bem ({protecao.length})
          </h2>
          {protecao.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Nenhum processo de proteção registrado para este bem.
            </p>
          ) : (
            <div className="space-y-3">
              {protecao.map((item) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-2" key={item.id}>
                  <div className="flex items-center justify-between">
                    <strong className="font-mono text-sm text-emerald-900">{item.numeroProcesso}</strong>
                    <span
                      className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                        item.fase === 'HOMOLOGADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.fase ?? 'EM_ANALISE'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.tipoProtecao ?? 'TOMBAMENTO'} · Esfera {item.esfera ?? 'ESTADUAL'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span>Status Legal: {item.vigente ? 'Vigente' : 'Não vigente'}</span>
                    {item.dataAbertura && <span>Abertura: {item.dataAbertura}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

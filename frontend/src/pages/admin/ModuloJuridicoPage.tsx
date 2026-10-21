import { useEffect, useState, type FormEvent } from 'react';
import PageShell from '../PageShell';
import { Input } from '../../components/ui/Input';
import api from '../../services/api';
import type {
  BemCulturalDTO,
  MovimentacaoJudicialDTO,
  PageDTO,
  ProcessoBemDTO,
  ProcessoJudicialDTO,
} from '../../types/dtos';

export default function ModuloJuridicoPage() {
  const [processos, setProcessos] = useState<ProcessoJudicialDTO[]>([]);
  const [bensDisponiveis, setBensDisponiveis] = useState<BemCulturalDTO[]>([]);
  const [processoId, setProcessoId] = useState('');
  const [bemId, setBemId] = useState('');
  const [vinculos, setVinculos] = useState<ProcessoBemDTO[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoJudicialDTO[]>([]);
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    dataMovimentacao: '',
    descricao: '',
    observacao: '',
  });
  const [novoProcesso, setNovoProcesso] = useState({
    numeroProcesso: '',
    tribunal: 'TJMA',
    varaComarca: 'Vara de Interesses Difusos e Coletivos de São Luís',
    fase: 'INICIAL',
    assunto: '',
  });
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregarProcessos = async () => {
    try {
      const response = await api.get<ProcessoJudicialDTO[]>('/v1/processos-judiciais');
      setProcessos(response.data);
      if (response.data.length > 0 && !processoId && response.data[0].id) {
        await selecionar(response.data[0].id);
      }
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  useEffect(() => {
    void carregarProcessos();
    api
      .get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais')
      .then((res) => {
        setBensDisponiveis(res.data.content);
        if (res.data.content.length > 0 && res.data.content[0].id) {
          setBemId(res.data.content[0].id);
        }
      })
      .catch(() => undefined);
  }, []);

  const selecionar = async (id: string | undefined) => {
    if (!id) return;
    setProcessoId(id);
    setErro(null);
    try {
      const [bensResponse, movimentacoesResponse] = await Promise.all([
        api.get<ProcessoBemDTO[]>(`/v1/processos-judiciais/${id}/bens`),
        api.get<MovimentacaoJudicialDTO[]>(`/v1/processos-judiciais/${id}/movimentacoes`),
      ]);
      setVinculos(bensResponse.data);
      setMovimentacoes(movimentacoesResponse.data);
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  const criarProcesso = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setSucesso(null);
    try {
      const { data } = await api.post<ProcessoJudicialDTO>('/v1/processos-judiciais', novoProcesso);
      setNovoProcesso({
        numeroProcesso: '',
        tribunal: 'TJMA',
        varaComarca: 'Vara de Interesses Difusos e Coletivos de São Luís',
        fase: 'INICIAL',
        assunto: '',
      });
      setSucesso(`Processo ${data.numeroProcesso} cadastrado com sucesso!`);
      await carregarProcessos();
      if (data.id) {
        await selecionar(data.id);
      }
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  const vincular = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    try {
      await api.post(`/v1/processos-judiciais/${processoId}/bens`, { bemId: bemId.trim() });
      await selecionar(processoId);
      setSucesso('Bem cultural vinculado ao processo com sucesso!');
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  const registrarMovimentacao = async (event: FormEvent) => {
    event.preventDefault();
    if (!processoId) return;
    setErro(null);
    try {
      await api.post(`/v1/processos-judiciais/${processoId}/movimentacoes`, novaMovimentacao);
      setNovaMovimentacao({ dataMovimentacao: '', descricao: '', observacao: '' });
      await selecionar(processoId);
      setSucesso('Movimentação processual registrada!');
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  const obterNomeBem = (id: string) => {
    const encontrado = bensDisponiveis.find((b) => b.id === id);
    return encontrado ? `${encontrado.codigo} — ${encontrado.nome}` : id;
  };

  return (
    <PageShell title="Módulo jurídico">
      {erro && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
      {sucesso && <p className="mb-4 rounded bg-emerald-50 p-3 text-sm text-emerald-800">{sucesso}</p>}

      {/* Cadastro Rápido de Processo Judicial */}
      <form
        onSubmit={criarProcesso}
        className="mb-6 rounded-lg bg-white p-5 shadow grid gap-3 md:grid-cols-5 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Número CNJ</label>
          <Input
            value={novoProcesso.numeroProcesso}
            onChange={(e) => setNovoProcesso({ ...novoProcesso, numeroProcesso: e.target.value })}
            placeholder="0801234-55.2026.8.10.0001"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tribunal</label>
          <Input
            value={novoProcesso.tribunal}
            onChange={(e) => setNovoProcesso({ ...novoProcesso, tribunal: e.target.value })}
            placeholder="TJMA / TRF1"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Fase Processual</label>
          <select
            value={novoProcesso.fase}
            onChange={(e) => setNovoProcesso({ ...novoProcesso, fase: e.target.value })}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="INICIAL">INICIAL</option>
            <option value="INSTRUCAO">INSTRUÇÃO</option>
            <option value="RECURSO">RECURSO</option>
            <option value="TRANSITO_EM_JULGADO">TRÂNSITO EM JULGADO</option>
            <option value="EXECUCAO">EXECUÇÃO</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto / Objeto</label>
          <Input
            value={novoProcesso.assunto}
            onChange={(e) => setNovoProcesso({ ...novoProcesso, assunto: e.target.value })}
            placeholder="Ação Civil Pública de Preservação"
            required
          />
        </div>
        <button className="rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" type="submit">
          + Cadastrar Processo
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">Processos judiciais</h2>
          <ul className="space-y-2">
            {processos.map((processo) => (
              <li key={processo.id ?? processo.numeroProcesso}>
                <button
                  className={`w-full rounded border p-3 text-left transition ${
                    processo.id === processoId
                      ? 'border-emerald-700 bg-emerald-50'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => void selecionar(processo.id)}
                >
                  <strong>{processo.numeroProcesso}</strong>
                  <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                    {processo.fase}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {processo.assunto ?? processo.tribunal} ({processo.tribunal})
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {processos.length === 0 && <p className="text-slate-600">Nenhum processo encontrado.</p>}
        </section>

        <section className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">Bens vinculados (Relação N:N)</h2>
          {processoId ? (
            <>
              <form onSubmit={vincular} className="mb-4 flex gap-2">
                {bensDisponiveis.length > 0 ? (
                  <select
                    value={bemId}
                    onChange={(event) => setBemId(event.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {bensDisponiveis.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.codigo} — {b.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={bemId}
                    onChange={(event) => setBemId(event.target.value)}
                    placeholder="UUID do bem cultural"
                    required
                  />
                )}
                <button className="rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" type="submit">
                  Vincular
                </button>
              </form>
              <ul className="space-y-2">
                {vinculos.map((vinculo) => (
                  <li key={vinculo.bemId} className="rounded bg-slate-50 p-3 text-sm font-medium text-slate-800">
                    🏛️ {obterNomeBem(vinculo.bemId)}
                  </li>
                ))}
                {vinculos.length === 0 && (
                  <li className="text-sm text-slate-500">Nenhum bem vinculado a este processo.</li>
                )}
              </ul>

              <h2 className="mb-3 mt-6 text-lg font-semibold">Linha do Tempo de Movimentações</h2>
              <form onSubmit={registrarMovimentacao} className="mb-4 grid gap-2">
                <Input
                  type="date"
                  value={novaMovimentacao.dataMovimentacao}
                  onChange={(event) =>
                    setNovaMovimentacao({ ...novaMovimentacao, dataMovimentacao: event.target.value })
                  }
                  required
                />
                <Input
                  value={novaMovimentacao.descricao}
                  onChange={(event) =>
                    setNovaMovimentacao({ ...novaMovimentacao, descricao: event.target.value })
                  }
                  placeholder="Descrição da movimentação (ex: Liminar de embargo deferida)"
                  required
                />
                <Input
                  value={novaMovimentacao.observacao}
                  onChange={(event) =>
                    setNovaMovimentacao({ ...novaMovimentacao, observacao: event.target.value })
                  }
                  placeholder="Observação (opcional)"
                />
                <button className="rounded bg-emerald-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
                  Registrar movimentação
                </button>
              </form>
              <ol className="space-y-2">
                {movimentacoes.map((movimentacao) => (
                  <li
                    key={movimentacao.id ?? `${movimentacao.dataMovimentacao}-${movimentacao.descricao}`}
                    className="border-l-2 border-emerald-700 pl-3 text-sm"
                  >
                    <strong>{movimentacao.dataMovimentacao}</strong>
                    <p>{movimentacao.descricao}</p>
                    {movimentacao.observacao && <p className="text-slate-600">{movimentacao.observacao}</p>}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Selecione um processo judicial ao lado para gerenciar os bens vinculados e movimentações.
            </p>
          )}
        </section>
      </div>
    </PageShell>
  );
}

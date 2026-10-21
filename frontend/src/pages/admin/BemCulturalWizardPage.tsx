import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { NaturezaBem, ClassificacaoSeguranca, StatusBemCultural } from '../../types/dtos';
import type { BemCulturalDTO } from '../../types/dtos';
import { useBemCultural } from '../../hooks/useBemCultural';
import {
  carregarRascunhoWizard,
  limparRascunhoWizard,
  salvarRascunhoWizard,
} from '../../utils/offlineDb';

type CampoValor = string | number | boolean;
type DadosCadastro = Record<string, CampoValor>;

const etapas = [
  'Identificação',
  'Localização',
  'Características arquitetônicas',
  'Proteção e tombamento',
  'Situação jurídica',
  'Conservação e risco',
  'Vistorias',
  'Imagens e documentos',
  'Observações e histórico',
  'Revisão final',
];

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export const BemCulturalWizardPage = () => {
  const { salvar, loading, error } = useBemCultural();
  const [etapa, setEtapa] = useState(1);
  const [sucesso, setSucesso] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [natureza, setNatureza] = useState<NaturezaBem>(NaturezaBem.MATERIAL_EDIFICADO);
  const [classificacao, setClassificacao] = useState<ClassificacaoSeguranca>(ClassificacaoSeguranca.INTERNA);
  const [organizacaoResponsavelId, setOrganizacaoResponsavelId] = useState('');
  const [resumoPublico, setResumoPublico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dados, setDados] = useState<DadosCadastro>({});
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [ultimoSaveLocal, setUltimoSaveLocal] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    void carregarRascunhoWizard().then((draft) => {
      if (!ativo) return;
      if (draft) {
        setEtapa(draft.etapa || 1);
        setCodigo(draft.codigo || '');
        setNome(draft.nome || '');
        setNatureza(draft.natureza || NaturezaBem.MATERIAL_EDIFICADO);
        setClassificacao(draft.classificacao || ClassificacaoSeguranca.INTERNA);
        setOrganizacaoResponsavelId(draft.organizacaoResponsavelId || '');
        setResumoPublico(draft.resumoPublico || '');
        setDescricao(draft.descricao || '');
        setDados(draft.dados || {});
        setUltimoSaveLocal(draft.atualizadoEm);
      }
      setRascunhoCarregado(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!rascunhoCarregado || sucesso) return;
    const temConteudo =
      Boolean(codigo || nome || organizacaoResponsavelId || resumoPublico || descricao) ||
      Object.keys(dados).length > 0 ||
      etapa > 1;
    if (!temConteudo) return;

    const timer = window.setTimeout(() => {
      void salvarRascunhoWizard({
        etapa,
        codigo,
        nome,
        natureza,
        classificacao,
        organizacaoResponsavelId,
        resumoPublico,
        descricao,
        dados,
      }).then((salvo) => {
        setUltimoSaveLocal(salvo.atualizadoEm);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [
    rascunhoCarregado,
    sucesso,
    etapa,
    codigo,
    nome,
    natureza,
    classificacao,
    organizacaoResponsavelId,
    resumoPublico,
    descricao,
    dados,
  ]);

  const alterar = (campo: string, valor: CampoValor) =>
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
  const valor = (campo: string) => dados[campo] ?? '';
  const avancar = () => setEtapa((atual) => Math.min(atual + 1, etapas.length));
  const voltar = () => setEtapa((atual) => Math.max(atual - 1, 1));

  const reiniciar = () => {
    setSucesso(false);
    setEtapa(1);
    setCodigo('');
    setNome('');
    setOrganizacaoResponsavelId('');
    setResumoPublico('');
    setDescricao('');
    setDados({});
    setUltimoSaveLocal(null);
    void limparRascunhoWizard();
  };

  const enviar = async (event: FormEvent) => {
    event.preventDefault();
    const payload: BemCulturalDTO = {
      codigo,
      nome,
      natureza,
      resumoPublico,
      descricao,
      classificacao,
      status: StatusBemCultural.RASCUNHO,
      organizacaoResponsavelId,
      dadosEspecificos: dados,
    };
    await salvar(payload);
    await limparRascunhoWizard();
    setUltimoSaveLocal(null);
    setSucesso(true);
  };

  const texto = (campo: string, placeholder?: string) => (
    <input
      className="w-full rounded border border-slate-300 px-3 py-2"
      value={String(valor(campo))}
      placeholder={placeholder}
      onChange={(event) => alterar(campo, event.target.value)}
    />
  );

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-8 shadow-md">
      <div className="mb-6 border-b pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cadastro de Bem Cultural</h1>
            <p className="text-sm text-slate-500">
              Etapa {etapa} de {etapas.length} — {etapas[etapa - 1]}
            </p>
          </div>
          {ultimoSaveLocal && (
            <div className="flex items-center gap-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded">
              <span>Rascunho salvo localmente (IndexedDB)</span>
              <button
                type="button"
                onClick={reiniciar}
                className="font-semibold underline hover:text-emerald-950"
              >
                Limpar rascunho
              </button>
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1 md:grid-cols-10">
          {etapas.map((nomeEtapa, indice) => (
            <button
              key={nomeEtapa}
              type="button"
              title={nomeEtapa}
              aria-label={`Etapa ${indice + 1}: ${nomeEtapa}`}
              onClick={() => indice + 1 <= etapa && setEtapa(indice + 1)}
              className={`h-2 rounded ${indice + 1 <= etapa ? 'bg-emerald-700' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Atenção:</strong> {error}
        </div>
      )}
      {sucesso ? (
        <div className="rounded border border-green-200 bg-green-50 p-6 text-center">
          <h2 className="mb-2 text-lg font-bold text-green-800">Bem cultural cadastrado com sucesso</h2>
          <p className="text-sm text-green-700">O registro {codigo} foi salvo como rascunho.</p>
          <button onClick={reiniciar} className="mt-4 rounded bg-green-700 px-4 py-2 text-sm text-white">
            Cadastrar novo bem
          </button>
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-6">
          {etapa === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Código identificador">
                <input
                  required
                  className="w-full rounded border px-3 py-2"
                  value={codigo}
                  onChange={(event) => setCodigo(event.target.value)}
                />
              </Campo>
              <Campo label="Natureza patrimonial">
                <select
                  className="w-full rounded border bg-white px-3 py-2"
                  value={natureza}
                  onChange={(event) => {
                    setNatureza(event.target.value as NaturezaBem);
                    setDados({});
                  }}
                >
                  <option value={NaturezaBem.MATERIAL_EDIFICADO}>Material edificado</option>
                  <option value={NaturezaBem.IMATERIAL}>Imaterial</option>
                  <option value={NaturezaBem.ARQUEOLOGICO}>Arqueológico</option>
                </select>
              </Campo>
              <Campo label="Nome do bem">
                <input
                  required
                  className="w-full rounded border px-3 py-2"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />
              </Campo>
              <Campo label="Organização responsável (UUID)">
                <input
                  required
                  className="w-full rounded border px-3 py-2"
                  value={organizacaoResponsavelId}
                  onChange={(event) => setOrganizacaoResponsavelId(event.target.value)}
                />
              </Campo>
            </div>
          )}

          {etapa === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Município">{texto('municipioId', 'UUID do município')}</Campo>
              <Campo label="Endereço">{texto('endereco')}</Campo>
              <Campo label="Latitude">{texto('latitude')}</Campo>
              <Campo label="Longitude">{texto('longitude')}</Campo>
            </div>
          )}
          {etapa === 3 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Tipo / tipologia">{texto('tipologiaArquitetonica')}</Campo>
              <Campo label="Uso atual">{texto('usoAtual')}</Campo>
              <Campo label="Período ou datação">{texto('periodo')}</Campo>
              <Campo label="Descrição construtiva">{texto('descricaoConstrutiva')}</Campo>
            </div>
          )}
          {etapa === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Instrumento de proteção">{texto('instrumentoProtecao')}</Campo>
              <Campo label="Número do processo de tombamento">{texto('processoTombamento')}</Campo>
              <Campo label="Data de proteção">{texto('dataProtecao')}</Campo>
              <Campo label="Âmbito">{texto('ambitoProtecao')}</Campo>
            </div>
          )}
          {etapa === 5 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Situação fundiária">{texto('situacaoFundiaria')}</Campo>
              <Campo label="Proprietário / detentor">{texto('proprietarioDetentor')}</Campo>
              <Campo label="Processo judicial relacionado">{texto('processoJudicialId')}</Campo>
              <Campo label="Observação jurídica">{texto('observacaoJuridica')}</Campo>
            </div>
          )}
          {etapa === 6 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Estado de conservação">{texto('situacaoConservacao')}</Campo>
              <Campo label="Nível de risco">
                <select
                  className="w-full rounded border bg-white px-3 py-2"
                  value={String(valor('nivelRisco'))}
                  onChange={(event) => alterar('nivelRisco', event.target.value)}
                >
                  <option value="">Selecione</option>
                  <option>BAIXO</option>
                  <option>MEDIO</option>
                  <option>ALTO</option>
                  <option>CRITICO</option>
                </select>
              </Campo>
              <Campo label="Ameaças identificadas">{texto('ameacas')}</Campo>
              <Campo label="Medidas emergenciais">{texto('medidasEmergenciais')}</Campo>
            </div>
          )}
          {etapa === 7 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Última vistoria">{texto('ultimaVistoria')}</Campo>
              <Campo label="Próxima vistoria">{texto('proximaVistoria')}</Campo>
              <Campo label="Responsável técnico">{texto('responsavelVistoria')}</Campo>
              <Campo label="Resumo da vistoria">{texto('resumoVistoria')}</Campo>
            </div>
          )}
          {etapa === 8 && (
            <div className="grid gap-4">
              <Campo label="Imagens (URLs ou chaves de armazenamento)">{texto('imagens')}</Campo>
              <Campo label="Documentos relacionados">{texto('documentos')}</Campo>
            </div>
          )}
          {etapa === 9 && (
            <div className="space-y-4">
              <Campo label="Resumo público">
                <textarea
                  rows={3}
                  className="w-full rounded border px-3 py-2"
                  value={resumoPublico}
                  onChange={(event) => setResumoPublico(event.target.value)}
                />
              </Campo>
              <Campo label="Descrição técnica">
                <textarea
                  rows={4}
                  className="w-full rounded border px-3 py-2"
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                />
              </Campo>
              <Campo label="Observações e histórico">{texto('observacoesHistorico')}</Campo>
            </div>
          )}
          {etapa === 10 && (
            <div className="space-y-4">
              <Campo label="Classificação de segurança">
                <select
                  className="w-full rounded border bg-white px-3 py-2"
                  value={classificacao}
                  onChange={(event) => setClassificacao(event.target.value as ClassificacaoSeguranca)}
                >
                  <option value={ClassificacaoSeguranca.PUBLICA}>Pública</option>
                  <option value={ClassificacaoSeguranca.INTERNA}>Interna</option>
                  <option value={ClassificacaoSeguranca.RESTRITA}>Restrita</option>
                  <option value={ClassificacaoSeguranca.SIGILOSA}>Sigilosa</option>
                </select>
              </Campo>
              <div className="rounded bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  <strong>{codigo}</strong> — {nome}
                </p>
                <p>Natureza: {natureza} · Status inicial: RASCUNHO</p>
                <p className="mt-2 break-words">Dados complementares: {JSON.stringify(dados)}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={voltar}
              disabled={etapa === 1}
              className="rounded border px-4 py-2 text-sm disabled:opacity-40"
            >
              Voltar
            </button>
            {etapa < etapas.length ? (
              <button
                type="button"
                onClick={avancar}
                className="rounded bg-emerald-700 px-5 py-2 text-sm font-semibold text-white"
              >
                Avançar
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-emerald-800 px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Finalizar e salvar'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

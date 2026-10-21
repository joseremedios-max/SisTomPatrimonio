import { useEffect, useState, type FormEvent } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import { FileUploadZone } from '../../components/forms/FileUploadZone';
import type { BemCulturalDTO, DocumentoDTO, PageDTO } from '../../types/dtos';

export default function DocumentosPage() {
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  const [bemId, setBemId] = useState('');
  const [documentos, setDocumentos] = useState<DocumentoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const carregarDocumentosDoBem = async (id: string) => {
    if (!id) return;
    try {
      const response = await api.get<DocumentoDTO[]>(`/v1/documentos/bem/${id.trim()}`);
      setDocumentos(response.data);
      setErro(null);
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  useEffect(() => {
    api
      .get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais')
      .then((res) => {
        setBens(res.data.content);
        if (res.data.content.length > 0 && res.data.content[0].id) {
          const primeiroId = res.data.content[0].id;
          setBemId(primeiroId);
          void carregarDocumentosDoBem(primeiroId);
        }
      })
      .catch((error: Error) => setErro(error.message));
  }, []);

  const consultar = async (event: FormEvent) => {
    event.preventDefault();
    await carregarDocumentosDoBem(bemId);
  };

  const baixar = async (doc: DocumentoDTO) => {
    if (!doc.id) return;
    try {
      const response = await api.get(`/v1/documentos/${doc.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.nomeArquivo || 'documento';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErro((error as Error).message);
    }
  };

  return (
    <PageShell title="Documentos e mídias">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <form onSubmit={consultar} className="rounded-lg bg-white p-5 shadow space-y-3">
            <label className="block text-sm font-semibold text-slate-800">
              Selecionar Bem Cultural para Consulta e Upload
            </label>
            <div className="flex gap-2">
              <select
                value={bemId}
                onChange={(event) => {
                  setBemId(event.target.value);
                  void carregarDocumentosDoBem(event.target.value);
                }}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {bens.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.codigo} — {b.nome}
                  </option>
                ))}
              </select>
              <button className="rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" type="submit">
                Atualizar
              </button>
            </div>
          </form>

          {bemId && (
            <div className="rounded-lg bg-white p-5 shadow space-y-3">
              <h2 className="text-base font-semibold text-slate-800">
                Enviar Novo Documento / Mídia (Cálculo SHA-256 + Varredura ClamAV)
              </h2>
              <FileUploadZone
                bemId={bemId}
                categoria="DECRETO_TOMBAMENTO"
                onUploadSuccess={(novoDoc) => {
                  setMensagem(`Documento "${novoDoc.titulo}" validado (SHA-256 + ClamAV) e armazenado!`);
                  void carregarDocumentosDoBem(bemId);
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-5 shadow space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Acervo Documental Vinculado ao Bem</h2>
          {erro && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
          {mensagem && <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{mensagem}</p>}

          <ul className="space-y-3">
            {documentos.map((documento) => (
              <li
                key={documento.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 bg-slate-50 p-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{documento.titulo}</p>
                  <p className="text-xs text-slate-600">
                    Arquivo: {documento.nomeArquivo} · Status:{' '}
                    <span className="font-semibold text-emerald-800">{documento.statusValidacao}</span>
                  </p>
                  {documento.sha256 && (
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      SHA-256: {documento.sha256.slice(0, 24)}...
                    </p>
                  )}
                </div>
                {documento.id && (
                  <button
                    className="rounded bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900"
                    onClick={() => void baixar(documento)}
                  >
                    Baixar arquivo
                  </button>
                )}
              </li>
            ))}
            {documentos.length === 0 && (
              <li className="text-sm text-slate-500 py-4">
                Nenhum documento anexado a este bem cultural ainda. Utilize a zona de upload ao lado para enviar.
              </li>
            )}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

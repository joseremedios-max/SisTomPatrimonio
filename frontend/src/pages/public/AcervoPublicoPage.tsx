import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../PageShell';
import { Input } from '../../components/ui/Input';
import { bemCulturalService } from '../../services/bemCulturalService';
import type { BemCulturalPublicoDTO, NaturezaBem } from '../../types/dtos';

export default function AcervoPublicoPage() {
  const [busca, setBusca] = useState('');
  const [natureza, setNatureza] = useState<NaturezaBem | ''>('');
  const [bens, setBens] = useState<BemCulturalPublicoDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      bemCulturalService
        .listarPublicos(busca, natureza || undefined)
        .then((page) => setBens(page.content))
        .catch((error: Error) => setErro(error.message));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [busca, natureza]);

  return (
    <PageShell title="Acervo público">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label htmlFor="busca-acervo-publico" className="mb-1 block text-sm font-semibold text-slate-800">
            Pesquisar bem cultural no acervo do Maranhão
          </label>
          <Input
            id="busca-acervo-publico"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome (ex.: Centro Histórico, Tambor, Bumba, Alcântara)..."
            aria-describedby="dica-busca-acervo"
          />
          <p id="dica-busca-acervo" className="mt-1 text-xs text-slate-600">
            Digite parte do nome do bem material, imaterial ou arqueológico.
          </p>
        </div>

        <div>
          <label htmlFor="filtro-natureza-acervo" className="mb-1 block text-sm font-semibold text-slate-800">
            Filtrar por Natureza
          </label>
          <select
            id="filtro-natureza-acervo"
            value={natureza}
            onChange={(e) => setNatureza(e.target.value as NaturezaBem | '')}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="">Todas as naturezas</option>
            <option value="MATERIAL_EDIFICADO">Patrimônio Material Edificado</option>
            <option value="IMATERIAL">Patrimônio Imaterial</option>
            <option value="ARQUEOLOGICO">Sítios Arqueológicos</option>
          </select>
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {erro}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2" aria-live="polite">
        {bens.map((bem) => (
          <article
            key={bem.id}
            className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  {bem.codigo} · {bem.natureza}
                </span>
                {bem.status && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900">
                    {bem.status}
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-xl font-bold text-emerald-950">{bem.nome}</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Município: {bem.municipioNome ?? 'Maranhão'}
              </p>
              {bem.resumoPublico && (
                <p className="mt-2 text-sm text-slate-700 line-clamp-2">{bem.resumoPublico}</p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/ficha/${bem.codigo || bem.id}`}
                className="inline-block text-sm font-semibold text-emerald-900 underline hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                Ver ficha pública completa →
              </Link>
            </div>
          </article>
        ))}
        {!erro && bens.length === 0 && (
          <p className="text-slate-700">Nenhum bem público encontrado para o filtro informado.</p>
        )}
      </div>
    </PageShell>
  );
}

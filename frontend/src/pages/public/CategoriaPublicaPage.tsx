import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../PageShell';
import { bemCulturalService } from '../../services/bemCulturalService';
import type { BemCulturalPublicoDTO, NaturezaBem } from '../../types/dtos';

export default function CategoriaPublicaPage({ natureza, titulo }: { natureza: NaturezaBem; titulo: string }) {
  const [bens, setBens] = useState<BemCulturalPublicoDTO[]>([]);

  useEffect(() => {
    bemCulturalService
      .listarPublicos('', natureza)
      .then((page) => setBens(page.content))
      .catch(() => setBens([]));
  }, [natureza]);

  return (
    <PageShell title={titulo}>
      <div className="grid gap-4 md:grid-cols-2">
        {bens.map((bem) => (
          <article className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={bem.id}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800">{bem.codigo}</span>
                {bem.status && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900">
                    {bem.status}
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{bem.nome}</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Município: {bem.municipioNome ?? 'Maranhão'}
              </p>
              {bem.resumoPublico && <p className="mt-2 text-sm text-slate-700">{bem.resumoPublico}</p>}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to={`/ficha/${bem.codigo || bem.id}`}
                className="text-sm font-semibold text-emerald-900 underline hover:text-emerald-700"
              >
                Ver ficha pública completa →
              </Link>
            </div>
          </article>
        ))}
        {bens.length === 0 && <p className="text-slate-600">Nenhum registro público encontrado.</p>}
      </div>
    </PageShell>
  );
}

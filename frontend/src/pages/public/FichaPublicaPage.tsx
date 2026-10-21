import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../PageShell';
import { bemCulturalService } from '../../services/bemCulturalService';
import type { BemCulturalPublicoDTO } from '../../types/dtos';

export default function FichaPublicaPage() {
  const { id } = useParams<{ id: string }>();
  const [bem, setBem] = useState<BemCulturalPublicoDTO | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setErro(null);
    bemCulturalService
      .buscarPublico(id)
      .then(setBem)
      .catch((error: Error) => setErro(error.message));
  }, [id]);

  return (
    <PageShell title="Ficha técnica do bem">
      {erro && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {erro}
        </p>
      )}
      {bem && (
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              {bem.natureza}
            </p>
            {bem.status && (
              <span className="rounded bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                Status Legal: {bem.status}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950">{bem.nome}</h2>
          <p className="mt-4 text-slate-800 leading-relaxed">
            {bem.descricao || bem.resumoPublico || 'Sem descrição pública.'}
          </p>
          <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-4 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Código de Tombo / Registro</dt>
              <dd className="font-mono">{bem.codigo}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Município</dt>
              <dd>{bem.municipioNome ?? 'Maranhão'}</dd>
            </div>
            {bem.latitude !== undefined && bem.longitude !== undefined && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-slate-900">
                  Coordenadas Públicas (SIRGAS 2000 / EPSG:4326)
                </dt>
                <dd className="font-mono text-xs text-slate-600">
                  Lat: {bem.latitude} | Lng: {bem.longitude}
                  {bem.natureza === 'ARQUEOLOGICO' && (
                    <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 font-sans text-xs font-semibold text-amber-900">
                      Coordenada generalizada (Proteção Arqueológica — Lei nº 3.924/1961)
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/acervo"
              className="inline-block rounded border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              ← Voltar ao acervo público
            </Link>
            <Link
              to="/reportar-inconsistencia"
              className="inline-block rounded bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              Reportar inconsistência deste bem
            </Link>
          </div>
        </article>
      )}
    </PageShell>
  );
}

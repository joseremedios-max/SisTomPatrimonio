import { useEffect, useState } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import type { BemCulturalDTO, PageDTO } from '../../types/dtos';

export default function RiscoPage() {
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  useEffect(() => {
    api.get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais')
      .then((response) => setBens(response.data.content))
      .catch(() => setBens([]));
  }, []);
  const emRisco = bens.filter((bem) => {
    const nivel = bem.dadosEspecificos && 'nivelRisco' in bem.dadosEspecificos
      ? bem.dadosEspecificos.nivelRisco : '';
    return ['ALTO', 'CRITICO'].includes(String(nivel));
  });
  return (
    <PageShell title="Imóveis em risco">
      <p className="mb-4 text-slate-600">Bens classificados com risco alto ou crítico.</p>
      {emRisco.length === 0 ? <p>Nenhum bem em risco alto ou crítico.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {emRisco.map((bem) => {
            const nivel = bem.dadosEspecificos && 'nivelRisco' in bem.dadosEspecificos
              ? bem.dadosEspecificos.nivelRisco : 'não informado';
            return <article className="rounded-lg border bg-white p-4 shadow" key={bem.id}>
              <h2 className="font-semibold">{bem.nome}</h2>
              <p className="text-sm text-red-700">Risco: {String(nivel)}</p>
            </article>;
          })}
        </div>
      )}
    </PageShell>
  );
}

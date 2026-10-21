import { useEffect, useState } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import type { BemCulturalDTO, PageDTO } from '../../types/dtos';

export default function BensPage() {
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    api.get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais', { params: { size: 100 } })
      .then((response) => setBens(response.data.content))
      .catch((error: Error) => setErro(error.message));
  }, []);
  return <PageShell title="Acervo cultural">
    {erro && <p className="mb-4 text-red-700">{erro}</p>}
    <div className="overflow-x-auto rounded-lg bg-white shadow"><table className="w-full text-left text-sm">
      <thead><tr className="border-b"><th className="p-3">Código</th><th className="p-3">Nome</th><th className="p-3">Natureza</th><th className="p-3">Status</th></tr></thead>
      <tbody>{bens.map((bem) => <tr className="border-b" key={bem.id}><td className="p-3 font-mono">{bem.codigo}</td><td className="p-3">{bem.nome}</td><td className="p-3">{bem.natureza}</td><td className="p-3">{bem.status}</td></tr>)}</tbody>
    </table></div>
  </PageShell>;
}

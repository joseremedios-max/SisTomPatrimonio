import { useEffect, useState } from 'react';
import type { BemCulturalDTO } from '../types/dtos';
import { bemCulturalService } from '../services/bemCulturalService';
export function useBemCultural() {
  const [data, setData] = useState<BemCulturalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bemCulturalService.listar()
      .then((page) => setData(page.content))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Falha ao carregar bens culturais.'))
      .finally(() => setLoading(false));
  }, []);

  const salvar = async (bem: BemCulturalDTO) => {
    setError(null);
    try {
      const salvo = await bemCulturalService.salvar(bem);
      setData((atual) => [...atual, salvo]);
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : 'Falha ao salvar bem cultural.';
      setError(mensagem);
      throw new Error(mensagem);
    }
  };

  return { data, loading, error, salvar };
}
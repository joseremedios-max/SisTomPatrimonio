import { useState, useCallback } from 'react';
import api from '../services/api';
import { StatusVistoria } from '../types/dtos';
import type { VistoriaDTO } from '../types/dtos';

export interface Patologia {
  tipo: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  descricao: string;
}

export function useVistoria() {
  const [vistorias, setVistorias] = useState<VistoriaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const listarVistorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<VistoriaDTO[]>('/v1/vistorias');
      setVistorias(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar vistorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorBem = useCallback(async (bemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<VistoriaDTO[]>(`/v1/vistorias/bem/${bemId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar vistorias do bem.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const agendarVistoria = async (dados: Partial<VistoriaDTO>) => {
    setLoading(true);
    try {
      const response = await api.post<VistoriaDTO>('/v1/vistorias', {
        ...dados,
        status: StatusVistoria.PLANEJADA,
        homologada: false
      });
      await listarVistorias();
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao agendar vistoria.');
    } finally {
      setLoading(false);
    }
  };

  const registrarLaudo = async (id: string, patologias: Patologia[], resumo: string, recomendacao: string) => {
    setLoading(true);
    try {
      const response = await api.post<VistoriaDTO>(`/v1/vistorias/${id}/laudo`, {
        patologias: { itens: patologias },
        resumo,
        recomendacao,
        realizadaEm: new Date().toISOString()
      });
      await listarVistorias();
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao registrar laudo técnico.');
    } finally {
      setLoading(false);
    }
  };

  return {
    vistorias,
    loading,
    error,
    listarVistorias,
    buscarPorBem,
    agendarVistoria,
    registrarLaudo
  };
}

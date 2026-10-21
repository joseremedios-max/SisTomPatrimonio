import { api } from './api';
import type { VistoriaDTO } from '../types/dtos';

export interface LaudoVistoriaPayload {
  patologias?: Record<string, unknown>;
  resumo: string;
  recomendacao: string;
}

export const vistoriaService = {
  async listar() {
    const response = await api.get<VistoriaDTO[]>('/v1/vistorias');
    return response.data;
  },
  async registrarLaudo(id: string, payload: LaudoVistoriaPayload) {
    const response = await api.post<VistoriaDTO>(`/v1/vistorias/${id}/laudo`, payload);
    return response.data;
  },
};
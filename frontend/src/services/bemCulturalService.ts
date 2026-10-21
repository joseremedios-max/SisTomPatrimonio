import { api } from './api';
import type {
  BemCulturalDTO,
  BemCulturalPublicoDTO,
  GeoJsonFeatureCollection,
  PageDTO,
  NaturezaBem,
} from '../types/dtos';

export const bemCulturalService = {
  async listar() {
    const response = await api.get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais');
    return response.data;
  },
  async salvar(bem: BemCulturalDTO) {
    const response = await api.post<BemCulturalDTO>('/v1/bens-culturais', bem);
    return response.data;
  },
  async listarPublicos(busca?: string, natureza?: NaturezaBem) {
    const response = await api.get<PageDTO<BemCulturalPublicoDTO>>('/v1/bens-culturais/publicos', {
      params: busca || natureza ? { busca, natureza } : undefined,
    });
    return response.data;
  },
  async buscarPublico(codigo: string) {
    const response = await api.get<BemCulturalPublicoDTO>(`/v1/bens-culturais/publicos/${codigo}`);
    return response.data;
  },
  async mapaPublico(busca?: string) {
    const response = await api.get<GeoJsonFeatureCollection>('/v1/public/mapa-bens', {
      params: busca ? { busca } : undefined,
    });
    return response.data;
  },
};

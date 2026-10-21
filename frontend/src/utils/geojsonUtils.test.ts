import { describe, expect, it } from 'vitest';
import {
  clusterizarMarcadores,
  converterVerticesParaGeoJsonPolygon,
  normalizarCoordenada,
} from './geojsonUtils';

describe('utilitários geoespaciais', () => {
  it('normaliza coordenadas numéricas recebidas como texto', () => {
    expect(normalizarCoordenada([Number('-44.302'), Number('-2.529')])).toEqual([-44.302, -2.529]);
  });

  it('agrupa marcadores próximos em um cluster em baixo zoom e separa em zoom alto', () => {
    const marcadores = [
      { id: '1', latitude: -2.5291, longitude: -44.3021, title: 'Casarão 1' },
      { id: '2', latitude: -2.5293, longitude: -44.3023, title: 'Casarão 2' },
    ];

    const clustersZoomBaixo = clusterizarMarcadores(marcadores, 10);
    expect(clustersZoomBaixo).toHaveLength(1);
    expect(clustersZoomBaixo[0].count).toBe(2);

    const clustersZoomAlto = clusterizarMarcadores(marcadores, 17);
    expect(clustersZoomAlto).toHaveLength(2);
  });

  it('converte vértices desenhados em polígono GeoJSON fechado (SIRGAS 2000 / WGS84)', () => {
    const poligono = converterVerticesParaGeoJsonPolygon([
      [-2.529, -44.302],
      [-2.53, -44.303],
      [-2.531, -44.301],
    ]);

    expect(poligono).not.toBeNull();
    expect(poligono?.type).toBe('Polygon');
    expect(poligono?.coordinates[0]).toHaveLength(4);
    expect(poligono?.coordinates[0][0]).toEqual(poligono?.coordinates[0][3]);
  });
});

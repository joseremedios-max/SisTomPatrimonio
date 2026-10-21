export type Coordenada = [number, number];

export interface PontoClusterizavel {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
}

export interface ClusterEspacial<T extends PontoClusterizavel = PontoClusterizavel> {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  items: T[];
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: Coordenada[][];
}

export function normalizarCoordenada(value: Coordenada): Coordenada {
  return [Number(value[0]), Number(value[1])];
}

/**
 * Agrupa marcadores próximos em clusters espaciais proporcionais ao nível de zoom
 * para regiões de alta densidade patrimonial (ex: Centro Histórico de São Luís).
 */
export function clusterizarMarcadores<T extends PontoClusterizavel>(
  markers: T[],
  zoom: number,
): ClusterEspacial<T>[] {
  if (markers.length === 0) return [];
  if (zoom >= 16) {
    return markers.map((m) => ({
      id: m.id,
      latitude: m.latitude,
      longitude: m.longitude,
      count: 1,
      items: [m],
    }));
  }

  // Tamanho da célula em graus reduz conforme o zoom aumenta
  const cellSize = 0.35 / Math.pow(2, Math.max(0, zoom - 6));
  const buckets = new Map<string, T[]>();

  for (const marker of markers) {
    const row = Math.floor(marker.latitude / cellSize);
    const col = Math.floor(marker.longitude / cellSize);
    const key = `${row}:${col}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(marker);
    } else {
      buckets.set(key, [marker]);
    }
  }

  const clusters: ClusterEspacial<T>[] = [];
  for (const [key, items] of buckets.entries()) {
    const latMedia = items.reduce((acc, item) => acc + item.latitude, 0) / items.length;
    const lngMedia = items.reduce((acc, item) => acc + item.longitude, 0) / items.length;
    clusters.push({
      id: items.length === 1 ? items[0].id : `cluster-${key}`,
      latitude: latMedia,
      longitude: lngMedia,
      count: items.length,
      items,
    });
  }

  return clusters;
}

/**
 * Converte vértices [latitude, longitude] desenhados no mapa em um Polígono GeoJSON fechado
 * no padrão PostGIS WGS84 / SIRGAS 2000 ([longitude, latitude]).
 */
export function converterVerticesParaGeoJsonPolygon(
  verticesLatLng: Coordenada[],
): GeoJsonPolygon | null {
  if (verticesLatLng.length < 3) return null;

  const anel: Coordenada[] = verticesLatLng.map(([lat, lng]) => [Number(lng), Number(lat)]);
  const primeiro = anel[0];
  const ultimo = anel[anel.length - 1];
  if (primeiro[0] !== ultimo[0] || primeiro[1] !== ultimo[1]) {
    anel.push([primeiro[0], primeiro[1]]);
  }

  return {
    type: 'Polygon',
    coordinates: [anel],
  };
}

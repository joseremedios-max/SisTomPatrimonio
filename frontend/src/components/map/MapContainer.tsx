import { useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LeafletClusters } from './LeafletClusters';
import { GeoJsonLayer } from './GeoJsonLayer';
import {
  converterVerticesParaGeoJsonPolygon,
  type Coordenada,
  type GeoJsonPolygon,
} from '../../utils/geojsonUtils';

export type PublicMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
};

export type BasemapType = 'vetorial' | 'satelite';

type MapContainerProps = {
  center?: LatLngExpression;
  zoom?: number;
  markers?: PublicMapMarker[];
  className?: string;
  enablePolygonDraw?: boolean;
  onPolygonComplete?: (polygon: GeoJsonPolygon, vertices: Coordenada[]) => void;
};

const DEFAULT_CENTER: LatLngExpression = [-2.5307, -44.3068];

const BASEMAPS: Record<BasemapType, { url: string; attribution: string; label: string }> = {
  vetorial: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    label: 'Mapa Vetorial (OSM)',
  },
  satelite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    label: 'Satélite (Esri World Imagery)',
  },
};

/**
 * The API contract uses WGS 84 / EPSG:4326. Leaflet receives coordinates
 * as latitude/longitude pairs and projects them for display internally.
 */
export function MapContainer({
  center = DEFAULT_CENTER,
  zoom = 12,
  markers = [],
  className = 'h-96 w-full',
  enablePolygonDraw = false,
  onPolygonComplete,
}: MapContainerProps) {
  const [basemap, setBasemap] = useState<BasemapType>('vetorial');
  const [drawingMode, setDrawingMode] = useState(false);
  const [activeVertices, setActiveVertices] = useState<Coordenada[]>([]);
  const [savedPolygons, setSavedPolygons] = useState<Coordenada[][]>([]);

  const handleAddVertex = (coord: Coordenada) => {
    setActiveVertices((prev) => [...prev, coord]);
  };

  const handleFinishPolygon = () => {
    const geojson = converterVerticesParaGeoJsonPolygon(activeVertices);
    if (!geojson) return;
    setSavedPolygons((prev) => [...prev, activeVertices]);
    onPolygonComplete?.(geojson, activeVertices);
    setActiveVertices([]);
    setDrawingMode(false);
  };

  const handleClearDrawing = () => {
    setActiveVertices([]);
    setDrawingMode(false);
  };

  const activeTile = BASEMAPS[basemap];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
        <div className="flex items-center gap-2" role="group" aria-label="Alternar camada base do mapa">
          <span className="font-semibold text-slate-700">Camada base:</span>
          <button
            type="button"
            onClick={() => setBasemap('vetorial')}
            aria-pressed={basemap === 'vetorial'}
            className={`rounded px-2.5 py-1 font-medium ${
              basemap === 'vetorial'
                ? 'bg-emerald-800 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mapa Vetorial
          </button>
          <button
            type="button"
            onClick={() => setBasemap('satelite')}
            aria-pressed={basemap === 'satelite'}
            className={`rounded px-2.5 py-1 font-medium ${
              basemap === 'satelite'
                ? 'bg-emerald-800 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Imagem de Satélite (Esri)
          </button>
        </div>

        {enablePolygonDraw && (
          <div className="flex items-center gap-2">
            {!drawingMode ? (
              <button
                type="button"
                onClick={() => setDrawingMode(true)}
                className="rounded bg-amber-700 px-2.5 py-1 font-semibold text-white hover:bg-amber-800"
              >
                Desenhar Polígono de Tombamento
              </button>
            ) : (
              <>
                <span className="text-amber-800 font-medium">
                  Clique no mapa ({activeVertices.length} vértices)
                </span>
                <button
                  type="button"
                  disabled={activeVertices.length < 3}
                  onClick={handleFinishPolygon}
                  className="rounded bg-emerald-700 px-2.5 py-1 font-semibold text-white disabled:opacity-40"
                >
                  Concluir Polígono
                </button>
                <button
                  type="button"
                  onClick={handleClearDrawing}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <LeafletMapContainer center={center} zoom={zoom} className={className}>
        <TileLayer attribution={activeTile.attribution} url={activeTile.url} />
        <LeafletClusters markers={markers} initialZoom={zoom} />
        <GeoJsonLayer
          polygons={savedPolygons}
          activeVertices={activeVertices}
          drawingEnabled={drawingMode}
          onAddVertex={handleAddVertex}
        />
      </LeafletMapContainer>
    </div>
  );
}

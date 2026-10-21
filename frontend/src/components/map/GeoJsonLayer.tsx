import { Polygon, Polyline, useMapEvents } from 'react-leaflet';
import type { Coordenada } from '../../utils/geojsonUtils';

interface GeoJsonLayerProps {
  polygons?: Coordenada[][];
  activeVertices?: Coordenada[];
  drawingEnabled?: boolean;
  onAddVertex?: (coord: Coordenada) => void;
}

export function GeoJsonLayer({
  polygons = [],
  activeVertices = [],
  drawingEnabled = false,
  onAddVertex,
}: GeoJsonLayerProps) {
  useMapEvents({
    click(event) {
      if (drawingEnabled && onAddVertex) {
        onAddVertex([
          Number(event.latlng.lat.toFixed(6)),
          Number(event.latlng.lng.toFixed(6)),
        ]);
      }
    },
  });

  return (
    <>
      {polygons.map((poly, index) => (
        <Polygon
          key={`poly-${index}`}
          positions={poly}
          pathOptions={{
            color: '#065f46',
            fillColor: '#10b981',
            fillOpacity: 0.25,
            weight: 2,
          }}
        />
      ))}
      {activeVertices.length >= 2 && (
        <Polyline
          positions={activeVertices}
          pathOptions={{ color: '#d97706', dashArray: '6 4', weight: 2 }}
        />
      )}
      {activeVertices.length >= 3 && (
        <Polygon
          positions={activeVertices}
          pathOptions={{
            color: '#d97706',
            fillColor: '#fbbf24',
            fillOpacity: 0.2,
            weight: 2,
          }}
        />
      )}
    </>
  );
}

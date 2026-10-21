import { useState } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { clusterizarMarcadores, type PontoClusterizavel } from '../../utils/geojsonUtils';

interface LeafletClustersProps {
  markers: PontoClusterizavel[];
  initialZoom?: number;
}

function createClusterIcon(count: number): L.DivIcon {
  const size = count >= 20 ? 44 : count >= 5 ? 38 : 32;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#065f46;color:#ffffff;font-weight:700;font-size:12px;border:3px solid #a7f3d0;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${count}</div>`,
    className: 'sipma-marker-cluster',
    iconSize: [size, size],
  });
}

export function LeafletClusters({ markers, initialZoom = 12 }: LeafletClustersProps) {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom() || initialZoom);

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  const clusters = clusterizarMarcadores(markers, zoom);

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.count === 1) {
          const marker = cluster.items[0];
          return (
            <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
              <Popup>
                <strong>{marker.title}</strong>
                {marker.description && <p>{marker.description}</p>}
              </Popup>
            </Marker>
          );
        }

        return (
          <Marker
            key={cluster.id}
            position={[cluster.latitude, cluster.longitude]}
            icon={createClusterIcon(cluster.count)}
            eventHandlers={{
              click: () => {
                map.setView([cluster.latitude, cluster.longitude], Math.min(zoom + 2, 18));
              },
            }}
          >
            <Popup>
              <strong>{cluster.count} bens culturais nesta área</strong>
              <ul className="mt-1 max-h-32 overflow-y-auto text-xs">
                {cluster.items.slice(0, 8).map((item) => (
                  <li key={item.id}>• {item.title}</li>
                ))}
              </ul>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

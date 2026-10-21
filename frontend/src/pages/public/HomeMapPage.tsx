import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../PageShell';
import { bemCulturalService } from '../../services/bemCulturalService';
import { MapContainer, type PublicMapMarker } from '../../components/map/MapContainer';

export default function HomeMapPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [markers, setMarkers] = useState<PublicMapMarker[]>([]);

  useEffect(() => {
    bemCulturalService
      .mapaPublico()
      .then((mapa) => {
        setTotal(mapa.features.length);
        const convertidos: PublicMapMarker[] = mapa.features
          .filter((f) => Array.isArray(f.geometry?.coordinates) && f.geometry.coordinates.length >= 2)
          .map((f) => ({
            id: String(f.id),
            longitude: Number(f.geometry.coordinates[0]),
            latitude: Number(f.geometry.coordinates[1]),
            title: f.properties?.nome || 'Bem Cultural',
            description: f.properties?.natureza || undefined,
          }));
        setMarkers(convertidos);
      })
      .catch(() => setTotal(null));
  }, []);

  return (
    <PageShell title="Patrimônio cultural do Maranhão">
      <p className="mb-6 max-w-2xl text-lg text-slate-600">
        Explore bens culturais, acervos e informações territoriais dos municípios maranhenses.
      </p>
      {total !== null && (
        <p className="mb-4 text-sm font-medium text-slate-700" aria-live="polite">
          {total} bens disponíveis no mapa público (coordenadas arqueológicas confidenciais protegidas).
        </p>
      )}
      <div className="mb-6">
        <MapContainer markers={markers} zoom={7} className="h-96 w-full rounded-lg border border-slate-200" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded bg-emerald-800 px-4 py-2 font-medium text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          to="/acervo"
        >
          Consultar acervo
        </Link>
        <Link
          className="rounded border border-emerald-800 bg-white px-4 py-2 font-medium text-emerald-900 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          to="/reportar-inconsistencia"
        >
          Reportar inconsistência
        </Link>
      </div>
    </PageShell>
  );
}

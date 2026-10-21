import { useState } from 'react';
import PageShell from '../PageShell';
import api from '../../services/api';
import type { PageDTO, BemCulturalDTO } from '../../types/dtos';
import { MapContainer, type PublicMapMarker } from '../../components/map/MapContainer';
import type { GeoJsonPolygon } from '../../utils/geojsonUtils';

export default function GeorreferenciamentoPage() {
  const [latitude, setLatitude] = useState('-2.53073');
  const [longitude, setLongitude] = useState('-44.30680');
  const [bens, setBens] = useState<BemCulturalDTO[]>([]);
  const [poligonoTombamento, setPoligonoTombamento] = useState<GeoJsonPolygon | null>(null);

  const buscar = async () => {
    const response = await api.get<PageDTO<BemCulturalDTO>>('/v1/bens-culturais/proximidade', {
      params: { latitude, longitude, raioMetros: 5000 },
    });
    setBens(response.data.content);
  };

  const markers: PublicMapMarker[] = [
    {
      id: 'centro-busca',
      latitude: Number(latitude) || -2.53073,
      longitude: Number(longitude) || -44.3068,
      title: 'Ponto de Referência SIRGAS 2000',
      description: `Raio de busca: 5.000m (${bens.length} bens localizados)`,
    },
  ];

  return (
    <PageShell title="Georreferenciamento">
      <div className="mb-6 grid max-w-2xl gap-3 md:grid-cols-3">
        <input
          className="rounded border p-2"
          value={latitude}
          onChange={(event) => setLatitude(event.target.value)}
          aria-label="Latitude"
        />
        <input
          className="rounded border p-2"
          value={longitude}
          onChange={(event) => setLongitude(event.target.value)}
          aria-label="Longitude"
        />
        <button
          className="rounded bg-emerald-800 px-3 py-2 text-white"
          onClick={() => void buscar()}
        >
          Buscar proximidade
        </button>
      </div>

      <div className="mb-6">
        <MapContainer
          center={[Number(latitude) || -2.53073, Number(longitude) || -44.3068]}
          zoom={14}
          markers={markers}
          enablePolygonDraw={true}
          onPolygonComplete={(polygon) => setPoligonoTombamento(polygon)}
          className="h-96 w-full rounded-lg border border-slate-200"
        />
      </div>

      {poligonoTombamento && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
          <p className="font-bold">Polígono de Tombamento Gerado (GeoJSON / SIRGAS 2000):</p>
          <pre className="mt-2 overflow-x-auto rounded bg-white p-2 border border-emerald-100">
            {JSON.stringify(poligonoTombamento)}
          </pre>
        </div>
      )}

      <ul className="space-y-2">
        {bens.map((bem) => (
          <li className="rounded border bg-white p-3" key={bem.id}>
            {bem.codigo} — {bem.nome}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

import { createContext, useMemo, useState, type ReactNode } from 'react';
type MapValue = { zoom: number; setZoom: (zoom: number) => void; layers: string[] };
export const MapContext = createContext<MapValue | undefined>(undefined);
export function MapProvider({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState(7);
  const value = useMemo(() => ({ zoom, setZoom, layers: ['bens-culturais', 'limites-municipais'] }), [zoom]);
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
import { useContext } from 'react';
import { MapContext } from '../context/MapContext';
export function useGisData() { const context = useContext(MapContext); if (!context) throw new Error('useGisData deve ser usado dentro de MapProvider'); return context; }
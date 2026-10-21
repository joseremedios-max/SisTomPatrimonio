# 05 - Geoprocessamento GIS, Clusterização, Basemaps e Polígonos de Tombamento

## 🗺️ Integração Cartográfica Avançada (`MapContainer.tsx`)

O módulo de mapas do **SIP-MA** consome geometrias enviadas pela extensão espacial **PostGIS** configuradas no referencial **SIRGAS 2000 / WGS84 (EPSG:4326)** e oferece:

1. **Alternância de Camadas Base (*Basemap Switcher*):**
   - **Mapa Vetorial (OpenStreetMap):** Ideal para leitura de arruamentos e malha urbana.
   - **Imagem de Satélite (Esri World Imagery):** Ideal para inspeção de coberturas, telhados coloniais e entorno ambiental.
2. **Clusterização Espacial de Alta Densidade (`LeafletClusters.tsx` & `clusterizarMarcadores`):**
   - Agrupa marcadores próximos proporcionalmente ao nível de zoom (`zoom < 16`) em regiões de alta concentração patrimonial (como o Centro Histórico de São Luís), exibindo selos numéricos interativos que expandem a área ao clicar.
3. **Desenho de Polígonos de Tombamento (`GeoJsonLayer.tsx` & `converterVerticesParaGeoJsonPolygon`):**
   - Permite que peritos desenhem perímetros de proteção e poligonais de tombamento diretamente sobre o mapa em `GeorreferenciamentoPage.tsx`, gerando automaticamente o objeto `GeoJsonPolygon` fechado (`[longitude, latitude]`) compatível com PostGIS.

---

## 🔒 Regra Crítica de Segurança: Proteção de Sítios Arqueológicos

Para cumprir a legislação de proteção ao patrimônio (Lei Federal nº 3.924/1961) e evitar saques em sítios arqueológicos não escavados:

1. **No Portal Público (Cidadão):** As coordenadas exatas (`geom_exata`) são **omitidas ou generalizadas** para o centroide do município pelo backend antes da serialização do GeoJSON.
2. **No Painel Administrativo:** Apenas peritos credenciados com perfil `ADMIN` ou `TECNICO` têm acesso à visualização da geometria exata do sítio arqueológico.

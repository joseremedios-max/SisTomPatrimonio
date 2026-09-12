# ADR 0003: Georreferenciamento com PostGIS e Isolamento Arqueológico

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê de Desenvolvimento e Especialistas em Cartografia

---

## 1. Contexto e Declaração do Problema
O patrimônio cultural do Maranhão possui forte dimensão geográfica: monumentos coloniais no Centro Histórico de São Luís, fortificações no litoral e sítios arqueológicos no interior. O sistema necessita de:
1. Armazenamento padronizado de coordenadas e polígonos.
2. Consultas geoespaciais de alta performance (busca de bens por raio em metros).
3. Proteção rigorosa das coordenadas exatas de sítios arqueológicos para evitar saques.

---

## 2. Opções Consideradas
* **Opção 1**: Armazenar apenas campos numéricos de latitude e longitude (`double precision`) e calcular distâncias por fórmula de Haversine em código Java.
* **Opção 2**: Adotar a extensão espacial **PostGIS** no PostgreSQL com biblioteca **JTS Topology Suite** no Java e referência espacial WGS 84 (`EPSG:4326`).
* **Opção 3**: Utilizar serviços de mapas de terceiros (ex: Google Maps Platform) para toda a persistência espacial.

---

## 3. Decisão Tomada
Adotar a **Opção 2 (PostGIS + JTS + EPSG:4326)** com separação relacional 1:1:
* Utilização de tipos JTS (`Point`, `Polygon`, `MultiPolygon`) persistidos via Hibernate Spatial.
* Criação de índices espaciais **GIST** para suporte ao operador `ST_DWithin` nativo do banco.
* Criação da tabela isolada `localizacao_arqueologica_restrita` com relação 1:1 ao bem, segregando a coordenada exata com níveis de restrição (`RESTRITA`, `SIGILOSA`) e liberando ao público apenas o polígono de amortecimento (`buffer_protecao`).

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* Consultas espaciais executadas em milissegundos diretamente na camada de banco de dados.
* Conformidade com os padrões de segurança do IPHAN e do Ministério da Cultura.
* Interoperabilidade total com ferramentas GIS (QGIS, ArcGIS, GeoServer).

### Impactos Negativos (Custos):
* Dependência da extensão PostGIS ativa no PostgreSQL (gerenciada via container Docker oficial `postgis/postgis:14-3.3-alpine`).

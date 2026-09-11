package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Municipio;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositório JPA para operações de persistência e consultas espaciais da entidade Municipio.
 * Estende JpaRepository aproveitando os recursos do Hibernate Spatial e PostGIS.
 */
@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, UUID> {

    /**
     * Busca um município pelo seu código oficial do IBGE.
     * 
     * @param codigoIbge Código de 7 dígitos do IBGE.
     * @return Optional contendo o município se encontrado.
     */
    Optional<Municipio> findByCodigoIbge(String codigoIbge);

    /**
     * Busca municípios pelo nome de forma case-insensitive.
     * 
     * @param nome Nome do município ou parte dele.
     * @return Lista de municípios correspondentes.
     */
    List<Municipio> findByNomeContainingIgnoreCase(String nome);

    /**
     * CONSULTA ESPACIAL JPQL (Hibernate Spatial):
     * Encontra o município que contém geograficamente um determinado ponto espacial (JTS Point).
     * Utiliza a função espacial standard 'contains'.
     * 
     * @param ponto Objeto JTS Point contendo as coordenadas geográficas.
     * @return Optional contendo o município que engloba o ponto.
     */
    @Query(value = "SELECT m.* FROM municipio m WHERE ST_Contains(m.geom, :ponto)", nativeQuery = true)
    Optional<Municipio> findByContainingPoint(@Param("ponto") Point ponto);

    /**
     * CONSULTA ESPACIAL NATIVA (PostGIS):
     * Encontra o município que contém geograficamente um par de coordenadas (Latitude/Longitude).
     * Ideal para integrar com o GPS do dispositivo móvel do técnico em campo sem precisar instanciar JTS Point no frontend.
     * Utiliza a função nativa 'ST_Contains' e o SRID 4326.
     * 
     * @param latitude Coordenada Y (Latitude) no padrão WGS84.
     * @param longitude Coordenada X (Longitude) no padrão WGS84.
     * @return Optional contendo o município correspondente.
     */
    @Query(value = "SELECT m.* FROM municipio m WHERE ST_Contains(m.geom, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)) = true LIMIT 1", nativeQuery = true)
    Optional<Municipio> findByCoordinates(@Param("latitude") Double latitude, @Param("longitude") Double longitude);

    /**
     * CONSULTA ESPACIAL JPQL (Hibernate Spatial):
     * Encontra todos os municípios vizinhos de um determinado município (municípios cujas fronteiras se tocam).
     * Utiliza a função 'touches' do Hibernate Spatial.
     * 
     * @param geom Polígono geométrico do município de referência.
     * @param idId UUID do município de referência para excluí-lo do retorno.
     * @return Lista de municípios limítrofes.
     */
    @Query(value = "SELECT m.* FROM municipio m WHERE ST_Touches(m.geom, :geom) AND m.id <> :id", nativeQuery = true)
    List<Municipio> findVizinhos(@Param("geom") Geometry geom, @Param("id") UUID id);
}

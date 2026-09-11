package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BemCulturalRepository extends JpaRepository<BemCultural, UUID> {

    Optional<BemCultural> findByCodigo(String codigo);

    Page<BemCultural> findByNaturezaAndStatus(String natureza, String status, Pageable pageable);

    // Consulta de bens próximos a um ponto geográfico usando raio em metros (ST_DWithin no PostGIS)
    @Query(value = """
        SELECT b.* FROM bem_cultural b
        JOIN localizacao_bem l ON l.bem_id = b.id
        WHERE ST_DWithin(l.geom, :ponto, :raioMetros, true) = true
        AND b.status = 'PUBLICADO'
    """, nativeQuery = true)
    Page<BemCultural> buscarPorProximidade(
            @Param("ponto") Point ponto,
            @Param("raioMetros") double raioMetros,
            Pageable pageable
    );

    // Consulta de bens contidos dentro do limite territorial de um município
    @Query(value = """
        SELECT b.* FROM bem_cultural b
        JOIN localizacao_bem l ON l.bem_id = b.id
        JOIN municipio m ON m.id = :municipioId
        WHERE ST_Contains(m.geom, l.geom) = true
    """, nativeQuery = true)
    Page<BemCultural> buscarPorMunicipioGeografico(@Param("municipioId") UUID municipioId, Pageable pageable);
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface BemCulturalRepository extends JpaRepository<BemCultural, UUID> {

    Optional<BemCultural> findByCodigo(String codigo);

    Page<BemCultural> findByNaturezaAndStatus(String natureza, String status, Pageable pageable);

    Page<BemCultural> findByNaturezaAndStatusIn(NaturezaBem natureza, Collection<String> statuses, Pageable pageable);

    Page<BemCultural> findByStatus(String status, Pageable pageable);

    Page<BemCultural> findByStatusIn(Collection<String> statuses, Pageable pageable);

    Page<BemCultural> findByStatusAndNomeContainingIgnoreCase(String status, String nome, Pageable pageable);

    Page<BemCultural> findByStatusInAndNomeContainingIgnoreCase(Collection<String> statuses, String nome, Pageable pageable);

    long countByStatus(String status);

    Optional<BemCultural> findByCodigoAndStatus(String codigo, String status);

    Optional<BemCultural> findByCodigoAndStatusIn(String codigo, Collection<String> statuses);

    // Consulta de bens próximos a um ponto geográfico usando raio em metros (ST_DWithin no PostGIS)
    @Query(value = """
        SELECT b.* FROM bem_cultural b
        JOIN localizacao_bem l ON l.bem_id = b.id
        WHERE ST_DWithin(l.geom, :ponto, :raioMetros, true) = true
        AND b.status IN ('PUBLICADO', 'TOMBADO')
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

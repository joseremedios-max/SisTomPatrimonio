package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.MultiPolygon;

import java.util.UUID;

/**
 * Entidade JPA que representa um Município do estado do Maranhão.
 * Mapeada com suporte geoespacial (Hibernate Spatial) para armazenar e consultar
 * os polígonos das fronteiras municipais usando dados do IBGE.
 */
@Entity
@Table(name = "municipio")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "geom")
public class Municipio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "codigo_ibge", nullable = false, unique = true, length = 7)
    private String codigoIbge;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Builder.Default
    @Column(name = "uf", nullable = false, length = 2)
    private String uf = "MA";

    /**
     * Representação espacial do limite territorial do município (fronteira geográfica).
     * Mapeado usando org.locationtech.jts.geom.MultiPolygon suportado pelo Hibernate Spatial.
     * SRID 4326 (WGS 84) representa o sistema de coordenadas geográficas padrão.
     */
    @Column(name = "geom", columnDefinition = "geometry(MultiPolygon, 4326)")
    private MultiPolygon geom;
}
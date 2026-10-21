package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "localizacao_arqueologica_restrita")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalizacaoArqueologicaRestrita {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false, unique = true)
    private BemCultural bem;

    @Column(name = "geom_exata", nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point geomExata;

    @Column(name = "buffer_protecao", columnDefinition = "geometry(Polygon, 4326)")
    private Polygon bufferProtecao;

    @Column(name = "nivel_restricao", nullable = false, length = 30)
    private String nivelRestricao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fundamento;

    @Column(name = "precisao_m", precision = 8, scale = 2)
    private BigDecimal precisaoM;

    @Column(length = 100)
    private String fonte;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "criado_por", nullable = false)
    private Usuario criadoPor;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();
}
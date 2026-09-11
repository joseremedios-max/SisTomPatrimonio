package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Geometry;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "localizacao_bem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalizacaoBem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;

    @Column(name = "distrito_localidade", length = 100)
    private String distritoLocalidade;

    @Column(length = 100)
    private String bairro;

    @Column(length = 150)
    private String logradouro;

    @Column(length = 20)
    private String numero;

    @Column(length = 100)
    private String complemento;

    @Column(length = 8)
    private String cep;

    @Column(length = 20)
    private String zona;

    @Builder.Default
    @Column(name = "tipo_localizacao", nullable = false, length = 20)
    private String tipoLocalizacao = "PRINCIPAL";

    @Column(columnDefinition = "geometry(Geometry, 4326)")
    private Geometry geom;

    @Column(name = "precisao_m", precision = 8, scale = 2)
    private BigDecimal precisaoM;

    @Column(name = "metodo_coleta", length = 50)
    private String metodoColeta;

    @Column(length = 20)
    private String datum;

    private Integer epsg;

    @Column(length = 100)
    private String fonte;

    @Builder.Default
    @Column(nullable = false)
    private Boolean principal = false;

    @Column(name = "numero_matricula", length = 50)
    private String numeroMatricula;

    @Column(length = 100)
    private String serventia;

    @Column(name = "inscricao_imobiliaria", length = 50)
    private String inscricaoImobiliaria;

    @Column(name = "validado_em")
    private OffsetDateTime validadoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validado_por")
    private Usuario validadoPor;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "vistoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vistoria {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 24)
    private String codigo;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bem;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "agendada_em")
    private OffsetDateTime agendadaEm;

    @Column(name = "realizada_em")
    private OffsetDateTime realizadaEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_id")
    private Organizacao organizacao;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column
    private Map<String, Object> equipe;

    @Column(name = "situacao_conservacao")
    private String situacaoConservacao;

    @Column(name = "nivel_risco")
    private String nivelRisco;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column
    private Map<String, Object> patologias;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(columnDefinition = "TEXT")
    private String recomendacao;

    @Column(name = "proxima_vistoria")
    private LocalDate proximaVistoria;

    @Builder.Default
    @Column(nullable = false)
    private Boolean homologada = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homologada_por")
    private Usuario homologadaPor;

    @Column(name = "homologada_em")
    private OffsetDateTime homologadaEm;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();
}
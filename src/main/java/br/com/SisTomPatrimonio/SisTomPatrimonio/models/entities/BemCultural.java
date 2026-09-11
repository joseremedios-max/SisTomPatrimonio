package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
        import lombok.*;
        import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "bem_cultural")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BemCultural {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 24)
    private String codigo;

    @Column(nullable = false, length = 30)
    private String natureza; // MATERIAL_EDIFICADO, IMATERIAL, ARQUEOLOGICO

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nome;

    @Column(name = "resumo_publico", columnDefinition = "TEXT")
    private String resumoPublico;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "observacoes_internas", columnDefinition = "TEXT")
    private String observacoesInternas;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String classificacao = "INTERNA";

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "RASCUNHO";

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_responsavel_id", nullable = false)
    private Organizacao organizacaoResponsavel;

    // Atributos de Imóveis (Patrimônio Material)
    @Column(name = "tipo_imovel", length = 50)
    private String tipoImovel;

    @Column(name = "tipologia_arquitetonica", length = 100)
    private String tipologiaArquitetonica;

    @Column(name = "uso_original", length = 100)
    private String usoOriginal;

    @Column(name = "uso_atual", length = 100)
    private String usoAtual;

    @Column(name = "dominio_atual", length = 20)
    private String dominioAtual;

    @Column(name = "ano_inicio")
    private Short anoInicio;

    @Column(name = "ano_fim")
    private Short anoFim;

    @Column(name = "area_construida_m2", precision = 12, scale = 2)
    private BigDecimal areaConstruidaM2;

    @Column(name = "area_terreno_m2", precision = 12, scale = 2)
    private BigDecimal areaTerrenoM2;

    @Column(name = "numero_pavimentos")
    private Short numeroPavimentos;

    @Column(length = 100)
    private String estrutura;

    @Column(length = 100)
    private String cobertura;

    // Atributos de Patrimônio Imaterial
    @Column(name = "categoria_imaterial", length = 100)
    private String categoriaImaterial;

    @Column(length = 50)
    private String periodicidade;

    @Column(name = "contexto_pratica", columnDefinition = "TEXT")
    private String contextoPratica;

    @Column(name = "riscos_continuidade", columnDefinition = "TEXT")
    private String riscosContinuidade;

    // Atributos de Arqueologia
    @Column(name = "tipo_sitio", length = 100)
    private String tipoSitio;

    @Column(name = "periodo_cultural", length = 100)
    private String periodoCultural;

    @Column(name = "regime_acesso", length = 30)
    private String regimeAcesso;

    @Builder.Default
    private Boolean restrito = false;

    // Mapeamento nativo do campo JSONB via Hibernate 6
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dados_especificos")
    private Map<String, Object> dadosEspecificos;

    @Column(name = "publicado_em")
    private OffsetDateTime publicadoEm;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "criado_por", nullable = false)
    private Usuario criadoPor;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "atualizado_por", nullable = false)
    private Usuario atualizadoPor;

    @Builder.Default
    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm = OffsetDateTime.now();

    @Column(name = "arquivado_em")
    private OffsetDateTime arquivadoEm;
}
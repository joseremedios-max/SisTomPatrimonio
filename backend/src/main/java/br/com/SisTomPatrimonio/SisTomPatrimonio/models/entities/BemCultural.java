package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "bem_cultural")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BemCultural {

    public static class BemCulturalBuilder {
        public BemCulturalBuilder natureza(String natureza) {
            this.natureza = NaturezaBem.valueOf(natureza);
            return this;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 24)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NaturezaBem natureza;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nome;

    @Column(name = "resumo_publico", columnDefinition = "TEXT")
    private String resumoPublico;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "observacoes_internas", columnDefinition = "TEXT")
    private String observacoesInternas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_responsavel_id")
    private Organizacao organizacaoResponsavel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criado_por")
    private Usuario criadoPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atualizado_por")
    private Usuario atualizadoPor;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String classificacao = "INTERNA";

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "RASCUNHO";

    @Column(name = "regime_acesso", length = 30)
    private String regimeAcesso;

    @Column(nullable = false)
    @Builder.Default
    private Boolean restrito = false;

    // 🟢 Mapeamento Híbrido JSONB (Hibernate 6)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dados_especificos", columnDefinition = "jsonb")
    private Map<String, Object> dadosEspecificos;

    @Column(name = "publicado_em")
    private OffsetDateTime publicadoEm;

    @Column(name = "criado_em", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime criadoEm = OffsetDateTime.now();

    @Column(name = "atualizado_em", nullable = false)
    @Builder.Default
    private OffsetDateTime atualizadoEm = OffsetDateTime.now();

    public void tombar() {
        this.status = "TOMBADO";
    }

    public void publicar() {
        this.status = "PUBLICADO";
        this.publicadoEm = OffsetDateTime.now();
    }

    public void arquivar() {
        this.status = "ARQUIVADO";
    }

}
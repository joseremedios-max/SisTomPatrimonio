package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "salvaguarda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salvaguarda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bemCultural;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "versao", length = 20)
    private String versao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private StatusSalvaguarda status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_responsavel_id")
    private Organizacao organizacaoResponsavel;

    @Column(name = "vigencia_inicio")
    private LocalDate vigenciaInicio;

    @Column(name = "vigencia_fim")
    private LocalDate vigenciaFim;

    @Column(name = "objetivo", columnDefinition = "TEXT")
    private String objetivo;

    @Column(name = "orcamento", precision = 15, scale = 2)
    private BigDecimal orcamento;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "acoes")
    private Map<String, Object> acoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        if (this.criadoEm == null) {
            this.criadoEm = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = StatusSalvaguarda.PLANEJADO;
        }
    }

    // Métodos utilitários de compatibilidade
    public String getPlanoAcao() {
        return this.titulo != null ? this.titulo : this.objetivo;
    }

    public void setPlanoAcao(String planoAcao) {
        this.titulo = planoAcao;
    }

    public LocalDate getDataInicio() {
        return this.vigenciaInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.vigenciaInicio = dataInicio;
    }

    public LocalDate getDataPrevisaoFim() {
        return this.vigenciaFim;
    }

    public void setDataPrevisaoFim(LocalDate dataPrevisaoFim) {
        this.vigenciaFim = dataPrevisaoFim;
    }

    public LocalDate getDataConclusao() {
        return this.vigenciaFim;
    }

    public Usuario getResponsavel() {
        if (this.organizacaoResponsavel != null) {
            return Usuario.builder().id(this.organizacaoResponsavel.getId()).nome(this.organizacaoResponsavel.getNome()).build();
        }
        return Usuario.builder().id(UUID.fromString("00000000-0000-0000-0000-000000000000")).build();
    }

    public static class SalvaguardaBuilder {
        public SalvaguardaBuilder planoAcao(String planoAcao) {
            this.titulo = planoAcao;
            return this;
        }

        public SalvaguardaBuilder dataInicio(LocalDate dataInicio) {
            this.vigenciaInicio = dataInicio;
            return this;
        }

        public SalvaguardaBuilder dataPrevisaoFim(LocalDate dataPrevisaoFim) {
            this.vigenciaFim = dataPrevisaoFim;
            return this;
        }

        public SalvaguardaBuilder dataConclusao(LocalDate dataConclusao) {
            return this;
        }

        public SalvaguardaBuilder responsavel(Usuario responsavel) {
            if (responsavel != null && responsavel.getOrganizacao() != null) {
                this.organizacaoResponsavel = responsavel.getOrganizacao();
            }
            return this;
        }
    }
}
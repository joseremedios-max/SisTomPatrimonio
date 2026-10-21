package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "processo_judicial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessoJudicial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "numero_cnj", nullable = false, unique = true, length = 50)
    private String numeroCnj;

    @Column(name = "tribunal", length = 100)
    private String tribunal;

    @Column(name = "vara", length = 100)
    private String vara;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;

    @Column(name = "tipo_acao", length = 100)
    private String tipoAcao;

    @Enumerated(EnumType.STRING)
    @Column(name = "fase", nullable = false, length = 30)
    private FaseProcessoJudicial fase;

    @Column(name = "objeto", nullable = false, columnDefinition = "TEXT")
    private String objeto;

    @Column(name = "valor_causa", precision = 15, scale = 2)
    private BigDecimal valorCausa;

    @Column(name = "data_distribuicao")
    private LocalDate dataDistribuicao;

    @Column(name = "data_encerramento")
    private LocalDate dataEncerramento;

    @Builder.Default
    @Column(name = "segredo_justica", nullable = false)
    private Boolean segredoJustica = false;

    @Builder.Default
    @Column(name = "classificacao", nullable = false, length = 20)
    private String classificacao = "INTERNA";

    @Builder.Default
    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm = OffsetDateTime.now();

    @PrePersist
    @PreUpdate
    protected void onPersistOrUpdate() {
        this.atualizadoEm = OffsetDateTime.now();
        if (this.segredoJustica == null) {
            this.segredoJustica = false;
        }
        if (this.classificacao == null) {
            this.classificacao = "INTERNA";
        }
    }

    // Aliases para compatibilidade
    public String getNumeroProcesso() {
        return this.numeroCnj;
    }

    public void setNumeroProcesso(String numeroProcesso) {
        this.numeroCnj = numeroProcesso;
    }

    public String getVaraComarca() {
        return this.vara;
    }

    public void setVaraComarca(String varaComarca) {
        this.vara = varaComarca;
    }

    public String getAssunto() {
        return this.objeto;
    }

    public void setAssunto(String assunto) {
        this.objeto = assunto;
    }

    public static class ProcessoJudicialBuilder {
        public ProcessoJudicialBuilder numeroProcesso(String numeroProcesso) {
            this.numeroCnj = numeroProcesso;
            return this;
        }

        public ProcessoJudicialBuilder varaComarca(String varaComarca) {
            this.vara = varaComarca;
            return this;
        }

        public ProcessoJudicialBuilder assunto(String assunto) {
            this.objeto = assunto;
            return this;
        }
    }
}
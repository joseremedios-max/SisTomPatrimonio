package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "protecao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Protecao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bem;

    @Column(name = "numero_processo")
    private String numeroProcesso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_id")
    private Organizacao organizacao;

    @Column(length = 20)
    private String esfera; // FEDERAL, ESTADUAL, MUNICIPAL, INTERNACIONAL

    @Column(length = 30)
    private String fase; // EM_ESTUDO, EM_INSTRUCAO, PROVISORIO, HOMOLOGADO, INDEFERIDO, REVOGADO

    @Column(name = "tipo_protecao")
    private String tipoProtecao;

    @Column(name = "data_abertura")
    private LocalDate dataAbertura;

    @Column(name = "data_decisao")
    private LocalDate dataDecisao;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "ato_normativo")
    private String atoNormativo;

    @Column(name = "livro_tombo")
    private String livroTombo;

    @Column(name = "numero_inscricao")
    private String numeroInscricao;

    private String folha;

    @Builder.Default
    @Column(nullable = false)
    private Boolean vigente = true;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();

    public void homologarTombamento(String livroTombo, String numeroInscricao, String folha, String atoNormativo) {
        if (livroTombo == null || livroTombo.isBlank()) {
            throw new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Livro do Tombo deve ser informado para homologação.");
        }
        if (numeroInscricao == null || numeroInscricao.isBlank()) {
            throw new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Número de inscrição deve ser informado para homologação.");
        }
        if (atoNormativo == null || atoNormativo.isBlank()) {
            throw new br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime("Ato normativo deve ser informado para homologação.");
        }
        this.fase = "HOMOLOGADO";
        this.livroTombo = livroTombo;
        this.numeroInscricao = numeroInscricao;
        this.folha = folha;
        this.atoNormativo = atoNormativo;
        this.vigente = true;
        this.dataDecisao = LocalDate.now();
        if (this.bem != null) {
            this.bem.tombar();
        }
    }
}
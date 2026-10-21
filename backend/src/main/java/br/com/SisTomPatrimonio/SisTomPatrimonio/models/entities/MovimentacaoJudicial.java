package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "movimentacao_judicial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentacaoJudicial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processo_judicial_id", nullable = false)
    private ProcessoJudicial processoJudicial;

    @Column(name = "data_movimentacao", nullable = false)
    private LocalDate dataMovimentacao;

    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = OffsetDateTime.now();
    }
}
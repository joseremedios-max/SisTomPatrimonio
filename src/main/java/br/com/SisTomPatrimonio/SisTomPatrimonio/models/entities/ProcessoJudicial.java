package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "numero_processo", nullable = false, unique = true, length = 100)
    private String numeroProcesso;

    @Column(name = "tribunal", nullable = false, length = 150)
    private String tribunal;

    @Column(name = "vara_comarca", length = 150)
    private String varaComarca;

    @Enumerated(EnumType.STRING)
    @Column(name = "fase", nullable = false, length = 30)
    private FaseProcessoJudicial fase;

    @Column(name = "data_distribuicao")
    private LocalDate dataDistribuicao;

    @Column(name = "assunto", columnDefinition = "TEXT")
    private String assunto;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = OffsetDateTime.now();
    }
}
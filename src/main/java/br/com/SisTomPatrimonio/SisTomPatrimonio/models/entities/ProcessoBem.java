package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "processo_bem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessoBem {

    @EmbeddedId
    private ProcessoBemId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("processoJudicialId")
    @JoinColumn(name = "processo_judicial_id")
    private ProcessoJudicial processoJudicial;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bemCulturalId")
    @JoinColumn(name = "bem_cultural_id")
    private BemCultural bemCultural;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "vincular_em", nullable = false, updatable = false)
    private OffsetDateTime vincularEm;

    @PrePersist
    protected void onCreate() {
        this.vincularEm = OffsetDateTime.now();
    }
}
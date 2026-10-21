package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

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
    @MapsId("processoId")
    @JoinColumn(name = "processo_id", nullable = false)
    private ProcessoJudicial processoJudicial;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bemId")
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bemCultural;

    @Column(name = "papel_do_bem", length = 100)
    private String papelDoBem;

    @Column(name = "impacto_conservacao", columnDefinition = "TEXT")
    private String impactoConservacao;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;
}
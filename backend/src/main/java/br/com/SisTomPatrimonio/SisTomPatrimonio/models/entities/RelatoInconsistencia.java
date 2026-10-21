package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "relato_inconsistencia")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatoInconsistencia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bem;

    @Column(nullable = false, length = 120)
    private String contato;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = "ABERTO";

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();
}

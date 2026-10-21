package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "evento_bem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoBem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id", nullable = false)
    private BemCultural bemCultural;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 30)
    private EventoTipo tipo;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "ano_inicio")
    private Short anoInicio;

    @Column(name = "ano_fim")
    private Short anoFim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_id")
    private Organizacao organizacao;

    @Column(name = "custo", precision = 15, scale = 2)
    private BigDecimal custo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documento_id")
    private Documento documento;

    @Builder.Default
    @Column(name = "publico", nullable = false)
    private Boolean publico = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        if (this.criadoEm == null) {
            this.criadoEm = OffsetDateTime.now();
        }
        if (this.publico == null) {
            this.publico = true;
        }
    }

    // Aliases para compatibilidade
    public EventoTipo getTipoEvento() {
        return this.tipo;
    }

    public void setTipoEvento(EventoTipo tipo) {
        this.tipo = tipo;
    }

    public Usuario getResponsavel() {
        if (this.organizacao != null) {
            return Usuario.builder().id(this.organizacao.getId()).nome(this.organizacao.getNome()).build();
        }
        return Usuario.builder().id(UUID.fromString("00000000-0000-0000-0000-000000000000")).build();
    }

    public static class EventoBemBuilder {
        public EventoBemBuilder tipoEvento(EventoTipo tipoEvento) {
            this.tipo = tipoEvento;
            return this;
        }

        public EventoBemBuilder responsavel(Usuario responsavel) {
            if (responsavel != null && responsavel.getOrganizacao() != null) {
                this.organizacao = responsavel.getOrganizacao();
            }
            return this;
        }
    }
}
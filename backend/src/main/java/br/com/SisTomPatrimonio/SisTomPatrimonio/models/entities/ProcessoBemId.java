package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProcessoBemId implements Serializable {

    @Column(name = "processo_id")
    private UUID processoId;

    @Column(name = "bem_id")
    private UUID bemId;

    // Aliases para compatibilidade
    public UUID getProcessoJudicialId() {
        return this.processoId;
    }

    public void setProcessoJudicialId(UUID id) {
        this.processoId = id;
    }

    public UUID getBemCulturalId() {
        return this.bemId;
    }

    public void setBemCulturalId(UUID id) {
        this.bemId = id;
    }
}
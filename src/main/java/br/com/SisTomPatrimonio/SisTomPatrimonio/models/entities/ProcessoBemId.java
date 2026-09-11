package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

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

    private UUID processoJudicialId;
    private UUID bemCulturalId;
}
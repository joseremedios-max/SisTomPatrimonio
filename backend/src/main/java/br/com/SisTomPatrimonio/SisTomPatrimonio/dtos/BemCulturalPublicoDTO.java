package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BemCulturalPublicoDTO {
    private UUID id;
    private String codigo;
    private NaturezaBem natureza;
    private String nome;
    private String resumoPublico;
    private String descricao;
    private StatusBemCultural status;
    private String municipioNome;
    private Double latitude;
    private Double longitude;
}

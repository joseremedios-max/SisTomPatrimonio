package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DadosArqueologicoDTO implements DadosEspecificosDTO {

    @NotBlank(message = "O tipo do sítio arqueológico é obrigatório.")
    private String tipoSitio;

    @NotBlank(message = "O período cultural é obrigatório.")
    private String periodoCultural;
}
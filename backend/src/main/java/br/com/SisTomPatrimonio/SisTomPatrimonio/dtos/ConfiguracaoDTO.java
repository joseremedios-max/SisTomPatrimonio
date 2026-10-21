package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfiguracaoDTO {
    @NotBlank
    private String chave;
    @NotBlank
    private String valor;
}

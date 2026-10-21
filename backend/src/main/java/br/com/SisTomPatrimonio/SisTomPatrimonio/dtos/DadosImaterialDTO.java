package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DadosImaterialDTO implements DadosEspecificosDTO {

    @NotBlank(message = "A categoria imaterial é obrigatória (ex: Celebrações, Saberes).")
    private String categoriaImaterial;

    @NotBlank(message = "O contexto da prática não pode ficar em branco.")
    private String contextoPratica;
}
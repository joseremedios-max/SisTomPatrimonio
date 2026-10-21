package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DadosMaterialEdificadoDTO implements DadosEspecificosDTO {

    @NotBlank(message = "O tipo do imóvel é obrigatório (ex: Casarão, Igreja).")
    private String tipoImovel;

    @NotNull(message = "A área construída deve ser informada.")
    @Min(value = 1, message = "A área construída deve ser maior que zero.")
    private Double areaConstruidaM2;

    @NotBlank(message = "O domínio atual é obrigatório (PUBLICO ou PRIVADO).")
    private String dominioAtual;
}
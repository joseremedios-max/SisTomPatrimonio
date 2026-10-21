package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RelatoInconsistenciaDTO {
    @NotBlank
    private String bemId;
    @NotBlank
    @Email
    private String contato;
    @NotBlank
    private String descricao;
}

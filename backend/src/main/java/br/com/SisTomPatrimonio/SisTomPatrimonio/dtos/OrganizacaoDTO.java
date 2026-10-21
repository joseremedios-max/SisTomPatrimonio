package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class OrganizacaoDTO {
    private UUID id;
    @NotBlank
    private String nome;
    private String sigla;
    private String tipo;
    private String esfera;
    private String cnpj;
    private String email;
    private String telefone;
    private Boolean ativo;
}

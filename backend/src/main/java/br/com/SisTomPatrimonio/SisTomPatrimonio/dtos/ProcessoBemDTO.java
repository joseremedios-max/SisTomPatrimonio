package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ProcessoBemDTO {
    @NotNull
    private UUID bemId;
    private String papelDoBem;
    private String impactoConservacao;
    private String observacao;
}

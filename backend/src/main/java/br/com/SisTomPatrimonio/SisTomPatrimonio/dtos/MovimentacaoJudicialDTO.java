package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record MovimentacaoJudicialDTO(
        UUID id,
        @NotNull LocalDate dataMovimentacao,
        @NotBlank String descricao,
        String observacao) {
}

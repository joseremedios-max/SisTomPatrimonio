package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record EventoBemDTO(
    UUID id,
    @NotNull UUID bemCulturalId,
    @NotNull EventoTipo tipo,
    @NotBlank String titulo,
    String descricao,
    @NotNull LocalDate dataInicio,
    LocalDate dataFim,
    @NotNull UUID responsavelId
) {}
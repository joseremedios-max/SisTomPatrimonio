package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalvaguardaDTO {

    private UUID id;

    @NotNull(message = "O ID do bem cultural é obrigatório")
    private UUID bemCulturalId;

    @NotBlank(message = "O plano de ação é obrigatório")
    private String planoAcao;

    @NotNull(message = "O status da salvaguarda é obrigatório")
    private StatusSalvaguarda status;

    private LocalDate dataInicio;

    private LocalDate dataPrevisaoFim;

    private LocalDate dataConclusao;

    @NotNull(message = "O ID do responsável é obrigatório")
    private UUID responsavelId;
}
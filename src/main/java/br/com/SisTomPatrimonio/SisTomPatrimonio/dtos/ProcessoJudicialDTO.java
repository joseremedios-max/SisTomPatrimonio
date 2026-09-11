package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessoJudicialDTO {

    private UUID id;

    @NotBlank(message = "O número do processo é obrigatório")
    @Size(max = 100, message = "O número do processo não pode ultrapassar 100 caracteres")
    private String numeroProcesso;

    @NotBlank(message = "O tribunal é obrigatório")
    @Size(max = 150, message = "O tribunal não pode ultrapassar 150 caracteres")
    private String tribunal;

    @Size(max = 150, message = "A vara/comarca não pode ultrapassar 150 caracteres")
    private String varaComarca;

    @NotNull(message = "A fase do processo judicial é obrigatória")
    private FaseProcessoJudicial fase;

    private LocalDate dataDistribuicao;

    private String assunto;
}
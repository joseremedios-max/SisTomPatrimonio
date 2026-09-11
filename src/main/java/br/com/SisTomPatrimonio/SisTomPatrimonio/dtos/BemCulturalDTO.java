package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BemCulturalDTO {

    private UUID id;

    @NotBlank(message = "O código do tombo é obrigatório")
    @Size(max = 50, message = "O código do tombo deve ter no máximo 50 caracteres")
    private String codigoTombo;

    @NotBlank(message = "A denominação do bem é obrigatória")
    @Size(max = 200, message = "A denominação deve ter no máximo 200 caracteres")
    private String denominacao;

    private String descricao;

    @NotNull(message = "A natureza do bem é obrigatória")
    private NaturezaBem natureza;

    @NotNull(message = "O status do bem é obrigatório")
    private StatusBemCultural status;

    @NotNull(message = "O ID do município é obrigatório")
    private UUID municipioId;
}
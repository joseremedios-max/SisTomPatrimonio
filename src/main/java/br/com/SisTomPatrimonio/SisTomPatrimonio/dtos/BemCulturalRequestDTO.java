package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
public class BemCulturalRequestDTO {

    @NotBlank(message = "O código é obrigatório.")
    private String codigo;

    @NotNull(message = "A natureza do bem é obrigatória.")
    private NaturezaBem natureza;

    @NotBlank(message = "O nome do bem é obrigatório.")
    private String nome;

    private String resumoPublico;
    private String descricao;
    private String observacoesInternas;

    @NotNull(message = "A organização responsável é obrigatória.")
    private UUID organizacaoResponsavelId;

    // Atributos de Imóveis
    private String tipoImovel;
    private String tipologiaArquitetonica;
    private BigDecimal areaConstruidaM2;

    // Localização Espacial
    private Double latitude;
    private Double longitude;
    private String logradouro;
    private String numero;
    private String bairro;
    private UUID municipioId;

    // Dados Semiestruturados Flexíveis
    private Map<String, Object> dadosEspecificos;
}
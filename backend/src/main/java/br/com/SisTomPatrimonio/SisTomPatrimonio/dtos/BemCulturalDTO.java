package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BemCulturalDTO {

    @NotBlank(message = "O nome do bem cultural é obrigatório.")
    @Size(max = 255)
    private String nome;

    @NotNull(message = "A natureza do patrimônio deve ser informada.")
    private NaturezaBem natureza; // MATERIAL_EDIFICADO, IMATERIAL, ARQUEOLOGICO

    @NotBlank(message = "A classificação de acesso é obrigatória.")
    private String classificacao; 

    @Valid
    @NotNull(message = "Os dados específicos da natureza do bem são obrigatórios.")
    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME, 
        include = JsonTypeInfo.As.EXTERNAL_PROPERTY, 
        property = "natureza" // O Jackson olha para o campo "natureza" para saber qual DTO instanciar
    )
    @JsonSubTypes({
        @JsonSubTypes.Type(value = DadosMaterialEdificadoDTO.class, name = "MATERIAL_EDIFICADO"),
        @JsonSubTypes.Type(value = DadosImaterialDTO.class, name = "IMATERIAL"),
        @JsonSubTypes.Type(value = DadosArqueologicoDTO.class, name = "ARQUEOLOGICO")
    })
    private DadosEspecificosDTO dadosEspecificos;

    // Getters e Setters...
}
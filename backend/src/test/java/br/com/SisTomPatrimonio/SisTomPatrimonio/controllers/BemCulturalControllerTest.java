package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.BemCulturalService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class BemCulturalControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BemCulturalService bemCulturalService;

    @Test
    @DisplayName("Deve registrar um Bem Cultural Imaterial via POST com JSONB e retornar HTTP 201")
    void deveCriarBemCulturalImaterialComSucesso() throws Exception {
        String payloadJson = """
            {
                "nome": "Tambor de Crioula",
                "natureza": "IMATERIAL",
                "classificacao": "PUBLICA",
                "dadosEspecificos": {
                    "categoriaImaterial": "Expressões Artísticas",
                    "contextoPratica": "Rodas tradicionais de tambor em São Luís"
                }
            }
            """;

        BemCultural mockEntity = new BemCultural();
        mockEntity.setNome("Tambor de Crioula");
        mockEntity.setNatureza(NaturezaBem.IMATERIAL);

        when(bemCulturalService.criar(any())).thenReturn(mockEntity);

        mockMvc.perform(post("/api/bens")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Tambor de Crioula"))
                .andExpect(jsonPath("$.natureza").value("IMATERIAL"));
    }

    @Test
    @DisplayName("Deve retornar HTTP 400 Bad Request ao omitir campos obrigatórios")
    void deveRetornarBadRequestQuandoPayloadInvalido() throws Exception {
        String payloadInvalidoJson = """
            {
                "natureza": "MATERIAL_EDIFICADO"
            }
            """;

        mockMvc.perform(post("/api/bens")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadInvalidoJson))
                .andExpect(status().isBadRequest());
    }
}
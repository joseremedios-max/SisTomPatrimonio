package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalRequestDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.BemCulturalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BemCulturalController.class)
@AutoConfigureMockMvc(addFilters = false)
class BemCulturalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BemCulturalService bemCulturalService;

    @Test
    @DisplayName("Deve responder HTTP 201 Created ao cadastrar bem cultural valido")
    void deveRetornarCreatedAoCadastrar() throws Exception {
        UUID usuarioId = UUID.randomUUID();
        UUID bemId = UUID.randomUUID();

        BemCulturalRequestDTO request = new BemCulturalRequestDTO();
        request.setCodigo("BEM-200");
        request.setNome("Palácio Governamental");
        request.setNatureza(NaturezaBem.MATERIAL_EDIFICADO);
        request.setOrganizacaoResponsavelId(UUID.randomUUID());

        BemCulturalResponseDTO response = BemCulturalResponseDTO.builder()
                .id(bemId)
                .codigo("BEM-200")
                .nome("Palácio Governamental")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO)
                .status(StatusBemCultural.RASCUNHO)
                .build();

        when(bemCulturalService.cadastrarBem(any(BemCulturalRequestDTO.class), eq(usuarioId))).thenReturn(response);

        mockMvc.perform(post("/api/v1/bens-culturais")
                        .header("X-Usuario-Id", usuarioId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(bemId.toString()))
                .andExpect(jsonPath("$.codigo").value("BEM-200"))
                .andExpect(jsonPath("$.status").value("RASCUNHO"));
    }

    @Test
    @DisplayName("Deve rejeitar cadastro sem nome")
    void deveRetornarBadRequestQuandoNomeNaoInformado() throws Exception {
        BemCulturalRequestDTO request = new BemCulturalRequestDTO();
        request.setCodigo("BEM-201");
        request.setNatureza(NaturezaBem.MATERIAL_EDIFICADO);
        request.setOrganizacaoResponsavelId(UUID.randomUUID());

        mockMvc.perform(post("/api/v1/bens-culturais")
                        .header("X-Usuario-Id", UUID.randomUUID().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(bemCulturalService);
    }

    @Test
    @DisplayName("Deve rejeitar cadastro sem o identificador do usuario")
    void deveRetornarBadRequestQuandoHeaderDoUsuarioNaoInformado() throws Exception {
        BemCulturalRequestDTO request = criarRequestValido("BEM-203", "Museu Historico");

        mockMvc.perform(post("/api/v1/bens-culturais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(bemCulturalService);
    }

    @Test
    @DisplayName("Deve rejeitar cadastro com identificador de usuario invalido")
    void deveRetornarBadRequestQuandoHeaderDoUsuarioForInvalido() throws Exception {
        BemCulturalRequestDTO request = criarRequestValido("BEM-204", "Arquivo Historico");

        mockMvc.perform(post("/api/v1/bens-culturais")
                        .header("X-Usuario-Id", "usuario-invalido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(bemCulturalService);
    }

    @Test
    @DisplayName("Deve buscar bens culturais por proximidade")
    void deveBuscarPorProximidade() throws Exception {
        BemCulturalResponseDTO response = BemCulturalResponseDTO.builder()
                .id(UUID.randomUUID())
                .codigo("BEM-202")
                .nome("Casa Histórica")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO)
                .status(StatusBemCultural.PUBLICADO)
                .build();

        when(bemCulturalService.buscarPorProximidade(eq(-2.53), eq(-44.30), eq(250.0), any()))
                .thenReturn(new PageImpl<>(List.of(response), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/api/v1/bens-culturais/proximidade")
                        .param("latitude", "-2.53")
                        .param("longitude", "-44.30")
                        .param("raioMetros", "250"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].codigo").value("BEM-202"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(bemCulturalService).buscarPorProximidade(eq(-2.53), eq(-44.30), eq(250.0), any());
    }

    private BemCulturalRequestDTO criarRequestValido(String codigo, String nome) {
        BemCulturalRequestDTO request = new BemCulturalRequestDTO();
        request.setCodigo(codigo);
        request.setNome(nome);
        request.setNatureza(NaturezaBem.MATERIAL_EDIFICADO);
        request.setOrganizacaoResponsavelId(UUID.randomUUID());
        return request;
    }
}
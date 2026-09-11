package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class ProcessoJudicialControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve cadastrar um novo processo judicial")
    void deveCadastrarProcessoJudicial() throws Exception {
        ProcessoJudicialDTO dto = new ProcessoJudicialDTO(
                null,
                "PROC-2026-9988",
                "Tribunal de Justiça do Maranhão",
                null,
                FaseProcessoJudicial.INICIAL,
                null,
                "Ação de Desapropriação e Conservação"
        );

        mockMvc.perform(post("/api/processos-judiciais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.numeroProcesso").value("PROC-2026-9988"));
    }

    @Test
    @DisplayName("Deve listar todos os processos judiciais")
    void deveListarProcessosJudiciais() throws Exception {
        mockMvc.perform(get("/api/processos-judiciais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
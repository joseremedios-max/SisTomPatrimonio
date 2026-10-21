package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.EventoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class EventoBemControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BemCulturalRepository bemCulturalRepository;

        @Autowired
        private OrganizacaoRepository organizacaoRepository;

        @Autowired
        private UsuarioRepository usuarioRepository;

    @Test
    @DisplayName("Deve criar um evento com sucesso para um bem cultural existente")
    void deveCriarEventoComSucesso() throws Exception {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder().nome("SECMA").build());
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Usuário de teste")
                .email("evento-criacao@example.com")
                .senha("senha")
                .perfil(PerfilUsuario.ADMIN)
                .organizacao(organizacao)
                .build());
        BemCultural bem = bemCulturalRepository.save(BemCultural.builder()
                .codigo("PAT-EVT-01")
                .nome("Igreja Matriz")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO.name())
                .status(StatusBemCultural.APROVADO.name())
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        EventoBemDTO dto = new EventoBemDTO(
                null,
                bem.getId(),
                EventoTipo.INSPECAO,
                "Vistoria anual de estrutura",
                "Avaliação de rachaduras",
                LocalDate.now(),
                LocalDate.now().plusDays(1),
                usuario.getId()
        );

        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.titulo").value("Vistoria anual de estrutura"));
    }

    @Test
    @DisplayName("Deve listar eventos por id do bem cultural")
    void deveListarEventosPorBem() throws Exception {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder().nome("SECMA").build());
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Usuário de teste")
                .email("evento-listagem@example.com")
                .senha("senha")
                .perfil(PerfilUsuario.ADMIN)
                .organizacao(organizacao)
                .build());
        BemCultural bem = bemCulturalRepository.save(BemCultural.builder()
                .codigo("PAT-EVT-02")
                .nome("Teatro Municipal")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO.name())
                .status(StatusBemCultural.APROVADO.name())
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        mockMvc.perform(get("/api/eventos/bem/" + bem.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
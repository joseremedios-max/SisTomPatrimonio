package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.SalvaguardaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda;
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
class SalvaguardaControllerTest extends AbstractIntegrationTest {

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
    @DisplayName("Deve criar um plano de salvaguarda com sucesso")
    void deveCriarSalvaguarda() throws Exception {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder().nome("SECMA").build());
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Usuário de teste")
                .email("salvaguarda-criacao@example.com")
                .senha("senha")
                .perfil(PerfilUsuario.ADMIN)
                .organizacao(organizacao)
                .build());
        BemCultural bem = bemCulturalRepository.save(BemCultural.builder()
                .codigo("PAT-SLV-01")
                .nome("Bumba Meu Boi")
                .natureza(NaturezaBem.IMATERIAL.name())
                .status(StatusBemCultural.APROVADO.name())
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        SalvaguardaDTO dto = new SalvaguardaDTO(
                null,
                bem.getId(),
                "Plano de Apoio aos Grupos Tradicionais",
                StatusSalvaguarda.EM_EXECUCAO,
                LocalDate.now(),
                LocalDate.now().plusYears(1),
                null,
                usuario.getId()
        );

        mockMvc.perform(post("/api/salvaguardas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.planoAcao").value("Plano de Apoio aos Grupos Tradicionais"));
    }

    @Test
    @DisplayName("Deve listar planos de salvaguarda por bem cultural")
    void deveListarSalvaguardasPorBem() throws Exception {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder().nome("SECMA").build());
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Usuário de teste")
                .email("salvaguarda-listagem@example.com")
                .senha("senha")
                .perfil(PerfilUsuario.ADMIN)
                .organizacao(organizacao)
                .build());
        BemCultural bem = bemCulturalRepository.save(BemCultural.builder()
                .codigo("PAT-SLV-02")
                .nome("Tambor de Crioula")
                .natureza(NaturezaBem.IMATERIAL.name())
                .status(StatusBemCultural.APROVADO.name())
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        mockMvc.perform(get("/api/salvaguardas/bem/" + bem.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
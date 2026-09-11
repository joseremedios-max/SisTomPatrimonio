package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.UUID;

/**
 * Teste de Unidade dos Endpoints REST do UsuarioController.
 * Utiliza o MockMvc para simular chamadas HTTP e validar status de resposta sem iniciar o servidor web.
 */
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@WebMvcTest(controllers = UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false) // Desabilita filtros de segurança para isolar os testes do controller
public class UsuarioControllerTest {

    static final String API = "/api/usuarios";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UsuarioService service;

    @Test
    public void deveSalvarUsuarioComSucesso() throws Exception {
        // Cenário
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        Usuario usuarioSalvoMock = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .build();

        Mockito.when(service.salvar(Mockito.any(Usuario.class))).thenReturn(usuarioSalvoMock);

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        // Ação e Verificação
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(usuarioSalvoMock.getId().toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.nome").value("Perito Ana"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("ana@secma.ma.gov.br"));
    }

    @Test
    public void deveRetornarBadRequestQuandoSalvarComEmailDuplicado() throws Exception {
        // Cenário
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        Mockito.when(service.salvar(Mockito.any(Usuario.class)))
                .thenThrow(new RegraNegocioRunTime("Já existe um usuário cadastrado com este e-mail."));

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        // Ação e Verificação
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string("Já existe um usuário cadastrado com este e-mail."));
    }

    @Test
    public void deveAutenticarUsuarioComSucesso() throws Exception {
        // Cenário
        UsuarioDTO dto = UsuarioDTO.builder()
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .build();

        Usuario usuarioAutenticadoMock = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .build();

        Mockito.when(service.efetuarLogin("ana@secma.ma.gov.br", "123456"))
                .thenReturn(usuarioAutenticadoMock);

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        // Ação e Verificação
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API + "/autenticar")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("ana@secma.ma.gov.br"));
    }
}

package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.GlobalExceptionHandler;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
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
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.UUID;

@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@WebMvcTest(controllers = UsuarioController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class UsuarioControllerTest {

    static final String API = "/api/usuarios";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UsuarioService service;

    @Test
    public void deveSalvarUsuarioComSucesso() throws Exception {
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        UsuarioResponseDTO responseMock = UsuarioResponseDTO.builder()
                .id(UUID.randomUUID())
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .build();

        Mockito.when(service.cadastrar(Mockito.any(UsuarioDTO.class))).thenReturn(responseMock);

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(responseMock.getId().toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.nome").value("Perito Ana"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("ana@secma.ma.gov.br"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.senha").doesNotExist());
    }

    @Test
    public void deveRetornarUnprocessableEntityQuandoSalvarComEmailDuplicado() throws Exception {
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        Mockito.when(service.cadastrar(Mockito.any(UsuarioDTO.class)))
                .thenThrow(new RegraNegocioRunTime("Já existe um usuário cadastrado com este e-mail."));

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Violação de Regra de Negócio"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.detail").value("Já existe um usuário cadastrado com este e-mail."));
    }

    @Test
    public void deveAutenticarUsuarioComSucesso() throws Exception {
        UsuarioDTO dto = UsuarioDTO.builder()
                .email("ana@secma.ma.gov.br")
                .senha("123456")
                .build();

        UsuarioResponseDTO responseMock = UsuarioResponseDTO.builder()
                .id(UUID.randomUUID())
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .build();

        Mockito.when(service.efetuarLogin("ana@secma.ma.gov.br", "123456"))
                .thenReturn(responseMock);

        String jsonPayload = new ObjectMapper().writeValueAsString(dto);

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
                .post(API + "/autenticar")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload);

        mvc.perform(request)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("ana@secma.ma.gov.br"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.senha").doesNotExist());
    }
}

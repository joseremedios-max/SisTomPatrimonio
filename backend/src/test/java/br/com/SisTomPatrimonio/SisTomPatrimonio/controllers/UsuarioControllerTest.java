package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.GlobalExceptionHandler;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
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

    @MockitoBean
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
    public void deveAutenticarUsuarioComSucessoEEmitirCookieHttpOnly() throws Exception {
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
                .token("access-token-memoria")
                .refreshToken("refresh-token-httponly")
                .refreshExpiresIn(28800L)
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
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.SET_COOKIE,
                        Matchers.allOf(
                                Matchers.containsString("sipma_refresh_token=refresh-token-httponly"),
                                Matchers.containsString("HttpOnly"),
                                Matchers.containsString("SameSite=Strict"))))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("ana@secma.ma.gov.br"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").value("access-token-memoria"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.refreshToken").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.senha").doesNotExist());
    }

    @Test
    public void deveRenovarSessaoViaCookieHttpOnly() throws Exception {
        UsuarioResponseDTO responseMock = UsuarioResponseDTO.builder()
                .id(UUID.randomUUID())
                .nome("Perito Ana")
                .email("ana@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .token("novo-access-token")
                .refreshToken("novo-refresh-token")
                .refreshExpiresIn(28800L)
                .build();

        Mockito.when(service.renovarSessao("cookie-refresh-valido")).thenReturn(responseMock);

        mvc.perform(MockMvcRequestBuilders.post(API + "/refresh")
                        .cookie(new Cookie(UsuarioController.REFRESH_COOKIE_NAME, "cookie-refresh-valido")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.SET_COOKIE,
                        Matchers.containsString("sipma_refresh_token=novo-refresh-token")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").value("novo-access-token"));
    }
}

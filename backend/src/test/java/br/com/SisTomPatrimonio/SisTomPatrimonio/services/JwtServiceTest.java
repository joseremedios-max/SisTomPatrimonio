package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private final JwtService service = new JwtService(
            "test-secret-with-at-least-32-characters", Duration.ofMinutes(15), Duration.ofHours(8));

    @Test
    void deveGerarEValidarTokenComPerfil() {
        Usuario usuario = Usuario.builder()
                .id(UUID.randomUUID()).email("tecnico@sipma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO).build();

        Claims claims = service.validar(service.gerarToken(usuario));

        assertEquals(usuario.getId(), service.extrairUsuarioId(claims));
        assertEquals("TECNICO", service.extrairPerfil(claims));
        assertFalse(service.isRefreshToken(claims));
    }

    @Test
    void deveGerarEValidarRefreshToken() {
        Usuario usuario = Usuario.builder()
                .id(UUID.randomUUID()).email("admin@sipma.ma.gov.br")
                .perfil(PerfilUsuario.ADMIN).build();

        Claims claims = service.validar(service.gerarRefreshToken(usuario));

        assertEquals(usuario.getId(), service.extrairUsuarioId(claims));
        assertTrue(service.isRefreshToken(claims));
        assertEquals(28800L, service.getRefreshExpirationSeconds());
    }

    @Test
    void deveRejeitarTokenAlterado() {
        Usuario usuario = Usuario.builder()
                .id(UUID.randomUUID()).email("admin@sipma.ma.gov.br")
                .perfil(PerfilUsuario.ADMIN).build();
        String token = service.gerarToken(usuario);

        assertThrows(RuntimeException.class, () -> service.validar(token + "invalid"));
    }
}

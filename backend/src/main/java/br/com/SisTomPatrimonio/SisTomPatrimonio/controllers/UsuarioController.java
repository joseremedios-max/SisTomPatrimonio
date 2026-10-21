package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.UsuarioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    public static final String REFRESH_COOKIE_NAME = "sipma_refresh_token";
    private static final long DEFAULT_REFRESH_MAX_AGE = 28800L;

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> salvar(@RequestBody UsuarioDTO dto) {
        UsuarioResponseDTO salvo = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/autenticar")
    public ResponseEntity<UsuarioResponseDTO> autenticar(@RequestBody UsuarioDTO dto) {
        UsuarioResponseDTO autenticado = service.efetuarLogin(dto.getEmail(), dto.getSenha());
        long maxAge = autenticado.getRefreshExpiresIn() != null
                ? autenticado.getRefreshExpiresIn()
                : DEFAULT_REFRESH_MAX_AGE;
        ResponseCookie cookie = criarCookieRefresh(autenticado.getRefreshToken(), maxAge);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(autenticado);
    }

    @PostMapping("/refresh")
    public ResponseEntity<UsuarioResponseDTO> refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken) {
        UsuarioResponseDTO renovado = service.renovarSessao(refreshToken);
        long maxAge = renovado.getRefreshExpiresIn() != null
                ? renovado.getRefreshExpiresIn()
                : DEFAULT_REFRESH_MAX_AGE;
        ResponseCookie cookie = criarCookieRefresh(renovado.getRefreshToken(), maxAge);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(renovado);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = criarCookieRefresh("", 0L);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    private ResponseCookie criarCookieRefresh(String refreshToken, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken != null ? refreshToken : "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/usuarios")
                .maxAge(maxAgeSeconds)
                .build();
    }
}

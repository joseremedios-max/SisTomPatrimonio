package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final Duration expiration;
    private final Duration refreshExpiration;

    public JwtService(String secret, Duration expiration) {
        this(secret, expiration, Duration.ofHours(8));
    }

    @Autowired
    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration:PT15M}") Duration expiration,
            @Value("${security.jwt.refresh-expiration:PT8H}") Duration refreshExpiration) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("security.jwt.secret deve possuir pelo menos 32 caracteres.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String gerarToken(Usuario usuario) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("perfil", usuario.getPerfil().name())
                .claim("type", "access")
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(expiration)))
                .signWith(signingKey)
                .compact();
    }

    public String gerarRefreshToken(Usuario usuario) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("perfil", usuario.getPerfil().name())
                .claim("type", "refresh")
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(refreshExpiration)))
                .signWith(signingKey)
                .compact();
    }

    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isRefreshToken(Claims claims) {
        return "refresh".equals(claims.get("type", String.class));
    }

    public UUID extrairUsuarioId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public String extrairPerfil(Claims claims) {
        return claims.get("perfil", String.class);
    }

    public long getExpirationSeconds() {
        return expiration.toSeconds();
    }

    public long getRefreshExpirationSeconds() {
        return refreshExpiration.toSeconds();
    }
}

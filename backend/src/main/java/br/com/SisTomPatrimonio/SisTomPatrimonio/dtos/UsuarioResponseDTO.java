package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {
    private UUID id;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private Boolean ativo;
    private OffsetDateTime criadoEm;
    private OffsetDateTime ultimoAcessoEm;
    private String token;
    private Long expiresIn;

    @JsonIgnore
    private String refreshToken;

    @JsonIgnore
    private Long refreshExpiresIn;
}

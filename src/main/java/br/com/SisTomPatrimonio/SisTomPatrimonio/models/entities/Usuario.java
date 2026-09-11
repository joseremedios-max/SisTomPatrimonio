package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import lombok.*;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Entidade JPA que representa os usuários (servidores, peritos ou auditores) do SIP-MA.
 * Mapeado com integridade referencial, identificadores universais UUID, fuso horário timestamptz
 * e suporte a verificação declarativa de 2FA.
 */
@Entity
@Table(name = "usuario")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"senha", "organizacao"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "nome", nullable = false, columnDefinition = "TEXT")
    private String nome;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @JsonIgnore // Oculta a senha em serializações JSON para segurança de dados [4]
    @Column(name = "senha", nullable = false, length = 256)
    private String senha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizacao_id", foreignKey = @ForeignKey(name = "usuario_organizacao_id_fkey"))
    private Organizacao organizacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 30)
    private PerfilUsuario perfil;

    @Column(name = "registro_professional", length = 100)
    private String registroProfessional;

    @Builder.Default
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Builder.Default
    @Column(name = "dois_fatores", nullable = false)
    private Boolean doisFatores = false;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();

    @Column(name = "ultimo_acesso_em")
    private OffsetDateTime ultimoAcessoEm;

    /**
     * Atualiza o registro de auditoria temporal de acesso toda vez que o login é efetuado.
     */
    public void registrarAcesso() {
        this.ultimoAcessoEm = OffsetDateTime.now();
    }
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entidade JPA que representa uma Organização ou Órgão Governamental responsável pela salvaguarda (ex: SECMA, IPHAN) [3, 5].
 * Mantém a associação um-para-muitos com usuários e bens culturais sob sua tutela administrativa [3].
 */
@Entity
@Table(name = "organizacao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"usuarios", "bensCulturais"})
public class Organizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "nome", nullable = false, columnDefinition = "TEXT")
    private String nome;

    @Column(name = "sigla", length = 30)
    private String sigla;

    @Column(name = "tipo", length = 40)
    private String tipo;

    @Column(name = "esfera", length = 20)
    private String esfera;

    @Column(name = "cnpj", unique = true, length = 14)
    private String cnpj;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Builder.Default
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();

    // Associação Bidirecional Um-para-Muitos com Usuários [3]
    @Builder.Default
    @OneToMany(mappedBy = "organizacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Usuario> usuarios = new ArrayList<>();

    // Associação Bidirecional Um-para-Muitos com Bens Culturais [3]
    @Builder.Default
    @OneToMany(mappedBy = "organizacaoResponsavel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BemCultural> bensCulturais = new ArrayList<>();
}
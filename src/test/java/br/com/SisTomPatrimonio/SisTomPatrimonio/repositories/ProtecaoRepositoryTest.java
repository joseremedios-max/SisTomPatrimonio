package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Protecao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ProtecaoRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private ProtecaoRepository protecaoRepository;

    @Autowired
    private BemCulturalRepository bemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

        @Autowired
        private OrganizacaoRepository organizacaoRepository;

    @Test
    @DisplayName("Deve buscar processos de protecao vigentes por Bem Cultural")
    void deveBuscarProtecaoVigente() {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder()
                .nome("IPHAN")
                .tipo("GOVERNO")
                .esfera("FEDERAL")
                .ativo(true)
                .build());

        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Admin")
                .email("admin@test.com")
                .senha("123")
                .perfil(PerfilUsuario.ADMIN)
                .organizacao(organizacao)
                .build());

        BemCultural bem = bemRepository.save(BemCultural.builder()
                .codigo("BEM-001")
                .nome("Igreja Matriz")
                .natureza("MATERIAL_EDIFICADO")
                .status("PUBLICADO")
                .classificacao("PUBLICA")
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        Protecao protecao = Protecao.builder()
                .bem(bem)
                .numeroProcesso("PROC-2026/001")
                .esfera("ESTADUAL")
                .fase("HOMOLOGADO")
                .vigente(true)
                .dataAbertura(LocalDate.now())
                .build();

        protecaoRepository.save(protecao);

        List<Protecao> vigentes = protecaoRepository.findByBemIdAndVigenteTrue(bem.getId());
        Optional<Protecao> porProcesso = protecaoRepository.findByNumeroProcesso("PROC-2026/001");

        assertThat(vigentes).hasSize(1);
        assertThat(porProcesso).isPresent();
        assertThat(porProcesso.get().getEsfera()).isEqualTo("ESTADUAL");
    }
}
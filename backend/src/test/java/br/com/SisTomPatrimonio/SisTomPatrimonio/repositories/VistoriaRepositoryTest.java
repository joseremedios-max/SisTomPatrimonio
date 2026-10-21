package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Vistoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class VistoriaRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private VistoriaRepository vistoriaRepository;

    @Autowired
    private BemCulturalRepository bemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

        @Autowired
        private OrganizacaoRepository organizacaoRepository;

    @Test
    @DisplayName("Deve listar vistorias por bem cultural ordenadas por data de agendamento")
    void deveListarVistoriasPorBem() {
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder()
                .nome("SECMA")
                .tipo("ESTADUAL")
                .esfera("ESTADUAL")
                .ativo(true)
                .build());

        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome("Fiscal")
                .email("fiscal@test.com")
                .senha("123")
                .perfil(PerfilUsuario.TECNICO)
                .organizacao(organizacao)
                .build());

        BemCultural bem = bemRepository.save(BemCultural.builder()
                .codigo("BEM-002")
                .nome("Teatro Municipal")
                .natureza("MATERIAL_EDIFICADO")
                .status("PUBLICADO")
                .classificacao("PUBLICA")
                .organizacaoResponsavel(organizacao)
                .criadoPor(usuario)
                .atualizadoPor(usuario)
                .build());

        Vistoria v1 = Vistoria.builder()
                .codigo("VIS-001")
                .bem(bem)
                .status("REALIZADA")
                .agendadaEm(OffsetDateTime.now().minusDays(10))
                .build();

        Vistoria v2 = Vistoria.builder()
                .codigo("VIS-002")
                .bem(bem)
                .status("PLANEJADA")
                .agendadaEm(OffsetDateTime.now().plusDays(5))
                .build();

        vistoriaRepository.saveAll(List.of(v1, v2));

        List<Vistoria> vistorias = vistoriaRepository.findByBemIdOrderByAgendadaEmDesc(bem.getId());

        assertThat(vistorias).hasSize(2);
        assertThat(vistorias.get(0).getCodigo()).isEqualTo("VIS-002");
    }
}
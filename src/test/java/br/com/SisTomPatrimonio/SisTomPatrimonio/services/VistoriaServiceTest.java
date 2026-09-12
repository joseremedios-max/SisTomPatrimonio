package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.VistoriaDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Vistoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusVistoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.VistoriaRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class VistoriaServiceTest {

    @InjectMocks
    private VistoriaService service;

    @Mock
    private VistoriaRepository vistoriaRepository;

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private OrganizacaoRepository organizacaoRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private UUID bemId;
    private UUID responsavelId;
    private UUID organizacaoId;
    private UUID vistoriaId;
    private BemCultural bemMock;
    private Usuario responsavelMock;
    private Organizacao organizacaoMock;

    @BeforeEach
    void setup() {
        bemId = UUID.randomUUID();
        responsavelId = UUID.randomUUID();
        organizacaoId = UUID.randomUUID();
        vistoriaId = UUID.randomUUID();

        bemMock = BemCultural.builder()
                .id(bemId)
                .codigo("BEM-001")
                .nome("Teatro Arthur Azevedo")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO.name())
                .status("PUBLICADO")
                .build();

        responsavelMock = Usuario.builder()
                .id(responsavelId)
                .nome("Engenheiro Roberto")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        organizacaoMock = Organizacao.builder()
                .id(organizacaoId)
                .nome("SECMA")
                .build();
    }

    @Test
    @DisplayName("Deve criar vistoria com sucesso definindo status PLANEJADA")
    public void deveCriarVistoriaComSucesso() {
        VistoriaDTOs.Request request = VistoriaDTOs.Request.builder()
                .codigo("VIS-2026-001")
                .bemId(bemId)
                .responsavelId(responsavelId)
                .organizacaoId(organizacaoId)
                .agendadaEm(OffsetDateTime.now().plusDays(10))
                .situacaoConservacao("BOM")
                .nivelRisco("BAIXO")
                .resumo("Vistoria periódica preventiva.")
                .recomendacao("Manutenção ordinária das calhas.")
                .equipe(Map.of("coordenador", "Roberto"))
                .patologias(Map.of("infiltracao", "leve"))
                .build();

        Vistoria vistoriaSalva = Vistoria.builder()
                .id(vistoriaId)
                .codigo(request.getCodigo())
                .bem(bemMock)
                .responsavel(responsavelMock)
                .organizacao(organizacaoMock)
                .status(StatusVistoria.PLANEJADA.name())
                .agendadaEm(request.getAgendadaEm())
                .situacaoConservacao(request.getSituacaoConservacao())
                .nivelRisco(request.getNivelRisco())
                .homologada(false)
                .criadoEm(OffsetDateTime.now())
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(usuarioRepository.findById(responsavelId)).thenReturn(Optional.of(responsavelMock));
        Mockito.when(organizacaoRepository.findById(organizacaoId)).thenReturn(Optional.of(organizacaoMock));
        Mockito.when(vistoriaRepository.save(any(Vistoria.class))).thenReturn(vistoriaSalva);

        VistoriaDTOs.Response response = service.criar(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(vistoriaId, response.getId());
        Assertions.assertEquals("VIS-2026-001", response.getCodigo());
        Assertions.assertEquals("PLANEJADA", response.getStatus());
        Assertions.assertEquals(false, response.getHomologada());
        Assertions.assertEquals("Teatro Arthur Azevedo", response.getBemNome());
        Assertions.assertEquals("Engenheiro Roberto", response.getResponsavelNome());
        verify(vistoriaRepository, times(1)).save(any(Vistoria.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar criar vistoria para bem cultural inexistente")
    public void deveGerarErroAoCriarVistoriaQuandoBemNaoExistir() {
        VistoriaDTOs.Request request = VistoriaDTOs.Request.builder()
                .codigo("VIS-2026-002")
                .bemId(bemId)
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(request);
        });

        Assertions.assertEquals("Bem cultural não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar criar vistoria com responsavel inexistente")
    public void deveGerarErroAoCriarVistoriaQuandoResponsavelNaoExistir() {
        VistoriaDTOs.Request request = VistoriaDTOs.Request.builder()
                .codigo("VIS-2026-003")
                .bemId(bemId)
                .responsavelId(responsavelId)
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(usuarioRepository.findById(responsavelId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(request);
        });

        Assertions.assertEquals("Usuário responsável não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar criar vistoria com organizacao inexistente")
    public void deveGerarErroAoCriarVistoriaQuandoOrganizacaoNaoExistir() {
        VistoriaDTOs.Request request = VistoriaDTOs.Request.builder()
                .codigo("VIS-2026-004")
                .bemId(bemId)
                .organizacaoId(organizacaoId)
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(organizacaoRepository.findById(organizacaoId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(request);
        });

        Assertions.assertEquals("Organização não encontrada.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve listar vistorias ordenadas por data agendada decrescente")
    public void deveListarVistoriasPorBem() {
        Vistoria v1 = Vistoria.builder()
                .id(UUID.randomUUID())
                .codigo("VIS-01")
                .bem(bemMock)
                .status("PLANEJADA")
                .agendadaEm(OffsetDateTime.now())
                .build();

        Mockito.when(vistoriaRepository.findByBemIdOrderByAgendadaEmDesc(bemId)).thenReturn(List.of(v1));

        List<VistoriaDTOs.Response> lista = service.listarPorBem(bemId);

        Assertions.assertEquals(1, lista.size());
        Assertions.assertEquals("VIS-01", lista.get(0).getCodigo());
        Assertions.assertEquals("Teatro Arthur Azevedo", lista.get(0).getBemNome());
    }

    @Test
    @DisplayName("Deve homologar vistoria com status REALIZADA e emitir evento de auditoria")
    public void deveHomologarVistoriaComSucessoEEmitirEventoAuditoria() {
        Usuario homologador = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("Diretora Helena")
                .perfil(PerfilUsuario.ADMIN)
                .build();

        Vistoria vistoriaRealizada = Vistoria.builder()
                .id(vistoriaId)
                .codigo("VIS-2026-HOM")
                .bem(bemMock)
                .responsavel(responsavelMock)
                .status(StatusVistoria.REALIZADA.name())
                .realizadaEm(OffsetDateTime.now().minusDays(1))
                .homologada(false)
                .build();

        Mockito.when(vistoriaRepository.findById(vistoriaId)).thenReturn(Optional.of(vistoriaRealizada));
        Mockito.when(usuarioRepository.findById(homologador.getId())).thenReturn(Optional.of(homologador));
        Mockito.when(vistoriaRepository.save(any(Vistoria.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VistoriaDTOs.Response response = service.homologar(vistoriaId, homologador.getId());

        Assertions.assertNotNull(response);
        Assertions.assertEquals(StatusVistoria.REALIZADA.name(), response.getStatus());
        Assertions.assertTrue(response.getHomologada());
        verify(vistoriaRepository, times(1)).save(any(Vistoria.class));
        verify(eventPublisher, times(1)).publishEvent(any(AuditoriaEvent.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar vistoria inexistente")
    public void deveGerarErroAoHomologarQuandoVistoriaNaoExistir() {
        UUID usuarioId = UUID.randomUUID();
        Mockito.when(vistoriaRepository.findById(vistoriaId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(vistoriaId, usuarioId);
        });

        Assertions.assertEquals("Vistoria não encontrada.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar vistoria com usuario inexistente")
    public void deveGerarErroAoHomologarQuandoHomologadorNaoExistir() {
        UUID usuarioId = UUID.randomUUID();
        Vistoria vistoria = Vistoria.builder().id(vistoriaId).status("REALIZADA").build();

        Mockito.when(vistoriaRepository.findById(vistoriaId)).thenReturn(Optional.of(vistoria));
        Mockito.when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(vistoriaId, usuarioId);
        });

        Assertions.assertEquals("Usuário homologador não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar vistoria que nao esteja com status REALIZADA")
    public void deveGerarErroAoHomologarVistoriaNaoRealizada() {
        Usuario homologador = Usuario.builder().id(UUID.randomUUID()).nome("Diretora").build();
        Vistoria vistoriaPlanejada = Vistoria.builder()
                .id(vistoriaId)
                .status(StatusVistoria.PLANEJADA.name())
                .build();

        Mockito.when(vistoriaRepository.findById(vistoriaId)).thenReturn(Optional.of(vistoriaPlanejada));
        Mockito.when(usuarioRepository.findById(homologador.getId())).thenReturn(Optional.of(homologador));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(vistoriaId, homologador.getId());
        });

        Assertions.assertEquals("Apenas vistorias com status REALIZADA podem ser homologadas.", ex.getMessage());
    }
}

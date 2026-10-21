package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProtecaoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Protecao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProtecaoRepository;
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

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProtecaoServiceTest {

    @InjectMocks
    private ProtecaoService service;

    @Mock
    private ProtecaoRepository protecaoRepository;

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private OrganizacaoRepository organizacaoRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private UUID bemId;
    private UUID orgId;
    private UUID protecaoId;
    private BemCultural bemMock;
    private Organizacao organizacaoMock;

    @BeforeEach
    void setup() {
        bemId = UUID.randomUUID();
        orgId = UUID.randomUUID();
        protecaoId = UUID.randomUUID();

        bemMock = BemCultural.builder()
                .id(bemId)
                .codigo("BEM-PALACIO")
                .nome("Palácio dos Leões")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO.name())
                .status("PUBLICADO")
                .build();

        organizacaoMock = Organizacao.builder()
                .id(orgId)
                .nome("SECMA - Secretaria de Estado da Cultura")
                .build();
    }

    @Test
    @DisplayName("Deve criar processo de protecao em instrucao com sucesso")
    public void deveCriarProcessoProtecaoComSucesso() {
        ProtecaoDTOs.Request request = ProtecaoDTOs.Request.builder()
                .bemId(bemId)
                .numeroProcesso("PROC-TOMB-2026/001")
                .organizacaoId(orgId)
                .esfera("ESTADUAL")
                .fase("EM_INSTRUCAO")
                .tipoProtecao("TOMBAMENTO")
                .dataAbertura(LocalDate.now())
                .observacao("Processo de tombamento estadual.")
                .build();

        Protecao protecaoSalva = Protecao.builder()
                .id(protecaoId)
                .bem(bemMock)
                .numeroProcesso(request.getNumeroProcesso())
                .organizacao(organizacaoMock)
                .esfera(request.getEsfera())
                .fase(request.getFase())
                .tipoProtecao(request.getTipoProtecao())
                .dataAbertura(request.getDataAbertura())
                .vigente(true)
                .criadoEm(OffsetDateTime.now())
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(organizacaoRepository.findById(orgId)).thenReturn(Optional.of(organizacaoMock));
        Mockito.when(protecaoRepository.save(any(Protecao.class))).thenReturn(protecaoSalva);

        ProtecaoDTOs.Response response = service.criar(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(protecaoId, response.getId());
        Assertions.assertEquals("PROC-TOMB-2026/001", response.getNumeroProcesso());
        Assertions.assertEquals("EM_INSTRUCAO", response.getFase());
        Assertions.assertTrue(response.getVigente());
        verify(protecaoRepository, times(1)).save(any(Protecao.class));
        verify(bemCulturalRepository, Mockito.never()).save(any(BemCultural.class));
    }

    @Test
    @DisplayName("Deve criar protecao com fase HOMOLOGADO e atualizar status do bem para TOMBADO")
    public void deveCriarProtecaoHomologadaEAtualizarBemParaTombado() {
        ProtecaoDTOs.Request request = ProtecaoDTOs.Request.builder()
                .bemId(bemId)
                .numeroProcesso("PROC-TOMB-2026/002")
                .esfera("ESTADUAL")
                .fase("HOMOLOGADO")
                .tipoProtecao("TOMBAMENTO")
                .atoNormativo("Decreto 12.345/2026")
                .livroTombo("Livro Histórico")
                .numeroInscricao("Inscr. 42")
                .build();

        Protecao protecaoSalva = Protecao.builder()
                .id(protecaoId)
                .bem(bemMock)
                .numeroProcesso(request.getNumeroProcesso())
                .fase("HOMOLOGADO")
                .vigente(true)
                .criadoEm(OffsetDateTime.now())
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(protecaoRepository.save(any(Protecao.class))).thenReturn(protecaoSalva);

        ProtecaoDTOs.Response response = service.criar(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("HOMOLOGADO", response.getFase());
        Assertions.assertEquals("TOMBADO", bemMock.getStatus());
        verify(bemCulturalRepository, times(1)).save(bemMock);
        verify(protecaoRepository, times(1)).save(any(Protecao.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar criar processo de protecao para bem inexistente")
    public void deveGerarErroAoCriarProtecaoQuandoBemNaoExistir() {
        ProtecaoDTOs.Request request = ProtecaoDTOs.Request.builder()
                .bemId(bemId)
                .numeroProcesso("PROC-003")
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(request);
        });

        Assertions.assertEquals("Bem cultural não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar criar protecao com organizacao inexistente")
    public void deveGerarErroAoCriarProtecaoQuandoOrganizacaoNaoExistir() {
        ProtecaoDTOs.Request request = ProtecaoDTOs.Request.builder()
                .bemId(bemId)
                .organizacaoId(orgId)
                .numeroProcesso("PROC-004")
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(organizacaoRepository.findById(orgId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(request);
        });

        Assertions.assertEquals("Organização não encontrada.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve homologar tombamento com sucesso, atualizar bem para TOMBADO e emitir evento de auditoria")
    public void deveHomologarTombamentoComSucessoEAtualizarBem() {
        UUID usuarioId = UUID.randomUUID();
        Protecao protecaoExistente = Protecao.builder()
                .id(protecaoId)
                .bem(bemMock)
                .numeroProcesso("PROC-TOMB-2026/005")
                .fase("EM_INSTRUCAO")
                .vigente(true)
                .build();

        Mockito.when(protecaoRepository.findById(protecaoId)).thenReturn(Optional.of(protecaoExistente));
        Mockito.when(protecaoRepository.save(any(Protecao.class))).thenAnswer(i -> i.getArgument(0));

        ProtecaoDTOs.Response response = service.homologar(
                protecaoId,
                "Livro das Artes",
                "Registro 88",
                "Folha 12",
                "Decreto Estadual 55/2026",
                usuarioId
        );

        Assertions.assertNotNull(response);
        Assertions.assertEquals("HOMOLOGADO", response.getFase());
        Assertions.assertEquals("TOMBADO", bemMock.getStatus());
        verify(bemCulturalRepository, times(1)).save(bemMock);
        verify(protecaoRepository, times(1)).save(protecaoExistente);
        verify(eventPublisher, times(1)).publishEvent(any(AuditoriaEvent.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar processo de protecao inexistente")
    public void deveGerarErroAoHomologarQuandoProtecaoNaoExistir() {
        UUID usuarioId = UUID.randomUUID();
        Mockito.when(protecaoRepository.findById(protecaoId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(protecaoId, "Livro", "123", "1", "Dec", usuarioId);
        });

        Assertions.assertEquals("Processo de proteção não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar tombamento sem informar Livro do Tombo")
    public void deveGerarErroAoHomologarSemLivroTombo() {
        UUID usuarioId = UUID.randomUUID();
        Protecao protecao = Protecao.builder().id(protecaoId).bem(bemMock).build();
        Mockito.when(protecaoRepository.findById(protecaoId)).thenReturn(Optional.of(protecao));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(protecaoId, "", "123", "1", "Dec", usuarioId);
        });

        Assertions.assertEquals("Livro do Tombo deve ser informado para homologação.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar tombamento sem informar Número de Inscrição")
    public void deveGerarErroAoHomologarSemNumeroInscricao() {
        UUID usuarioId = UUID.randomUUID();
        Protecao protecao = Protecao.builder().id(protecaoId).bem(bemMock).build();
        Mockito.when(protecaoRepository.findById(protecaoId)).thenReturn(Optional.of(protecao));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(protecaoId, "Livro Histórico", null, "1", "Dec", usuarioId);
        });

        Assertions.assertEquals("Número de inscrição deve ser informado para homologação.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar homologar tombamento sem informar Ato Normativo")
    public void deveGerarErroAoHomologarSemAtoNormativo() {
        UUID usuarioId = UUID.randomUUID();
        Protecao protecao = Protecao.builder().id(protecaoId).bem(bemMock).build();
        Mockito.when(protecaoRepository.findById(protecaoId)).thenReturn(Optional.of(protecao));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.homologar(protecaoId, "Livro Histórico", "123", "1", "  ", usuarioId);
        });

        Assertions.assertEquals("Ato normativo deve ser informado para homologação.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve listar processos de protecao por bem cultural")
    public void deveListarProtecoesPorBem() {
        Protecao p1 = Protecao.builder().id(UUID.randomUUID()).bem(bemMock).numeroProcesso("P-1").build();
        Mockito.when(protecaoRepository.findByBemId(bemId)).thenReturn(List.of(p1));

        List<ProtecaoDTOs.Response> lista = service.listarPorBem(bemId);

        Assertions.assertEquals(1, lista.size());
        Assertions.assertEquals("P-1", lista.get(0).getNumeroProcesso());
    }
}

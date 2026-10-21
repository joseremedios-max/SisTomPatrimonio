package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.EventoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.EventoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.EventoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EventoBemServiceTest {

    @InjectMocks
    private EventoBemService service;

    @Mock
    private EventoBemRepository repository;

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    private UUID bemId;
    private UUID responsavelId;
    private UUID eventoId;
    private BemCultural bemMock;
    private Usuario responsavelMock;

    @BeforeEach
    void setup() {
        bemId = UUID.randomUUID();
        responsavelId = UUID.randomUUID();
        eventoId = UUID.randomUUID();

        bemMock = BemCultural.builder()
                .id(bemId)
                .nome("Forte de Santo Antônio da Barra")
                .build();

        responsavelMock = Usuario.builder()
                .id(responsavelId)
                .nome("Historiador Marcos")
                .build();
    }

    @Test
    @DisplayName("Deve registrar evento na linha do tempo com sucesso")
    public void deveCriarEventoHistoricoComSucesso() {
        EventoBemDTO dto = new EventoBemDTO(
                null,
                bemId,
                EventoTipo.INTERVENCAO,
                "Restauração do Portão Principal",
                "Substituição das peças de madeira degradadas por ação de cupins.",
                LocalDate.of(2026, 3, 1),
                LocalDate.of(2026, 5, 1),
                responsavelId
        );

        EventoBem eventoSalvo = EventoBem.builder()
                .id(eventoId)
                .bemCultural(bemMock)
                .tipoEvento(EventoTipo.INTERVENCAO)
                .titulo(dto.titulo())
                .descricao(dto.descricao())
                .dataInicio(dto.dataInicio())
                .dataFim(dto.dataFim())
                .responsavel(responsavelMock)
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(usuarioRepository.findById(responsavelId)).thenReturn(Optional.of(responsavelMock));
        Mockito.when(repository.save(any(EventoBem.class))).thenReturn(eventoSalvo);

        EventoBemDTO resultado = service.criar(dto);

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals(eventoId, resultado.id());
        Assertions.assertEquals("Restauração do Portão Principal", resultado.titulo());
        Assertions.assertEquals(EventoTipo.INTERVENCAO, resultado.tipo());
        verify(repository, times(1)).save(any(EventoBem.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao criar evento quando o bem cultural nao existir")
    public void deveGerarErroAoCriarEventoQuandoBemNaoExistir() {
        EventoBemDTO dto = new EventoBemDTO(
                null,
                bemId,
                EventoTipo.PERDA_DANO,
                "Incêndio parcial",
                null,
                LocalDate.now(),
                null,
                responsavelId
        );

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(dto);
        });

        Assertions.assertEquals("Bem cultural não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro ao criar evento quando o responsavel nao existir")
    public void deveGerarErroAoCriarEventoQuandoResponsavelNaoExistir() {
        EventoBemDTO dto = new EventoBemDTO(
                null,
                bemId,
                EventoTipo.RESTAURO,
                "Escavação preliminar",
                null,
                LocalDate.now(),
                null,
                responsavelId
        );

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(usuarioRepository.findById(responsavelId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(dto);
        });

        Assertions.assertEquals("Responsável não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve listar todos os eventos da linha do tempo vinculados a um bem")
    public void deveListarEventosPorBem() {
        EventoBem e1 = EventoBem.builder()
                .id(UUID.randomUUID())
                .bemCultural(bemMock)
                .tipoEvento(EventoTipo.TOMBAMENTO)
                .titulo("Homologação do Tombamento")
                .responsavel(responsavelMock)
                .build();

        Mockito.when(repository.findByBemCulturalId(bemId)).thenReturn(List.of(e1));

        List<EventoBemDTO> lista = service.listarPorBem(bemId);

        Assertions.assertEquals(1, lista.size());
        Assertions.assertEquals("Homologação do Tombamento", lista.get(0).titulo());
        Assertions.assertEquals(EventoTipo.TOMBAMENTO, lista.get(0).tipo());
    }
}

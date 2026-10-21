package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.SalvaguardaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Salvaguarda;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.SalvaguardaRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SalvaguardaServiceTest {

    @InjectMocks
    private SalvaguardaService service;

    @Mock
    private SalvaguardaRepository repository;

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Test
    @DisplayName("Deve criar plano de salvaguarda para bem cultural IMATERIAL com sucesso")
    public void deveCriarSalvaguardaComSucesso() {
        UUID bemId = UUID.randomUUID();
        UUID responsavelId = UUID.randomUUID();

        BemCultural bemImaterial = BemCultural.builder()
                .id(bemId)
                .codigo("BEM-IMA-01")
                .nome("Tambor de Crioula")
                .natureza(NaturezaBem.IMATERIAL.name())
                .build();

        Usuario responsavel = Usuario.builder()
                .id(responsavelId)
                .nome("Antropóloga Laura")
                .build();

        SalvaguardaDTO dto = new SalvaguardaDTO(
                null,
                bemId,
                "Plano de Transmissão dos Saberes de Percussão",
                StatusSalvaguarda.ATIVO,
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2027, 1, 1),
                null,
                responsavelId
        );

        Salvaguarda salvaguardaSalvaMock = Salvaguarda.builder()
                .id(UUID.randomUUID())
                .bemCultural(bemImaterial)
                .planoAcao(dto.getPlanoAcao())
                .status(StatusSalvaguarda.ATIVO)
                .dataInicio(dto.getDataInicio())
                .dataPrevisaoFim(dto.getDataPrevisaoFim())
                .responsavel(responsavel)
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemImaterial));
        Mockito.when(usuarioRepository.findById(responsavelId)).thenReturn(Optional.of(responsavel));
        Mockito.when(repository.save(any(Salvaguarda.class))).thenReturn(salvaguardaSalvaMock);

        SalvaguardaDTO resultado = service.criar(dto);

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals(salvaguardaSalvaMock.getId(), resultado.getId());
        Assertions.assertEquals("Plano de Transmissão dos Saberes de Percussão", resultado.getPlanoAcao());
        verify(repository, times(1)).save(any(Salvaguarda.class));
        verify(eventPublisher, times(1)).publishEvent(any(AuditoriaEvent.class));
    }

    @Test
    @DisplayName("Deve rejeitar plano de salvaguarda para bem MATERIAL (Regra RN02)")
    public void deveGerarErroAoTentarCriarSalvaguardaParaBemMaterial() {
        UUID bemId = UUID.randomUUID();

        BemCultural bemMaterial = BemCultural.builder()
                .id(bemId)
                .codigo("BEM-MAT-01")
                .nome("Igreja da Sé")
                .natureza(NaturezaBem.MATERIAL_EDIFICADO.name())
                .build();

        SalvaguardaDTO dto = new SalvaguardaDTO(
                null,
                bemId,
                "Plano de Salvaguarda Inválido",
                StatusSalvaguarda.ATIVO,
                LocalDate.now(),
                LocalDate.now().plusYears(1),
                null,
                UUID.randomUUID()
        );

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMaterial));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(dto);
        });

        Assertions.assertEquals("Planos de salvaguarda destinam-se exclusivamente a bens de natureza IMATERIAL.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve gerar erro quando plano de ação não for informado")
    public void deveGerarErroSemPlanoAcao() {
        SalvaguardaDTO dto = new SalvaguardaDTO(null, UUID.randomUUID(), "", StatusSalvaguarda.ATIVO, null, null, null, null);

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(dto);
        });

        Assertions.assertEquals("O plano de ação deve ser informado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve listar planos de salvaguarda por bem cultural")
    public void deveListarPorBem() {
        UUID bemId = UUID.randomUUID();
        BemCultural bem = BemCultural.builder().id(bemId).natureza("IMATERIAL").build();
        Usuario resp = Usuario.builder().id(UUID.randomUUID()).build();

        Salvaguarda s1 = Salvaguarda.builder().id(UUID.randomUUID()).bemCultural(bem).planoAcao("Ação 1").status(StatusSalvaguarda.ATIVO).responsavel(resp).build();
        Salvaguarda s2 = Salvaguarda.builder().id(UUID.randomUUID()).bemCultural(bem).planoAcao("Ação 2").status(StatusSalvaguarda.ATIVO).responsavel(resp).build();

        Mockito.when(repository.findByBemCulturalId(bemId)).thenReturn(List.of(s1, s2));

        List<SalvaguardaDTO> lista = service.listarPorBem(bemId);

        Assertions.assertEquals(2, lista.size());
        Assertions.assertEquals("Ação 1", lista.get(0).getPlanoAcao());
    }
}

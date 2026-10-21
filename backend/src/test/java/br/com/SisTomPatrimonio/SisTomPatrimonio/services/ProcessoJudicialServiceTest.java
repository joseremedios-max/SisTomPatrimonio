package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import org.junit.jupiter.api.Assertions;
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
public class ProcessoJudicialServiceTest {

    @InjectMocks
    private ProcessoJudicialService service;

    @Mock
    private ProcessoJudicialRepository repository;

    @Test
    @DisplayName("Deve cadastrar processo judicial com sucesso quando numero for unico")
    public void deveCriarProcessoJudicialComSucesso() {
        UUID processoId = UUID.randomUUID();
        ProcessoJudicialDTO dto = ProcessoJudicialDTO.builder()
                .numeroProcesso("0801234-56.2026.8.10.0001")
                .tribunal("TJMA")
                .varaComarca("Vara de Interesses Difusos e Coletivos de São Luís")
                .fase(FaseProcessoJudicial.INICIAL)
                .dataDistribuicao(LocalDate.of(2026, 2, 10))
                .assunto("Ação Civil Pública para contenção de risco estrutural em casarão histórico")
                .build();

        ProcessoJudicial salvo = ProcessoJudicial.builder()
                .id(processoId)
                .numeroProcesso(dto.getNumeroProcesso())
                .tribunal(dto.getTribunal())
                .varaComarca(dto.getVaraComarca())
                .fase(dto.getFase())
                .dataDistribuicao(dto.getDataDistribuicao())
                .assunto(dto.getAssunto())
                .build();

        Mockito.when(repository.findByNumeroProcesso("0801234-56.2026.8.10.0001")).thenReturn(Optional.empty());
        Mockito.when(repository.save(any(ProcessoJudicial.class))).thenReturn(salvo);

        ProcessoJudicialDTO resultado = service.criar(dto);

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals(processoId, resultado.getId());
        Assertions.assertEquals("0801234-56.2026.8.10.0001", resultado.getNumeroProcesso());
        Assertions.assertEquals(FaseProcessoJudicial.INICIAL, resultado.getFase());
        verify(repository, times(1)).save(any(ProcessoJudicial.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar cadastrar processo judicial com numero ja existente")
    public void deveGerarErroAoCriarProcessoJudicialDuplicado() {
        ProcessoJudicialDTO dto = ProcessoJudicialDTO.builder()
                .numeroProcesso("0801234-56.2026.8.10.0001")
                .tribunal("TJMA")
                .fase(FaseProcessoJudicial.INSTRUCAO)
                .build();

        ProcessoJudicial existente = ProcessoJudicial.builder()
                .id(UUID.randomUUID())
                .numeroProcesso("0801234-56.2026.8.10.0001")
                .build();

        Mockito.when(repository.findByNumeroProcesso("0801234-56.2026.8.10.0001")).thenReturn(Optional.of(existente));

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.criar(dto);
        });

        Assertions.assertEquals("Processo judicial já cadastrado.", ex.getMessage());
        verify(repository, Mockito.never()).save(any(ProcessoJudicial.class));
    }

    @Test
    @DisplayName("Deve listar todos os processos judiciais cadastrados")
    public void deveListarTodosOsProcessosJudiciais() {
        ProcessoJudicial p1 = ProcessoJudicial.builder()
                .id(UUID.randomUUID())
                .numeroProcesso("0001/2026")
                .tribunal("TRF1")
                .fase(FaseProcessoJudicial.TRANSITO_EM_JULGADO)
                .build();

        Mockito.when(repository.findAll()).thenReturn(List.of(p1));

        List<ProcessoJudicialDTO> lista = service.listarTodos();

        Assertions.assertEquals(1, lista.size());
        Assertions.assertEquals("0001/2026", lista.get(0).getNumeroProcesso());
        Assertions.assertEquals("TRF1", lista.get(0).getTribunal());
        Assertions.assertEquals(FaseProcessoJudicial.TRANSITO_EM_JULGADO, lista.get(0).getFase());
    }
}

package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProcessoJudicialService {

    private final ProcessoJudicialRepository repository;

    public ProcessoJudicialService(ProcessoJudicialRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ProcessoJudicialDTO criar(ProcessoJudicialDTO dto) {
        repository.findByNumeroProcesso(dto.getNumeroProcesso()).ifPresent(p -> {
            throw new RegraNegocioRunTime("Processo judicial já cadastrado.");
        });

        ProcessoJudicial entity = ProcessoJudicial.builder()
                .numeroProcesso(dto.getNumeroProcesso())
                .tribunal(dto.getTribunal())
                .varaComarca(dto.getVaraComarca())
                .fase(dto.getFase())
                .dataDistribuicao(dto.getDataDistribuicao())
                .assunto(dto.getAssunto())
                .build();

        entity = repository.save(entity);
            return toDto(entity);
    }

    @Transactional(readOnly = true)
    public List<ProcessoJudicialDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private ProcessoJudicialDTO toDto(ProcessoJudicial entity) {
        return new ProcessoJudicialDTO(
                entity.getId(),
                entity.getNumeroProcesso(),
                entity.getTribunal(),
                entity.getVaraComarca(),
                entity.getFase(),
                entity.getDataDistribuicao(),
                entity.getAssunto());
    }
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoBemRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoBemId;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProcessoJudicialService {

    private final ProcessoJudicialRepository repository;
    private final ProcessoBemRepository processoBemRepository;
    private final BemCulturalRepository bemCulturalRepository;

    public ProcessoJudicialService(ProcessoJudicialRepository repository,
                                   ProcessoBemRepository processoBemRepository,
                                   BemCulturalRepository bemCulturalRepository) {
        this.repository = repository;
        this.processoBemRepository = processoBemRepository;
        this.bemCulturalRepository = bemCulturalRepository;
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

    @Transactional
    public void vincularBem(java.util.UUID processoId, ProcessoBemDTO dto) {
        ProcessoJudicial processo = repository.findById(processoId)
                .orElseThrow(() -> new RegraNegocioRunTime("Processo judicial não encontrado."));
        BemCultural bem = bemCulturalRepository.findById(dto.getBemId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));
        ProcessoBemId id = new ProcessoBemId(processoId, dto.getBemId());
        if (processoBemRepository.existsById(id)) {
            throw new RegraNegocioRunTime("O bem já está vinculado ao processo.");
        }
        processoBemRepository.save(ProcessoBem.builder()
                .id(id).processoJudicial(processo).bemCultural(bem)
                .papelDoBem(dto.getPapelDoBem())
                .impactoConservacao(dto.getImpactoConservacao())
                .observacao(dto.getObservacao()).build());
    }

    @Transactional(readOnly = true)
    public List<ProcessoBemDTO> listarBens(java.util.UUID processoId) {
        return processoBemRepository.findByProcessoJudicialId(processoId).stream().map(v -> {
            ProcessoBemDTO dto = new ProcessoBemDTO();
            dto.setBemId(v.getBemCultural().getId());
            dto.setPapelDoBem(v.getPapelDoBem());
            dto.setImpactoConservacao(v.getImpactoConservacao());
            dto.setObservacao(v.getObservacao());
            return dto;
        }).toList();
    }

    @Transactional
    public void desvincularBem(java.util.UUID processoId, java.util.UUID bemId) {
        ProcessoBemId id = new ProcessoBemId(processoId, bemId);
        if (!processoBemRepository.existsById(id)) {
            throw new RegraNegocioRunTime("Vínculo entre processo e bem não encontrado.");
        }
        processoBemRepository.deleteById(id);
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
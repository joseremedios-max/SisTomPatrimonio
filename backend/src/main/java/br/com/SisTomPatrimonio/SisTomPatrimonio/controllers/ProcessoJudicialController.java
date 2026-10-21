package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.MovimentacaoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.ProcessoJudicialService;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.MovimentacaoJudicialRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.MovimentacaoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/processos-judiciais", "/api/v1/processos-judiciais"})
public class ProcessoJudicialController {

    private final ProcessoJudicialService service;
    private final ProcessoJudicialRepository processoRepository;
    private final MovimentacaoJudicialRepository movimentacaoRepository;

    public ProcessoJudicialController(ProcessoJudicialService service,
                                      ProcessoJudicialRepository processoRepository,
                                      MovimentacaoJudicialRepository movimentacaoRepository) {
        this.service = service;
        this.processoRepository = processoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    @PostMapping
    public ResponseEntity<ProcessoJudicialDTO> criar(@RequestBody @Valid ProcessoJudicialDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProcessoJudicialDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping("/{processoId}/bens")
    public ResponseEntity<Void> vincularBem(@PathVariable java.util.UUID processoId,
                                             @RequestBody @Valid ProcessoBemDTO dto) {
        service.vincularBem(processoId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{processoId}/bens")
    public ResponseEntity<List<ProcessoBemDTO>> listarBens(@PathVariable java.util.UUID processoId) {
        return ResponseEntity.ok(service.listarBens(processoId));
    }

    @GetMapping("/{processoId}/movimentacoes")
    public ResponseEntity<List<MovimentacaoJudicialDTO>> listarMovimentacoes(@PathVariable java.util.UUID processoId) {
        return ResponseEntity.ok(movimentacaoRepository.findByProcessoJudicialIdOrderByDataMovimentacaoDesc(processoId)
                .stream().map(this::toMovimentacaoDto).toList());
    }

    @PostMapping("/{processoId}/movimentacoes")
    public ResponseEntity<MovimentacaoJudicialDTO> criarMovimentacao(
            @PathVariable java.util.UUID processoId,
            @RequestBody @Valid MovimentacaoJudicialDTO dto) {
        var processo = processoRepository.findById(processoId)
                .orElseThrow(() -> new RegraNegocioRunTime("Processo judicial não encontrado."));
        var salvo = movimentacaoRepository.save(MovimentacaoJudicial.builder()
                .processoJudicial(processo)
                .dataMovimentacao(dto.dataMovimentacao())
                .descricao(dto.descricao())
                .observacao(dto.observacao())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(toMovimentacaoDto(salvo));
    }

    private MovimentacaoJudicialDTO toMovimentacaoDto(MovimentacaoJudicial entity) {
        return new MovimentacaoJudicialDTO(entity.getId(), entity.getDataMovimentacao(),
                entity.getDescricao(), entity.getObservacao());
    }

    @DeleteMapping("/{processoId}/bens/{bemId}")
    public ResponseEntity<Void> desvincularBem(@PathVariable java.util.UUID processoId,
                                                @PathVariable java.util.UUID bemId) {
        service.desvincularBem(processoId, bemId);
        return ResponseEntity.noContent().build();
    }
}
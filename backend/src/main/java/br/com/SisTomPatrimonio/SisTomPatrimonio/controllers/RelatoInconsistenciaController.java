package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.RelatoInconsistenciaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.RelatoInconsistencia;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.RelatoInconsistenciaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cadastros/relatos-inconsistencia")
@RequiredArgsConstructor
public class RelatoInconsistenciaController {
    private final RelatoInconsistenciaRepository relatoRepository;
    private final BemCulturalRepository bemRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> listar() {
        List<Map<String, Object>> resultado = relatoRepository
                .findAll(Sort.by(Sort.Direction.DESC, "criadoEm"))
                .stream()
                .map(this::toMap)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody RelatoInconsistenciaDTO dto) {
        BemCultural bem = localizarBem(dto.getBemId())
                .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado para o identificador/código informado."));

        RelatoInconsistencia salvo = relatoRepository.save(RelatoInconsistencia.builder()
                .bem(bem)
                .contato(dto.getContato().trim())
                .descricao(dto.getDescricao().trim())
                .status("ABERTO")
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(toMap(salvo));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<Map<String, Object>> atualizarStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        RelatoInconsistencia relato = relatoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioRunTime("Relato de inconsistência não encontrado."));
        relato.setStatus(status.trim().toUpperCase());
        RelatoInconsistencia salvo = relatoRepository.save(relato);
        return ResponseEntity.ok(toMap(salvo));
    }

    private Optional<BemCultural> localizarBem(String identificador) {
        if (identificador == null || identificador.isBlank()) {
            return Optional.empty();
        }
        String limpo = identificador.trim();
        try {
            UUID uuid = UUID.fromString(limpo);
            Optional<BemCultural> porId = bemRepository.findById(uuid);
            if (porId.isPresent()) {
                return porId;
            }
        } catch (IllegalArgumentException ignored) {
            // Não é UUID, tenta buscar pelo código institucional
        }
        return bemRepository.findByCodigo(limpo);
    }

    private Map<String, Object> toMap(RelatoInconsistencia r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("bemId", r.getBem().getId());
        map.put("bemCodigo", r.getBem().getCodigo());
        map.put("bemNome", r.getBem().getNome());
        map.put("contato", r.getContato());
        map.put("descricao", r.getDescricao());
        map.put("status", r.getStatus());
        map.put("criadoEm", r.getCriadoEm());
        return map;
    }
}

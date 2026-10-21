package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.VistoriaDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.VistoriaService;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vistorias")
public class VistoriaController {

    private final VistoriaService vistoriaService;

    public VistoriaController(VistoriaService vistoriaService) {
        this.vistoriaService = vistoriaService;
    }

    @PostMapping
    public ResponseEntity<VistoriaDTOs.Response> criar(@Valid @RequestBody VistoriaDTOs.Request request) {
        VistoriaDTOs.Response response = vistoriaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<VistoriaDTOs.Response>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(vistoriaService.listarPorBem(bemId));
    }

    @GetMapping
    public ResponseEntity<List<VistoriaDTOs.Response>> listarTodas() {
        return ResponseEntity.ok(vistoriaService.listarTodas());
    }

    @PostMapping("/{id}/laudo")
    public ResponseEntity<VistoriaDTOs.Response> registrarLaudo(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> payload) {
        Object patologiasPayload = payload.get("patologias");
        if (patologiasPayload != null && !(patologiasPayload instanceof Map<?, ?>)) {
            throw new RegraNegocioRunTime("O campo patologias deve ser um objeto JSON.");
        }
        Map<String, Object> patologias = null;
        if (patologiasPayload instanceof Map<?, ?> patologiasMap) {
            patologias = new LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : patologiasMap.entrySet()) {
                if (!(entry.getKey() instanceof String key)) {
                    throw new RegraNegocioRunTime("As chaves de patologias devem ser textos.");
                }
                patologias.put(key, entry.getValue());
            }
        }
        return ResponseEntity.ok(vistoriaService.registrarLaudo(
                id,
                patologias,
                (String) payload.get("resumo"),
                (String) payload.get("recomendacao"),
                parseDateTime(payload.get("realizadaEm"))));
    }

    private OffsetDateTime parseDateTime(Object value) {
        return value == null ? null : OffsetDateTime.parse(value.toString());
    }

    @PostMapping("/{id}/homologar")
    public ResponseEntity<VistoriaDTOs.Response> homologar(
            @PathVariable UUID id,
            @AuthenticationPrincipal String usuarioPrincipal) {
        UUID usuarioId;
        try {
            usuarioId = UUID.fromString(usuarioPrincipal);
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new RegraNegocioRunTime("Usuário autenticado inválido.");
        }
        return ResponseEntity.ok(vistoriaService.homologar(id, usuarioId));
    }
}
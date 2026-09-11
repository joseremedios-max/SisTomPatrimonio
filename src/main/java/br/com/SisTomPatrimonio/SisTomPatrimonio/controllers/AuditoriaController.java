package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.AuditoriaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auditorias")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping("/entidade/{entidade}/{entidadeId}")
    public ResponseEntity<Page<AuditoriaDTO>> buscarPorEntidade(
            @PathVariable String entidade,
            @PathVariable UUID entidadeId,
            Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.buscarPorEntidade(entidade, entidadeId, pageable));
    }
}
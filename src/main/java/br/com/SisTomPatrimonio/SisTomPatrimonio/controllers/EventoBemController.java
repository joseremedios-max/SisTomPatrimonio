package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.EventoBemDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.EventoBemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/eventos")
public class EventoBemController {

    private final EventoBemService service;

    public EventoBemController(EventoBemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EventoBemDTO> criar(@RequestBody @Valid EventoBemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<EventoBemDTO>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(service.listarPorBem(bemId));
    }
}
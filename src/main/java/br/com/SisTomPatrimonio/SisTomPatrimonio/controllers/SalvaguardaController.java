package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.SalvaguardaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.SalvaguardaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salvaguardas")
public class SalvaguardaController {

    private final SalvaguardaService service;

    public SalvaguardaController(SalvaguardaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SalvaguardaDTO> criar(@RequestBody @Valid SalvaguardaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<SalvaguardaDTO>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(service.listarPorBem(bemId));
    }
}
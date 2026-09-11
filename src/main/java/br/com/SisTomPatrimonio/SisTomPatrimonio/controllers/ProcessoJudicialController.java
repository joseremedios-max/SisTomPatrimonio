package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProcessoJudicialDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.ProcessoJudicialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processos-judiciais")
public class ProcessoJudicialController {

    private final ProcessoJudicialService service;

    public ProcessoJudicialController(ProcessoJudicialService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProcessoJudicialDTO> criar(@RequestBody @Valid ProcessoJudicialDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProcessoJudicialDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
}
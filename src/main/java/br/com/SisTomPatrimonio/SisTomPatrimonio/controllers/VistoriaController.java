package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.VistoriaDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.VistoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vistorias")
@RequiredArgsConstructor
public class VistoriaController {

    private final VistoriaService vistoriaService;

    @PostMapping
    public ResponseEntity<VistoriaDTOs.Response> criar(@Valid @RequestBody VistoriaDTOs.Request request) {
        VistoriaDTOs.Response response = vistoriaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<VistoriaDTOs.Response>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(vistoriaService.listarPorBem(bemId));
    }
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ProtecaoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.ProtecaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/protecoes")
@RequiredArgsConstructor
public class ProtecaoController {

    private final ProtecaoService protecaoService;

    @PostMapping
    public ResponseEntity<ProtecaoDTOs.Response> criar(@Valid @RequestBody ProtecaoDTOs.Request request) {
        ProtecaoDTOs.Response response = protecaoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<ProtecaoDTOs.Response>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(protecaoService.listarPorBem(bemId));
    }
}
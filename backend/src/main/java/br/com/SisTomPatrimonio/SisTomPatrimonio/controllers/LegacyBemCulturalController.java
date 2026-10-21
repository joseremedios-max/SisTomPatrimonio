package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.BemCulturalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bens")
@RequiredArgsConstructor
public class LegacyBemCulturalController {

    private final BemCulturalService bemCulturalService;

    @PostMapping
    public ResponseEntity<BemCultural> criar(@Valid @RequestBody BemCulturalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bemCulturalService.criar(dto));
    }
}
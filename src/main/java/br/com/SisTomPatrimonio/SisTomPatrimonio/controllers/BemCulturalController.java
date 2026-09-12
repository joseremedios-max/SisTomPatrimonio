package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;


import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalRequestDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.BemCulturalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bens-culturais")
@RequiredArgsConstructor
public class BemCulturalController {

    private final BemCulturalService bemCulturalService;

    @PostMapping
    public ResponseEntity<BemCulturalResponseDTO> cadastrar(
            @Valid @RequestBody BemCulturalRequestDTO dto,
            @RequestHeader("X-Usuario-Id") UUID usuarioAutenticadoId) {

        BemCulturalResponseDTO response = bemCulturalService.cadastrarBem(dto, usuarioAutenticadoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/proximidade")
    public ResponseEntity<Page<BemCulturalResponseDTO>> buscarPorProximidade(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam(value = "raioMetros", defaultValue = "1000") double raioMetros,
            Pageable pageable) {

        Page<BemCulturalResponseDTO> result = bemCulturalService.buscarPorProximidade(latitude, longitude, raioMetros, pageable);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/publicar")
    public ResponseEntity<BemCulturalResponseDTO> publicar(
            @PathVariable UUID id,
            @RequestHeader("X-Usuario-Id") UUID usuarioId) {
        return ResponseEntity.ok(bemCulturalService.publicar(id, usuarioId));
    }

    @PatchMapping("/{id}/arquivar")
    public ResponseEntity<BemCulturalResponseDTO> arquivar(
            @PathVariable UUID id,
            @RequestHeader("X-Usuario-Id") UUID usuarioId) {
        return ResponseEntity.ok(bemCulturalService.arquivar(id, usuarioId));
    }
}
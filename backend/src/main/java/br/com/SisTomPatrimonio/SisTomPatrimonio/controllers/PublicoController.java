package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.BemCulturalPublicoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.MunicipioPublicoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.GeoJsonDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Municipio;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.MunicipioRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.BemCulturalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;

@RestController
@RequiredArgsConstructor
public class PublicoController {

    private final BemCulturalService bemCulturalService;
    private final MunicipioRepository municipioRepository;

    @GetMapping("/api/v1/bens-culturais/publicos")
    public ResponseEntity<Page<BemCulturalPublicoDTO>> listarBensPublicos(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) NaturezaBem natureza,
            Pageable pageable) {
        return ResponseEntity.ok(bemCulturalService.listarPublicos(natureza, busca, pageable));
    }

    @GetMapping("/api/v1/public/mapa-bens")
    public ResponseEntity<GeoJsonDTO.FeatureCollection> mapaBens(
            @RequestParam(required = false) String busca, Pageable pageable) {
        return ResponseEntity.ok(bemCulturalService.mapaPublico(busca, pageable));
    }

    @GetMapping("/api/v1/bens-culturais/publicos/{codigo}")
    public ResponseEntity<BemCulturalPublicoDTO> buscarBemPublico(@PathVariable String codigo) {
        return ResponseEntity.ok(bemCulturalService.buscarPublico(codigo));
    }

    @GetMapping("/api/v1/territorial/municipios")
    public ResponseEntity<List<MunicipioPublicoDTO>> listarMunicipios() {
        return ResponseEntity.ok(municipioRepository.findAll().stream()
                .map(this::toPublico)
                .toList());
    }

    private MunicipioPublicoDTO toPublico(Municipio municipio) {
        return MunicipioPublicoDTO.builder()
                .id(municipio.getId())
                .codigoIbge(municipio.getCodigoIbge())
                .nome(municipio.getNome())
                .uf(municipio.getUf())
                .build();
    }
}

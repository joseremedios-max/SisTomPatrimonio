package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.DocumentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class LegacyDocumentoController {

    private final DocumentoService documentoService;

    @PostMapping("/upload")
    public ResponseEntity<Documento> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentoService.salvarDocumento(file, titulo));
    }
}
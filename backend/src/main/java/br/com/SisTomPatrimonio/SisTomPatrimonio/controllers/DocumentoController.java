package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoPublicoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.DocumentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping
    public ResponseEntity<DocumentoDTOs.Response> cadastrar(@Valid @RequestBody DocumentoDTOs.Request request) {
        DocumentoDTOs.Response response = documentoService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String classificacao,
            @RequestParam(required = false) UUID bemId,
            @RequestParam(required = false)             String sha256) throws java.io.IOException {
        if (categoria != null || classificacao != null || bemId != null || sha256 != null) {
            DocumentoDTOs.Response response = documentoService.armazenarEDocumentar(
                    bemId, titulo, categoria, classificacao, file.getOriginalFilename(),
                    file.getContentType(), file.getBytes(), sha256);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(documentoService.salvarDocumento(file, titulo));
    }

    @GetMapping("/bem/{bemId}")
    public ResponseEntity<List<DocumentoDTOs.Response>> listarPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(documentoService.listarPorBem(bemId));
    }

    @GetMapping("/publicos/bem/{bemId}")
    public ResponseEntity<List<DocumentoPublicoDTO>> listarPublicosPorBem(@PathVariable UUID bemId) {
        return ResponseEntity.ok(documentoService.listarPublicosPorBem(bemId));
    }

    @GetMapping("/{documentoId}/download")
    public ResponseEntity<ByteArrayResource> download(@PathVariable UUID documentoId) {
        Documento documento = documentoService.buscarDocumento(documentoId);
        MediaType mediaType;
        try {
            mediaType = documento.getMimeType() == null
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(documento.getMimeType());
        } catch (org.springframework.http.InvalidMediaTypeException ex) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(documento.getTamanhoBytes() == null ? 0 : documento.getTamanhoBytes())
                .header("Content-Disposition", "attachment; filename=\"" +
                        documento.getNomeArquivo().replace("\"", "") + "\"")
                .body(new ByteArrayResource(documentoService.baixarArquivo(documentoId)));
    }
}
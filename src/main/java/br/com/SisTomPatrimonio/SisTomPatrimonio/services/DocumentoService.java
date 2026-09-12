package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final BemCulturalRepository bemCulturalRepository;
    private final StorageService storageService;

    @Transactional
    public DocumentoDTOs.Response cadastrar(DocumentoDTOs.Request request) {
        BemCultural bem = null;
        if (request.getBemId() != null) {
            bem = bemCulturalRepository.findById(request.getBemId())
                    .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));
        }

        Documento documento = Documento.builder()
                .titulo(request.getTitulo())
                .categoria(request.getCategoria())
                .classificacao(request.getClassificacao() != null ? request.getClassificacao() : "INTERNA")
                .statusValidacao("PENDENTE")
                .bem(bem)
                .nomeArquivo(request.getNomeArquivo())
                .mimeType(request.getMimeType())
                .tamanhoBytes(request.getTamanhoBytes())
                .storageKey(request.getStorageKey())
                .sha256(request.getSha256())
                .dataDocumento(request.getDataDocumento())
                .descricao(request.getDescricao())
                .metadados(request.getMetadados())
                .publicacaoAutorizada(false)
                .versao(1)
                .build();

        Documento salvo = documentoRepository.save(documento);
        return converterParaResponse(salvo);
    }

    @Transactional
    public DocumentoDTOs.Response armazenarEDocumentar(UUID bemId, String titulo, String categoria,
                                                       String classificacao, String nomeArquivoOriginal,
                                                       String mimeType, byte[] conteudo) {
        BemCultural bem = null;
        if (bemId != null) {
            bem = bemCulturalRepository.findById(bemId)
                    .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));
        }

        String storageKey = storageService.armazenar(nomeArquivoOriginal, conteudo, mimeType);
        String sha256 = storageService.calcularSha256(conteudo);

        Documento documento = Documento.builder()
                .titulo(titulo)
                .categoria(categoria)
                .classificacao(classificacao != null ? classificacao : "INTERNA")
                .statusValidacao("VALIDADO")
                .bem(bem)
                .nomeArquivo(nomeArquivoOriginal)
                .mimeType(mimeType)
                .tamanhoBytes((long) conteudo.length)
                .storageKey(storageKey)
                .sha256(sha256)
                .dataDocumento(LocalDate.now())
                .publicacaoAutorizada(false)
                .versao(1)
                .build();

        Documento salvo = documentoRepository.save(documento);
        return converterParaResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTOs.Response> listarPorBem(UUID bemId) {
        return documentoRepository.findByBemId(bemId).stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] baixarArquivo(UUID documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RegraNegocioRunTime("Documento não encontrado."));
        return storageService.carregar(documento.getStorageKey());
    }

    private DocumentoDTOs.Response converterParaResponse(Documento doc) {
        return DocumentoDTOs.Response.builder()
                .id(doc.getId())
                .codigo(doc.getCodigo())
                .titulo(doc.getTitulo())
                .categoria(doc.getCategoria())
                .classificacao(doc.getClassificacao())
                .statusValidacao(doc.getStatusValidacao())
                .nomeArquivo(doc.getNomeArquivo())
                .storageKey(doc.getStorageKey())
                .sha256(doc.getSha256())
                .versao(doc.getVersao())
                .publicacaoAutorizada(doc.getPublicacaoAutorizada())
                .criadoEm(doc.getCriadoEm())
                .build();
    }
}
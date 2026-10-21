package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoPublicoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final BemCulturalRepository bemCulturalRepository;
    private final StorageService storageService;
    private final AntivirusScannerService antivirusScannerService;

    public DocumentoService(
            DocumentoRepository documentoRepository,
            BemCulturalRepository bemCulturalRepository,
            StorageService storageService) {
        this(documentoRepository, bemCulturalRepository, storageService, null);
    }

    @Autowired
    public DocumentoService(
            DocumentoRepository documentoRepository,
            BemCulturalRepository bemCulturalRepository,
            StorageService storageService,
            AntivirusScannerService antivirusScannerService) {
        this.documentoRepository = documentoRepository;
        this.bemCulturalRepository = bemCulturalRepository;
        this.storageService = storageService;
        this.antivirusScannerService = antivirusScannerService;
    }

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
    public Documento salvarDocumento(MultipartFile arquivo, String titulo) {
        try {
            byte[] conteudo = arquivo.getBytes();
            String storageKey = storageService.armazenar(
                    arquivo.getOriginalFilename(), conteudo, arquivo.getContentType());
            Documento documento = Documento.builder()
                    .titulo(titulo)
                    .nomeArquivo(arquivo.getOriginalFilename())
                    .mimeType(arquivo.getContentType())
                    .tamanhoBytes((long) conteudo.length)
                    .storageKey(storageKey)
                    .sha256(storageService.calcularSha256(conteudo))
                    .statusValidacao("VALIDADO")
                    .publicacaoAutorizada(false)
                    .versao(1)
                    .dataDocumento(LocalDate.now())
                    .build();
            Documento salvo = documentoRepository.save(documento);
            if (antivirusScannerService != null && salvo != null) {
                antivirusScannerService.escanearDocumentoAssincrono(salvo.getId(), conteudo);
            }
            return salvo;
        } catch (RegraNegocioRunTime ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RegraNegocioRunTime("Não foi possível processar o documento.");
        }
    }

    @Transactional
    public DocumentoDTOs.Response armazenarEDocumentar(UUID bemId, String titulo, String categoria,
                                                       String classificacao, String nomeArquivoOriginal,
                                                       String mimeType, byte[] conteudo) {
        return armazenarEDocumentar(bemId, titulo, categoria, classificacao,
                nomeArquivoOriginal, mimeType, conteudo, null);
    }

    @Transactional
    public DocumentoDTOs.Response armazenarEDocumentar(UUID bemId, String titulo, String categoria,
                                                       String classificacao, String nomeArquivoOriginal,
                                                       String mimeType, byte[] conteudo,
                                                       String sha256Informado) {
        BemCultural bem = null;
        if (bemId != null) {
            bem = bemCulturalRepository.findById(bemId)
                    .orElseThrow(() -> new RegraNegocioRunTime("Bem cultural não encontrado."));
        }

        String storageKey = storageService.armazenar(nomeArquivoOriginal, conteudo, mimeType);
        String sha256 = storageService.calcularSha256(conteudo);
        if (sha256Informado != null && !sha256.equalsIgnoreCase(sha256Informado)) {
            throw new RegraNegocioRunTime("O checksum SHA-256 do arquivo não confere.");
        }

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
        if (antivirusScannerService != null && salvo != null) {
            antivirusScannerService.escanearDocumentoAssincrono(salvo.getId(), conteudo);
        }
        return converterParaResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTOs.Response> listarPorBem(UUID bemId) {
        return documentoRepository.findByBemId(bemId).stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentoPublicoDTO> listarPublicosPorBem(UUID bemId) {
        return documentoRepository.findByBemIdAndPublicacaoAutorizadaTrue(bemId).stream()
                .map(documento -> DocumentoPublicoDTO.builder()
                        .id(documento.getId())
                        .codigo(documento.getCodigo())
                        .titulo(documento.getTitulo())
                        .categoria(documento.getCategoria())
                        .nomeArquivo(documento.getNomeArquivo())
                        .mimeType(documento.getMimeType())
                        .tamanhoBytes(documento.getTamanhoBytes())
                        .dataDocumento(documento.getDataDocumento())
                        .descricao(documento.getDescricao())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] baixarArquivo(UUID documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RegraNegocioRunTime("Documento não encontrado."));
        if ("REJEITADO".equalsIgnoreCase(documento.getStatusValidacao())) {
            throw new RegraNegocioRunTime("Download bloqueado: documento reprovado na varredura de segurança (ClamAV).");
        }
        return storageService.carregar(documento.getStorageKey());
    }

    @Transactional(readOnly = true)
    public Documento buscarDocumento(UUID documentoId) {
        return documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RegraNegocioRunTime("Documento não encontrado."));
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

package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DocumentoDTOs;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.BemCultural;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.storage.StorageService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class DocumentoServiceTest {

    @InjectMocks
    private DocumentoService service;

    @Mock
    private DocumentoRepository documentoRepository;

    @Mock
    private BemCulturalRepository bemCulturalRepository;

    @Mock
    private StorageService storageService;

    private UUID bemId;
    private UUID documentoId;
    private BemCultural bemMock;

    @BeforeEach
    void setup() {
        bemId = UUID.randomUUID();
        documentoId = UUID.randomUUID();

        bemMock = BemCultural.builder()
                .id(bemId)
                .codigo("BEM-DOC-01")
                .nome("Convento das Mercês")
                .build();
    }

    @Test
    @DisplayName("Deve cadastrar documento com metadados com sucesso")
    public void deveCadastrarDocumentoMetadataComSucesso() {
        DocumentoDTOs.Request request = DocumentoDTOs.Request.builder()
                .titulo("Planta Baixa Arquitetonica")
                .categoria("PLANTA")
                .classificacao("PUBLICA")
                .bemId(bemId)
                .nomeArquivo("planta_baixa.pdf")
                .mimeType("application/pdf")
                .tamanhoBytes(1048576L)
                .storageKey("storage/docs/planta_baixa.pdf")
                .sha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
                .dataDocumento(LocalDate.now())
                .descricao("Desenho técnico arquitetônico original")
                .build();

        Documento docSalvo = Documento.builder()
                .id(documentoId)
                .codigo("DOC-2026-001")
                .titulo(request.getTitulo())
                .categoria(request.getCategoria())
                .classificacao(request.getClassificacao())
                .statusValidacao("PENDENTE")
                .bem(bemMock)
                .nomeArquivo(request.getNomeArquivo())
                .storageKey(request.getStorageKey())
                .sha256(request.getSha256())
                .versao(1)
                .publicacaoAutorizada(false)
                .criadoEm(OffsetDateTime.now())
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(documentoRepository.save(any(Documento.class))).thenReturn(docSalvo);

        DocumentoDTOs.Response response = service.cadastrar(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(documentoId, response.getId());
        Assertions.assertEquals("Planta Baixa Arquitetonica", response.getTitulo());
        Assertions.assertEquals("PENDENTE", response.getStatusValidacao());
        Assertions.assertEquals(1, response.getVersao());
        verify(documentoRepository, times(1)).save(any(Documento.class));
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar cadastrar documento para bem cultural inexistente")
    public void deveGerarErroAoCadastrarQuandoBemNaoExistir() {
        DocumentoDTOs.Request request = DocumentoDTOs.Request.builder()
                .titulo("Certidão")
                .bemId(bemId)
                .nomeArquivo("certidao.pdf")
                .storageKey("key/certidao.pdf")
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.cadastrar(request);
        });

        Assertions.assertEquals("Bem cultural não encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve armazenar conteudo fisico no StorageService e registrar documento")
    public void deveArmazenarEDocumentarArquivoComSucesso() {
        byte[] conteudo = "Conteudo binario do laudo pericial".getBytes(StandardCharsets.UTF_8);
        String chaveGerada = "storage/laudos/laudo_estrutural_123.pdf";
        String sha256Calculado = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

        Documento docSalvo = Documento.builder()
                .id(documentoId)
                .titulo("Laudo de Engenharia")
                .categoria("LAUDO")
                .classificacao("CONFIDENCIAL")
                .statusValidacao("VALIDADO")
                .bem(bemMock)
                .nomeArquivo("laudo_estrutural.pdf")
                .storageKey(chaveGerada)
                .sha256(sha256Calculado)
                .versao(1)
                .publicacaoAutorizada(false)
                .criadoEm(OffsetDateTime.now())
                .build();

        Mockito.when(bemCulturalRepository.findById(bemId)).thenReturn(Optional.of(bemMock));
        Mockito.when(storageService.armazenar("laudo_estrutural.pdf", conteudo, "application/pdf")).thenReturn(chaveGerada);
        Mockito.when(storageService.calcularSha256(conteudo)).thenReturn(sha256Calculado);
        Mockito.when(documentoRepository.save(any(Documento.class))).thenReturn(docSalvo);

        DocumentoDTOs.Response response = service.armazenarEDocumentar(
                bemId,
                "Laudo de Engenharia",
                "LAUDO",
                "CONFIDENCIAL",
                "laudo_estrutural.pdf",
                "application/pdf",
                conteudo
        );

        Assertions.assertNotNull(response);
        Assertions.assertEquals(chaveGerada, response.getStorageKey());
        Assertions.assertEquals(sha256Calculado, response.getSha256());
        Assertions.assertEquals("VALIDADO", response.getStatusValidacao());
        verify(storageService, times(1)).armazenar("laudo_estrutural.pdf", conteudo, "application/pdf");
        verify(storageService, times(1)).calcularSha256(conteudo);
        verify(documentoRepository, times(1)).save(any(Documento.class));
    }

    @Test
    @DisplayName("Deve listar documentos vinculados a um bem cultural")
    public void deveListarDocumentosPorBem() {
        Documento d1 = Documento.builder().id(UUID.randomUUID()).titulo("Foto Fachada").storageKey("k1").build();
        Mockito.when(documentoRepository.findByBemId(bemId)).thenReturn(List.of(d1));

        List<DocumentoDTOs.Response> lista = service.listarPorBem(bemId);

        Assertions.assertEquals(1, lista.size());
        Assertions.assertEquals("Foto Fachada", lista.get(0).getTitulo());
    }

    @Test
    @DisplayName("Deve baixar arquivo recuperando bytes pelo StorageService")
    public void deveBaixarArquivoComSucesso() {
        byte[] bytesOriginais = "Dados do arquivo PDF".getBytes(StandardCharsets.UTF_8);
        Documento doc = Documento.builder()
                .id(documentoId)
                .storageKey("storage/contrato.pdf")
                .build();

        Mockito.when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(doc));
        Mockito.when(storageService.carregar("storage/contrato.pdf")).thenReturn(bytesOriginais);

        byte[] baixado = service.baixarArquivo(documentoId);

        Assertions.assertNotNull(baixado);
        Assertions.assertArrayEquals(bytesOriginais, baixado);
        verify(storageService, times(1)).carregar("storage/contrato.pdf");
    }

    @Test
    @DisplayName("Deve gerar erro ao tentar baixar documento inexistente")
    public void deveGerarErroAoBaixarArquivoQuandoDocumentoNaoExistir() {
        Mockito.when(documentoRepository.findById(documentoId)).thenReturn(Optional.empty());

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.baixarArquivo(documentoId);
        });

        Assertions.assertEquals("Documento não encontrado.", ex.getMessage());
    }
}

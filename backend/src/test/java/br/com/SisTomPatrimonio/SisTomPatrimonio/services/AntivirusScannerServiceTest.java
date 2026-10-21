package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusValidacaoDocumento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AntivirusScannerServiceTest {

    @Mock
    private DocumentoRepository documentoRepository;

    @Test
    @DisplayName("Deve aprovar arquivo limpo e marcar documento como VALIDADO")
    void deveAprovarArquivoLimpo() throws Exception {
        AntivirusScannerService scanner = new AntivirusScannerService(documentoRepository);
        UUID docId = UUID.randomUUID();
        Documento doc = Documento.builder()
                .id(docId)
                .titulo("Laudo Técnico")
                .statusValidacao(StatusValidacaoDocumento.PENDENTE.name())
                .build();

        when(documentoRepository.findById(docId)).thenReturn(Optional.of(doc));

        AntivirusScannerService.ScanResult resultado = scanner
                .escanearDocumentoAssincrono(docId, "Conteudo seguro PDF".getBytes(StandardCharsets.UTF_8))
                .get();

        assertTrue(resultado.limpo());
        assertNull(resultado.assinaturaDetectada());
        assertEquals("VALIDADO", doc.getStatusValidacao());
        assertEquals("CLEAN", doc.getMetadados().get("antivirusStatus"));
        verify(documentoRepository, times(1)).save(doc);
    }

    @Test
    @DisplayName("Deve detectar assinatura EICAR e rejeitar documento infectado")
    void deveRejeitarArquivoComAssinaturaEicar() throws Exception {
        AntivirusScannerService scanner = new AntivirusScannerService(documentoRepository);
        UUID docId = UUID.randomUUID();
        Documento doc = Documento.builder()
                .id(docId)
                .titulo("Arquivo Suspeito")
                .statusValidacao(StatusValidacaoDocumento.VALIDADO.name())
                .publicacaoAutorizada(true)
                .build();

        when(documentoRepository.findById(docId)).thenReturn(Optional.of(doc));

        byte[] eicarBytes = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
                .getBytes(StandardCharsets.ISO_8859_1);

        AntivirusScannerService.ScanResult resultado = scanner
                .escanearDocumentoAssincrono(docId, eicarBytes)
                .get();

        assertFalse(resultado.limpo());
        assertEquals("Win.Test.EICAR_HDB-1", resultado.assinaturaDetectada());
        assertEquals("REJEITADO", doc.getStatusValidacao());
        assertFalse(doc.getPublicacaoAutorizada());
        assertEquals("INFECTED", doc.getMetadados().get("antivirusStatus"));
        verify(documentoRepository, times(1)).save(doc);
    }
}


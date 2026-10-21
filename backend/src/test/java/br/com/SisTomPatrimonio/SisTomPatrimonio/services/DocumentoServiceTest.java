package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.DocumentoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import br.com.SisTomPatrimonio.SisTomPatrimonio.storage.StorageService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentoServiceTest {

    @Mock
    private DocumentoRepository documentoRepository;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private DocumentoService documentoService;

    @Test
    @DisplayName("Deve calcular o hash SHA-256, definir storageKey e salvar metadados sem armazenar bytes no banco")
    void deveSalvarMetadadosDocumentoComSha256() throws Exception {
        MockMultipartFile arquivoMock = new MockMultipartFile(
                "file", "laudo_vistoria.pdf", "application/pdf", "conteudo do laudo pericial".getBytes()
        );

        when(documentoRepository.save(any(Documento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(storageService.armazenar(any(), any(), any())).thenReturn("bens/2026/laudo_vistoria.pdf");
        when(storageService.calcularSha256(any())).thenReturn("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

        Documento resultado = documentoService.salvarDocumento(arquivoMock, "Laudo de Vistoria");

        assertNotNull(resultado);
        assertNotNull(resultado.getStorageKey());
        assertNotNull(resultado.getSha256());
        assertEquals(64, resultado.getSha256().length()); // Hash SHA-256 possui 64 caracteres hexadecimais
        assertEquals("laudo_vistoria.pdf", resultado.getNomeArquivo());

        verify(documentoRepository, times(1)).save(any(Documento.class));
    }
}
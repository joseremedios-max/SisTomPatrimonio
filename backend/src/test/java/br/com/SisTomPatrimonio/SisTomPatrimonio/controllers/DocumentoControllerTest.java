package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.DocumentoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class DocumentoControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DocumentoService documentoService;

    @Test
    @DisplayName("Deve realizar upload multipart de documento, registrar storage key e retornar HTTP 201")
    void deveRealizarUploadComSucesso() throws Exception {
        MockMultipartFile arquivo = new MockMultipartFile(
                "file", "decreto_tombamento.pdf", "application/pdf", "conteudo_decreto".getBytes()
        );

        Documento documentoSalvo = new Documento();
        documentoSalvo.setTitulo("Decreto de Tombamento");
        documentoSalvo.setNomeArquivo("decreto_tombamento.pdf");
        documentoSalvo.setStorageKey("bens/2026/decreto_tombamento.pdf");
        documentoSalvo.setSha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

        when(documentoService.salvarDocumento(any(), eq("Decreto de Tombamento"))).thenReturn(documentoSalvo);

        mockMvc.perform(multipart("/api/documentos/upload")
                .file(arquivo)
                .param("titulo", "Decreto de Tombamento")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nomeArquivo").value("decreto_tombamento.pdf"))
                .andExpect(jsonPath("$.storageKey").value("bens/2026/decreto_tombamento.pdf"))
                .andExpect(jsonPath("$.sha256").exists());
    }
}
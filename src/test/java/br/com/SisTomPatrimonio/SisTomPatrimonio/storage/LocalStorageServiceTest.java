package br.com.SisTomPatrimonio.SisTomPatrimonio.storage;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

public class LocalStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalStorageService storageService;

    @BeforeEach
    void setUp() {
        storageService = new LocalStorageService(tempDir.toString());
    }

    @Test
    @DisplayName("Deve armazenar e carregar arquivo com sucesso")
    void deveArmazenarECarregarArquivo() {
        byte[] conteudo = "Conteúdo de teste para patrimônio".getBytes(StandardCharsets.UTF_8);
        String nomeOriginal = "laudo_pericial.pdf";

        String storageKey = storageService.armazenar(nomeOriginal, conteudo, "application/pdf");

        Assertions.assertNotNull(storageKey);
        Assertions.assertTrue(storageKey.endsWith(".pdf"));

        byte[] carregado = storageService.carregar(storageKey);
        Assertions.assertArrayEquals(conteudo, carregado);

        storageService.remover(storageKey);
    }

    @Test
    @DisplayName("Deve calcular hash SHA-256 corretamente")
    void deveCalcularHashSha256() {
        byte[] conteudo = "SIPMA-MARANHAO".getBytes(StandardCharsets.UTF_8);

        String sha256 = storageService.calcularSha256(conteudo);

        Assertions.assertNotNull(sha256);
        Assertions.assertEquals(64, sha256.length()); // SHA-256 produz sempre 64 caracteres hexadecimais
    }
}

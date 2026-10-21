package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Documento;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class DocumentoRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Test
    @DisplayName("Deve buscar documento por hash SHA-256")
    void deveBuscarPorSha256() {
        String sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

        Documento doc = Documento.builder()
                .codigo("DOC-001")
                .titulo("Laudo Tecnico Estrutural")
                .nomeArquivo("laudo.pdf")
                .storageKey("2026/docs/laudo.pdf")
                .sha256(sha256)
                .classificacao("INTERNA")
                .statusValidacao("PENDENTE")
                .publicacaoAutorizada(false)
                .build();

        documentoRepository.save(doc);

        Optional<Documento> encontrado = documentoRepository.findBySha256(sha256);

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getTitulo()).isEqualTo("Laudo Tecnico Estrutural");
    }
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AuditoriaRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @Test
    @DisplayName("Deve buscar registros de auditoria por Correlation ID")
    void deveBuscarPorCorrelationId() {
        UUID correlationId = UUID.randomUUID();

        Auditoria audit = Auditoria.builder()
                .acao("CRIAR_BEM")
                .entidade("BemCultural")
                .entidadeId(UUID.randomUUID())
                .ocorridoEm(OffsetDateTime.now())
                .correlationId(correlationId)
                .build();

        auditoriaRepository.save(audit);

        List<Auditoria> logs = auditoriaRepository.findByCorrelationId(correlationId);

        assertThat(logs).hasSize(1);
        assertThat(logs.get(0).getAcao()).isEqualTo("CRIAR_BEM");
    }
}
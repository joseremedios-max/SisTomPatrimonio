package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;

import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusVistoria;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.UUID;

public class VistoriaTest {

    @Test
    @DisplayName("Nao deve permitir homologar vistoria com status diferente de REALIZADA")
    void naoDeveHomologarVistoriaNaoRealizada() {
        Vistoria vistoria = Vistoria.builder()
                .codigo("VIS-001")
                .status(StatusVistoria.PLANEJADA.name())
                .homologada(false)
                .build();

        Usuario homologador = Usuario.builder().id(UUID.randomUUID()).nome("Perito").build();

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            vistoria.homologar(homologador);
        });

        Assertions.assertEquals("Apenas vistorias com status REALIZADA podem ser homologadas.", ex.getMessage());
    }

    @Test
    @DisplayName("Deve homologar vistoria com status REALIZADA com sucesso")
    void deveHomologarVistoriaRealizadaComSucesso() {
        Vistoria vistoria = Vistoria.builder()
                .codigo("VIS-002")
                .status(StatusVistoria.REALIZADA.name())
                .homologada(false)
                .build();

        Usuario homologador = Usuario.builder().id(UUID.randomUUID()).nome("Perito Chefe").build();

        vistoria.homologar(homologador);

        Assertions.assertTrue(vistoria.getHomologada());
        Assertions.assertEquals(homologador, vistoria.getHomologadaPor());
        Assertions.assertNotNull(vistoria.getHomologadaEm());
    }

    @Test
    @DisplayName("Nao deve permitir alterar laudo de vistoria ja homologada")
    void naoDeveAlterarVistoriaJaHomologada() {
        Vistoria vistoria = Vistoria.builder()
                .codigo("VIS-003")
                .status(StatusVistoria.REALIZADA.name())
                .homologada(true)
                .build();

        RegraNegocioRunTime ex = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            vistoria.registrarRealizacao(OffsetDateTime.now(), "BOM", "BAIXO", "Resumo", "Recomendacao");
        });

        Assertions.assertEquals("Não é possível alterar uma vistoria que já foi homologada.", ex.getMessage());
    }
}

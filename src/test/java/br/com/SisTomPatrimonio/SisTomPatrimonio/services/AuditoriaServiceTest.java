package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.AuditoriaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.AuditoriaRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AuditoriaServiceTest {

    @InjectMocks
    private AuditoriaService service;

    @Mock
    private AuditoriaRepository repository;

    @Test
    @DisplayName("Deve buscar trilha de auditoria paginada por entidade e mapear para DTO")
    public void deveBuscarAuditoriaPorEntidadeComPaginacao() {
        UUID entidadeId = UUID.randomUUID();
        UUID usuarioId = UUID.randomUUID();
        UUID correlationId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);

        Usuario usuario = Usuario.builder()
                .id(usuarioId)
                .nome("Auditor Fiscal")
                .build();

        Auditoria registroAuditoria = Auditoria.builder()
                .id(1L)
                .usuario(usuario)
                .entidade("BEM_CULTURAL")
                .entidadeId(entidadeId)
                .acao("CRIACAO")
                .origem("BEM_CULTURAL_SERVICE")
                .correlationId(correlationId)
                .ocorridoEm(OffsetDateTime.now())
                .dadosNovos(Map.of("codigo", "BEM-001", "status", "PUBLICADO"))
                .build();

        Page<Auditoria> paginaEntidades = new PageImpl<>(List.of(registroAuditoria), pageable, 1);

        Mockito.when(repository.findByEntidadeAndEntidadeId("BEM_CULTURAL", entidadeId, pageable))
                .thenReturn(paginaEntidades);

        Page<AuditoriaDTO> resultado = service.buscarPorEntidade("BEM_CULTURAL", entidadeId, pageable);

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals(1, resultado.getTotalElements());

        AuditoriaDTO dto = resultado.getContent().get(0);
        Assertions.assertEquals(1L, dto.getId());
        Assertions.assertEquals("BEM_CULTURAL", dto.getEntidade());
        Assertions.assertEquals(entidadeId, dto.getEntidadeId());
        Assertions.assertEquals("CRIACAO", dto.getAcao());
        Assertions.assertEquals("Auditor Fiscal", dto.getUsuarioNome());
        Assertions.assertEquals(usuarioId, dto.getUsuarioId());
        Assertions.assertEquals(correlationId, dto.getCorrelationId());
        Assertions.assertEquals("BEM-001", dto.getDadosNovos().get("codigo"));

        verify(repository, times(1)).findByEntidadeAndEntidadeId("BEM_CULTURAL", entidadeId, pageable);
    }

    @Test
    @DisplayName("Deve retornar registros de auditoria mesmo quando usuario executor for nulo (acao do sistema)")
    public void deveMapearAuditoriaSemUsuario() {
        UUID entidadeId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);

        Auditoria registroSistema = Auditoria.builder()
                .id(2L)
                .usuario(null)
                .entidade("SISTEMA")
                .entidadeId(entidadeId)
                .acao("JOB_EXPIRACAO")
                .origem("SCHEDULER")
                .ocorridoEm(OffsetDateTime.now())
                .build();

        Page<Auditoria> pagina = new PageImpl<>(List.of(registroSistema), pageable, 1);

        Mockito.when(repository.findByEntidadeAndEntidadeId("SISTEMA", entidadeId, pageable))
                .thenReturn(pagina);

        Page<AuditoriaDTO> resultado = service.buscarPorEntidade("SISTEMA", entidadeId, pageable);

        Assertions.assertNotNull(resultado);
        AuditoriaDTO dto = resultado.getContent().get(0);
        Assertions.assertNull(dto.getUsuarioId());
        Assertions.assertNull(dto.getUsuarioNome());
        Assertions.assertEquals("JOB_EXPIRACAO", dto.getAcao());
    }
}

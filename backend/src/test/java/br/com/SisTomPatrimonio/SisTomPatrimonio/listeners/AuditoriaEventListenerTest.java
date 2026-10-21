package br.com.SisTomPatrimonio.SisTomPatrimonio.listeners;

import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.AuditoriaRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AuditoriaEventListenerTest {

    @Mock
    private AuditoriaRepository auditoriaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AuditoriaEventListener listener;

    @Test
    @DisplayName("Deve processar evento de auditoria e persistir na tabela de auditoria")
    void deveProcessarEventoAuditoria() {
        UUID usuarioId = UUID.randomUUID();
        UUID entidadeId = UUID.randomUUID();

        Usuario usuario = Usuario.builder().id(usuarioId).nome("Fiscal").build();
        Mockito.when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));

        AuditoriaEvent evento = AuditoriaEvent.builder()
                .entidade("VISTORIA")
                .entidadeId(entidadeId)
                .acao("HOMOLOGACAO")
                .usuarioId(usuarioId)
                .dadosNovos(Map.of("status", "CONCLUIDA"))
                .origem("TEST_SUITE")
                .build();

        listener.processarEventoAuditoria(evento);

        verify(auditoriaRepository, times(1)).save(any(Auditoria.class));
    }
}

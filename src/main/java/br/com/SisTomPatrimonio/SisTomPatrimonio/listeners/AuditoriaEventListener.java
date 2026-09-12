package br.com.SisTomPatrimonio.SisTomPatrimonio.listeners;

import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.AuditoriaRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuditoriaEventListener {

    private final AuditoriaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processarEventoAuditoria(AuditoriaEvent evento) {
        try {
            Usuario usuario = null;
            if (evento.getUsuarioId() != null) {
                usuario = usuarioRepository.findById(evento.getUsuarioId()).orElse(null);
            }

            Auditoria auditoria = Auditoria.builder()
                    .usuario(usuario)
                    .entidade(evento.getEntidade())
                    .entidadeId(evento.getEntidadeId())
                    .acao(evento.getAcao())
                    .dadosAnteriores(evento.getDadosAnteriores())
                    .dadosNovos(evento.getDadosNovos())
                    .origem(evento.getOrigem() != null ? evento.getOrigem() : "SIPMA_BACKEND")
                    .correlationId(evento.getCorrelationId())
                    .ocorridoEm(evento.getTimestamp())
                    .build();

            auditoriaRepository.save(auditoria);
            log.info("Auditoria gravada com sucesso: entidade={} acao={} entidadeId={}",
                    evento.getEntidade(), evento.getAcao(), evento.getEntidadeId());
        } catch (Exception e) {
            log.error("Falha ao registrar auditoria para entidade={}: {}", evento.getEntidade(), e.getMessage(), e);
        }
    }
}

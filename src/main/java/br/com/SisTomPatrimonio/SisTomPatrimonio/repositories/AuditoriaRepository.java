package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    Page<Auditoria> findByEntidadeAndEntidadeId(String entidade, UUID entidadeId, Pageable pageable);

    Page<Auditoria> findByUsuarioId(UUID usuarioId, Pageable pageable);

    Page<Auditoria> findByOcorridoEmBetween(OffsetDateTime inicio, OffsetDateTime fim, Pageable pageable);

    List<Auditoria> findByCorrelationId(UUID correlationId);
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.EventoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventoBemRepository extends JpaRepository<EventoBem, UUID> {

    List<EventoBem> findByBemCulturalId(UUID bemId);

    List<EventoBem> findByTipo(EventoTipo tipo);

    List<EventoBem> findByOrganizacaoId(UUID organizacaoId);
}
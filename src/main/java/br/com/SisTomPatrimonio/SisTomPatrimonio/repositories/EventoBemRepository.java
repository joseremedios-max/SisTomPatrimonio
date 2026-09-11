package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.EventoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.EventoTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventoBemRepository extends JpaRepository<EventoBem, UUID> {

    List<EventoBem> findByBemCulturalId(UUID bemId);

    List<EventoBem> findByTipoEvento(EventoTipo tipoEvento);

    List<EventoBem> findByResponsavelId(UUID responsavelId);
}
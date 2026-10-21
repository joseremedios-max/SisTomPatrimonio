package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Vistoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VistoriaRepository extends JpaRepository<Vistoria, UUID> {

    List<Vistoria> findByBemIdOrderByAgendadaEmDesc(UUID bemId);

    List<Vistoria> findByStatus(String status);

    List<Vistoria> findAllByOrderByAgendadaEmDesc();

    long countByStatus(String status);

    List<Vistoria> findByNivelRiscoIn(List<String> niveis);
}
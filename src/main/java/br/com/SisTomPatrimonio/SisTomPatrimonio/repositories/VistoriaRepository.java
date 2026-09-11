package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Vistoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VistoriaRepository extends JpaRepository<Vistoria, UUID> {

    List<Vistoria> findByBemIdOrderByAgendadaEmDesc(UUID bemId);

    List<Vistoria> findByStatus(String status);
}
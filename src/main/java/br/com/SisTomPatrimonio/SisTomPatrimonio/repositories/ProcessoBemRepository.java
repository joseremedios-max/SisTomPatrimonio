package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoBemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProcessoBemRepository extends JpaRepository<ProcessoBem, ProcessoBemId> {

    List<ProcessoBem> findByProcessoJudicialId(UUID processoJudicialId);

    List<ProcessoBem> findByBemCulturalId(UUID bemCulturalId);
}
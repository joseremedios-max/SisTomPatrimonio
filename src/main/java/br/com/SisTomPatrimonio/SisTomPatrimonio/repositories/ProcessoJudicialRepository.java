package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProcessoJudicialRepository extends JpaRepository<ProcessoJudicial, UUID> {

    Optional<ProcessoJudicial> findByNumeroProcesso(String numeroProcesso);

    List<ProcessoJudicial> findByFase(FaseProcessoJudicial fase);

    boolean existsByNumeroProcesso(String numeroProcesso);
}
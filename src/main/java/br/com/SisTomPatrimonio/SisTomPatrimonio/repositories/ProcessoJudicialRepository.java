package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ProcessoJudicial;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.FaseProcessoJudicial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProcessoJudicialRepository extends JpaRepository<ProcessoJudicial, UUID> {

    Optional<ProcessoJudicial> findByNumeroCnj(String numeroCnj);

    @Query("SELECT p FROM ProcessoJudicial p WHERE p.numeroCnj = :numeroProcesso")
    Optional<ProcessoJudicial> findByNumeroProcesso(@Param("numeroProcesso") String numeroProcesso);

    List<ProcessoJudicial> findByFase(FaseProcessoJudicial fase);

    @Query("SELECT COUNT(p) > 0 FROM ProcessoJudicial p WHERE p.numeroCnj = :numeroProcesso")
    boolean existsByNumeroProcesso(@Param("numeroProcesso") String numeroProcesso);

    boolean existsByNumeroCnj(String numeroCnj);
}
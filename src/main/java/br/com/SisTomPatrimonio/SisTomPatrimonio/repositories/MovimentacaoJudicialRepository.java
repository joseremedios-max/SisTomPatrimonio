package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.MovimentacaoJudicial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MovimentacaoJudicialRepository extends JpaRepository<MovimentacaoJudicial, UUID> {

    List<MovimentacaoJudicial> findByProcessoJudicialIdOrderByDataMovimentacaoDesc(UUID processoJudicialId);
}
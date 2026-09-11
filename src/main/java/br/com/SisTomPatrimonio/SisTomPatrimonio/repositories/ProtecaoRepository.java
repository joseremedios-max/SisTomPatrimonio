package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;


import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Protecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProtecaoRepository extends JpaRepository<Protecao, UUID> {

    List<Protecao> findByBemId(UUID bemId);

    List<Protecao> findByBemIdAndVigenteTrue(UUID bemId);

    Optional<Protecao> findByNumeroProcesso(String numeroProcesso);

    List<Protecao> findByEsferaAndFase(String esfera, String fase);
}
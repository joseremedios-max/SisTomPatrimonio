package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Salvaguarda;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusSalvaguarda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SalvaguardaRepository extends JpaRepository<Salvaguarda, UUID> {

    List<Salvaguarda> findByBemCulturalId(UUID bemId);

    List<Salvaguarda> findByStatus(StatusSalvaguarda status);

    List<Salvaguarda> findByOrganizacaoResponsavelId(UUID organizacaoId);
}
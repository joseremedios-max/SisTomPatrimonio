package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.LocalizacaoBem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LocalizacaoBemRepository extends JpaRepository<LocalizacaoBem, UUID> {

    Optional<LocalizacaoBem> findFirstByBemIdAndPrincipalTrue(UUID bemId);
}

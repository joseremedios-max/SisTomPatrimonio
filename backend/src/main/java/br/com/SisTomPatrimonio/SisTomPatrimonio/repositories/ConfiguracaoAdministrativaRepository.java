package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ConfiguracaoAdministrativa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConfiguracaoAdministrativaRepository extends JpaRepository<ConfiguracaoAdministrativa, UUID> {
    Optional<ConfiguracaoAdministrativa> findByChave(String chave);
}

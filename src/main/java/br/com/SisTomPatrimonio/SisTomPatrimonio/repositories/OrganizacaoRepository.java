package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositório Data JPA para operações de persistência da entidade Organizacao.
 */
@Repository
public interface OrganizacaoRepository extends JpaRepository<Organizacao, UUID> {

    Optional<Organizacao> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);

    boolean existsBySigla(String sigla);
}

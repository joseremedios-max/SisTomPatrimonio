package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositório Data JPA para operações de persistência e autenticação da entidade Usuario.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Usuario> findByEmailAndAtivoTrue(String email);

    /**
     * Consulta especializada para verificar se o usuário cadastrado possui a flag
     * de autenticação de dois fatores (2FA) ativada.
     */
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.doisFatores = true")
    Optional<Usuario> findUsuarioComDoisFatoresAtivo(@Param("email") String email);
}

package br.com.SisTomPatrimonio.SisTomPatrimonio.repositories;

import br.com.SisTomPatrimonio.SisTomPatrimonio.AbstractIntegrationTest;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

/**
 * Teste de Unidade / Integração para a camada de Repositório de Usuários (UsuarioRepository).
 * Valida o mapeamento JPA, persistência física, busca por e-mail e consulta customizada de 2FA.
 */
public class UsuarioRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private UsuarioRepository repository;

    @Test
    public void deveVerificarSalvarEBuscarUsuarioPorEmail() {
        // Cenário
        Usuario usuario = Usuario.builder()
                .nome("Técnico Teste")
                .email("tecnico.teste@secma.ma.gov.br")
                .senha("senhaHash123")
                .perfil(PerfilUsuario.TECNICO)
                .ativo(true)
                .doisFatores(false)
                .build();

        // Ação
        Usuario salvo = repository.save(usuario);

        // Verificação
        Assertions.assertNotNull(salvo.getId());
        Optional<Usuario> resultado = repository.findByEmailAndAtivoTrue("tecnico.teste@secma.ma.gov.br");
        Assertions.assertTrue(resultado.isPresent());
        Assertions.assertEquals("Técnico Teste", resultado.get().getNome());

        // Limpeza
        repository.delete(salvo);
    }

    @Test
    public void deveVerificarConsultaUsuarioComDoisFatoresAtivo() {
        // Cenário
        Usuario usuario2FA = Usuario.builder()
                .nome("Admin 2FA")
                .email("admin.2fa@secma.ma.gov.br")
                .senha("senhaHash456")
                .perfil(PerfilUsuario.ADMIN)
                .ativo(true)
                .doisFatores(true)
                .build();

        Usuario salvo = repository.save(usuario2FA);

        // Ação
        Optional<Usuario> resultado = repository.findUsuarioComDoisFatoresAtivo("admin.2fa@secma.ma.gov.br");

        // Verificação
        Assertions.assertTrue(resultado.isPresent());
        Assertions.assertTrue(resultado.get().getDoisFatores());

        // Limpeza
        repository.delete(salvo);
    }

    @Test
    public void deveVerificarRemoverUsuario() {
        // Cenário
        Usuario usuario = Usuario.builder()
                .nome("Usuário Temporário")
                .email("temp@secma.ma.gov.br")
                .senha("123")
                .perfil(PerfilUsuario.LEITOR)
                .ativo(true)
                .build();

        Usuario salvo = repository.save(usuario);

        // Ação
        repository.deleteById(salvo.getId());

        // Verificação
        Optional<Usuario> temp = repository.findById(salvo.getId());
        Assertions.assertFalse(temp.isPresent());
    }
}

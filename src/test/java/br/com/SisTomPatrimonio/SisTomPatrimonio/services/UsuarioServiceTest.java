package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

/**
 * Teste de Unidade para a camada de Serviço (UsuarioService).
 * Utiliza o Mockito para isolar a regra de negócio da infraestrutura de banco de dados.
 */
@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService service;

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    public void deveGerarErroAoTentarSalvarSemNome() {
        Usuario usuario = Usuario.builder()
                .email("teste@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.salvar(usuario);
        });

        Assertions.assertEquals("O nome do usuário deve ser informado.", exception.getMessage());
    }

    @Test
    public void deveGerarErroAoTentarSalvarComEmailDuplicado() {
        Usuario usuario = Usuario.builder()
                .nome("Carlos Silva")
                .email("carlos@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        Mockito.when(repository.existsByEmail("carlos@secma.ma.gov.br")).thenReturn(true);

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.salvar(usuario);
        });

        Assertions.assertEquals("Já existe um usuário cadastrado com este e-mail.", exception.getMessage());
    }

    @Test
    public void deveSalvarUsuarioComSucesso() {
        Usuario usuario = Usuario.builder()
                .nome("Maria Andrade")
                .email("maria@secma.ma.gov.br")
                .senha("senha123")
                .perfil(PerfilUsuario.ADMIN)
                .build();

        Usuario usuarioSalvoMock = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("Maria Andrade")
                .email("maria@secma.ma.gov.br")
                .senha("senhaCriptografadaHash")
                .perfil(PerfilUsuario.ADMIN)
                .build();

        Mockito.when(repository.existsByEmail("maria@secma.ma.gov.br")).thenReturn(false);
        Mockito.when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografadaHash");
        Mockito.when(repository.save(Mockito.any(Usuario.class))).thenReturn(usuarioSalvoMock);

        Usuario resultado = service.salvar(usuario);

        Assertions.assertNotNull(resultado.getId());
        Assertions.assertEquals("Maria Andrade", resultado.getNome());
        Mockito.verify(repository, Mockito.times(1)).save(Mockito.any(Usuario.class));
    }

    @Test
    public void deveGerarErroAoAutenticarComSenhaIncorreta() {
        Usuario usuarioMock = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("João Pedro")
                .email("joao@secma.ma.gov.br")
                .senha("senhaHashCorreta")
                .ativo(true)
                .build();

        Mockito.when(repository.findByEmailAndAtivoTrue("joao@secma.ma.gov.br")).thenReturn(Optional.of(usuarioMock));
        Mockito.when(passwordEncoder.matches("senhaErrada", "senhaHashCorreta")).thenReturn(false);

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.efetuarLogin("joao@secma.ma.gov.br", "senhaErrada");
        });

        Assertions.assertEquals("Senha incorreta. Verifique suas credenciais.", exception.getMessage());
    }

    @Test
    public void deveAutenticarUsuarioComSucesso() {
        Usuario usuarioMock = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("João Pedro")
                .email("joao@secma.ma.gov.br")
                .senha("senhaHashCorreta")
                .ativo(true)
                .build();

        Mockito.when(repository.findByEmailAndAtivoTrue("joao@secma.ma.gov.br")).thenReturn(Optional.of(usuarioMock));
        Mockito.when(passwordEncoder.matches("senhaHashCorreta", "senhaHashCorreta")).thenReturn(true);
        Mockito.when(repository.save(Mockito.any(Usuario.class))).thenReturn(usuarioMock);

        Usuario resultado = service.efetuarLogin("joao@secma.ma.gov.br", "senhaHashCorreta");

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals("joao@secma.ma.gov.br", resultado.getEmail());
    }
}

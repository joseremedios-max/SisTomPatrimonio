package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @InjectMocks
    private UsuarioService service;

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Test
    public void deveGerarErroAoTentarSalvarSemNome() {
        UsuarioDTO dto = UsuarioDTO.builder()
                .email("teste@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.cadastrar(dto);
        });

        Assertions.assertEquals("O nome do usuário deve ser informado.", exception.getMessage());
    }

    @Test
    public void deveGerarErroAoTentarSalvarSemEmail() {
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Carlos Silva")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.cadastrar(dto);
        });

        Assertions.assertEquals("O e-mail do usuário deve ser informado.", exception.getMessage());
    }

    @Test
    public void deveGerarErroAoTentarSalvarSemSenha() {
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Carlos Silva")
                .email("carlos@secma.ma.gov.br")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.cadastrar(dto);
        });

        Assertions.assertEquals("A senha do usuário deve ser informada.", exception.getMessage());
    }

    @Test
    public void deveGerarErroAoTentarSalvarComEmailDuplicado() {
        UsuarioDTO dto = UsuarioDTO.builder()
                .nome("Carlos Silva")
                .email("carlos@secma.ma.gov.br")
                .senha("123456")
                .perfil(PerfilUsuario.TECNICO)
                .build();

        Mockito.when(repository.existsByEmail("carlos@secma.ma.gov.br")).thenReturn(true);

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.cadastrar(dto);
        });

        Assertions.assertEquals("Já existe um usuário cadastrado com este e-mail.", exception.getMessage());
    }

    @Test
    public void deveSalvarUsuarioComSucesso() {
        UsuarioDTO dto = UsuarioDTO.builder()
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
                .ativo(true)
                .build();

        Mockito.when(repository.existsByEmail("maria@secma.ma.gov.br")).thenReturn(false);
        Mockito.when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografadaHash");
        Mockito.when(repository.save(Mockito.any(Usuario.class))).thenReturn(usuarioSalvoMock);

        UsuarioResponseDTO resultado = service.cadastrar(dto);

        Assertions.assertNotNull(resultado.getId());
        Assertions.assertEquals("Maria Andrade", resultado.getNome());
        Mockito.verify(repository, Mockito.times(1)).save(Mockito.any(Usuario.class));
        Mockito.verify(eventPublisher, Mockito.times(1)).publishEvent(Mockito.any(AuditoriaEvent.class));
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

        UsuarioResponseDTO resultado = service.efetuarLogin("joao@secma.ma.gov.br", "senhaHashCorreta");

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals("joao@secma.ma.gov.br", resultado.getEmail());
        Mockito.verify(eventPublisher, Mockito.times(1)).publishEvent(Mockito.any(AuditoriaEvent.class));
    }

    @Test
    public void deveGerarErroAoAutenticarComEmailInexistente() {
        Mockito.when(repository.findByEmailAndAtivoTrue("inexistente@secma.ma.gov.br")).thenReturn(Optional.empty());

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.efetuarLogin("inexistente@secma.ma.gov.br", "qualquerSenha");
        });

        Assertions.assertEquals("Usuário não encontrado ou inativo.", exception.getMessage());
    }

    @Test
    public void deveBuscarPorIdComSucesso() {
        UUID id = UUID.randomUUID();
        Usuario usuario = Usuario.builder()
                .id(id)
                .nome("Luciana")
                .email("luciana@secma.ma.gov.br")
                .perfil(PerfilUsuario.ADMIN)
                .ativo(true)
                .build();

        Mockito.when(repository.findById(id)).thenReturn(Optional.of(usuario));

        UsuarioResponseDTO resultado = service.buscarPorId(id);

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals("Luciana", resultado.getNome());
        Assertions.assertEquals("luciana@secma.ma.gov.br", resultado.getEmail());
    }

    @Test
    public void deveGerarErroAoBuscarPorIdInexistente() {
        UUID id = UUID.randomUUID();
        Mockito.when(repository.findById(id)).thenReturn(Optional.empty());

        RegraNegocioRunTime exception = Assertions.assertThrows(RegraNegocioRunTime.class, () -> {
            service.buscarPorId(id);
        });

        Assertions.assertEquals("Usuário não encontrado.", exception.getMessage());
    }
}

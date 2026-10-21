package br.com.SisTomPatrimonio.SisTomPatrimonio.config;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.PerfilUsuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
@Profile("dev")
@Order(1)
public class DevAdminInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;

    public DevAdminInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.dev.admin.email:admin@local.test}") String email,
            @Value("${app.dev.admin.password:Admin@12345}") String password) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        garantirUsuario(email, "Administrador Geral SECMA", PerfilUsuario.ADMIN, password);
        garantirUsuario("tecnico@local.test", "Perito Técnico IPHAN/SECMA", PerfilUsuario.TECNICO, "Tecnico@12345");
        garantirUsuario("juridico@local.test", "Procurador Jurídico PGE/SECMA", PerfilUsuario.JURIDICO, "Juridico@12345");
        garantirUsuario("consultor@local.test", "Consultor Patrimonial Credenciado", PerfilUsuario.CONSULTOR, "Consultor@12345");
        garantirUsuario("leitor@local.test", "Auditor / Consulta Interna", PerfilUsuario.LEITOR, "Leitor@12345");
    }

    private void garantirUsuario(String emailUsuario, String nome, PerfilUsuario perfil, String senhaPura) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElseGet(() -> Usuario.builder()
                .email(emailUsuario)
                .doisFatores(false)
                .criadoEm(OffsetDateTime.now())
                .build());
        usuario.setNome(nome);
        usuario.setSenha(passwordEncoder.encode(senhaPura));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }
}

package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.events.AuditoriaEvent;
import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public UsuarioResponseDTO cadastrar(UsuarioDTO dto) {
        if (dto == null) {
            throw new RegraNegocioRunTime("Dados do usuário não informados.");
        }

        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new RegraNegocioRunTime("O nome do usuário deve ser informado.");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RegraNegocioRunTime("O e-mail do usuário deve ser informado.");
        }

        if (repository.existsByEmail(dto.getEmail())) {
            throw new RegraNegocioRunTime("Já existe um usuário cadastrado com este e-mail.");
        }

        if (dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new RegraNegocioRunTime("A senha do usuário deve ser informada.");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .perfil(dto.getPerfil())
                .ativo(true)
                .criadoEm(OffsetDateTime.now())
                .build();

        Usuario salvo = repository.save(usuario);

        eventPublisher.publishEvent(AuditoriaEvent.builder()
                .entidade("USUARIO")
                .entidadeId(salvo.getId())
                .acao("CRIACAO")
                .usuarioId(salvo.getId())
                .dadosNovos(Map.of("email", salvo.getEmail(), "perfil", salvo.getPerfil().name()))
                .origem("USUARIO_SERVICE")
                .build());

        return converterParaResponseDTO(salvo);
    }

    @Transactional
    public Usuario salvar(Usuario usuario) {
        if (usuario == null) {
            throw new RegraNegocioRunTime("Dados do usuário não informados.");
        }

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new RegraNegocioRunTime("O nome do usuário deve ser informado.");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RegraNegocioRunTime("O e-mail do usuário deve ser informado.");
        }

        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RegraNegocioRunTime("Já existe um usuário cadastrado com este e-mail.");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RegraNegocioRunTime("A senha do usuário deve ser informada.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        if (usuario.getAtivo() == null) {
            usuario.setAtivo(true);
        }

        return repository.save(usuario);
    }

    @Transactional
    public UsuarioResponseDTO efetuarLogin(String email, String senha) {
        Optional<Usuario> usuarioOpt = repository.findByEmailAndAtivoTrue(email);
        if (usuarioOpt.isEmpty()) {
            throw new RegraNegocioRunTime("Usuário não encontrado ou inativo.");
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RegraNegocioRunTime("Senha incorreta. Verifique suas credenciais.");
        }

        usuario.registrarAcesso();
        Usuario salvo = repository.save(usuario);

        eventPublisher.publishEvent(AuditoriaEvent.builder()
                .entidade("USUARIO")
                .entidadeId(salvo.getId())
                .acao("LOGIN")
                .usuarioId(salvo.getId())
                .dadosNovos(Map.of("email", salvo.getEmail()))
                .origem("AUTH_SERVICE")
                .build());

        return converterParaResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(UUID id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RegraNegocioRunTime("Usuário não encontrado."));
        return converterParaResponseDTO(usuario);
    }

    public UsuarioResponseDTO converterParaResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .ativo(usuario.getAtivo())
                .criadoEm(usuario.getCriadoEm())
                .ultimoAcessoEm(usuario.getUltimoAcessoEm())
                .build();
    }
}

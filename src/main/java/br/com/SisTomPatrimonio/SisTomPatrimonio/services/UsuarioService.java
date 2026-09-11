package br.com.SisTomPatrimonio.SisTomPatrimonio.services;

import br.com.SisTomPatrimonio.SisTomPatrimonio.exceptions.RegraNegocioRunTime;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Usuario;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

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
    public Usuario efetuarLogin(String email, String senha) {
        Optional<Usuario> usuarioOpt = repository.findByEmailAndAtivoTrue(email);
        if (usuarioOpt.isEmpty()) {
            throw new RegraNegocioRunTime("Usuário não encontrado ou inativo.");
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RegraNegocioRunTime("Senha incorreta. Verifique suas credenciais.");
        }

        usuario.registrarAcesso();
        return repository.save(usuario);
    }
}

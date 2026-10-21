package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.OrganizacaoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioResponseDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.UsuarioDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.services.UsuarioService;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.Organizacao;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.OrganizacaoRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/administracao")
public class AdministracaoController {
    private final UsuarioRepository usuarioRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final UsuarioService usuarioService;

    public AdministracaoController(UsuarioRepository usuarioRepository,
                                   OrganizacaoRepository organizacaoRepository,
                                   UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuarios")
    public List<UsuarioResponseDTO> usuarios() {
        return usuarioRepository.findAll().stream().map(usuario -> UsuarioResponseDTO.builder()
                .id(usuario.getId()).nome(usuario.getNome()).email(usuario.getEmail())
                .perfil(usuario.getPerfil()).ativo(usuario.getAtivo())
                .criadoEm(usuario.getCriadoEm()).ultimoAcessoEm(usuario.getUltimoAcessoEm()).build()).toList();
    }

    @PatchMapping("/usuarios/{id}/ativo")
    public ResponseEntity<Void> alterarAtivo(@PathVariable UUID id, @RequestParam boolean ativo) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        usuario.setAtivo(ativo);
        usuarioRepository.save(usuario);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrar(dto));
    }

    @PutMapping("/usuarios/{id}")
    public UsuarioResponseDTO atualizarUsuario(@PathVariable UUID id, @Valid @RequestBody UsuarioDTO dto) {
        return usuarioService.atualizar(id, dto);
    }

    @GetMapping("/organizacoes")
    public List<OrganizacaoDTO> organizacoes() {
        return organizacaoRepository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping("/organizacoes")
    public ResponseEntity<OrganizacaoDTO> criarOrganizacao(@Valid @RequestBody OrganizacaoDTO dto) {
        if (dto.getCnpj() != null && organizacaoRepository.existsByCnpj(dto.getCnpj())) {
            throw new IllegalArgumentException("Organização já cadastrada com este CNPJ.");
        }
        Organizacao organizacao = organizacaoRepository.save(Organizacao.builder()
                .nome(dto.getNome()).sigla(dto.getSigla()).tipo(dto.getTipo())
                .esfera(dto.getEsfera()).cnpj(dto.getCnpj()).email(dto.getEmail())
                .telefone(dto.getTelefone()).ativo(dto.getAtivo() == null || dto.getAtivo()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(organizacao));
    }

    private OrganizacaoDTO toDto(Organizacao organizacao) {
        OrganizacaoDTO dto = new OrganizacaoDTO();
        dto.setId(organizacao.getId()); dto.setNome(organizacao.getNome());
        dto.setSigla(organizacao.getSigla()); dto.setTipo(organizacao.getTipo());
        dto.setEsfera(organizacao.getEsfera()); dto.setCnpj(organizacao.getCnpj());
        dto.setEmail(organizacao.getEmail()); dto.setTelefone(organizacao.getTelefone());
        dto.setAtivo(organizacao.getAtivo());
        return dto;
    }
}

package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.ConfiguracaoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities.ConfiguracaoAdministrativa;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ConfiguracaoAdministrativaRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/configuracoes")
public class ConfiguracaoController {
    private final ConfiguracaoAdministrativaRepository repository;

    public ConfiguracaoController(ConfiguracaoAdministrativaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ConfiguracaoAdministrativa> listar() {
        return repository.findAll();
    }

    @PutMapping("/{chave}")
    public ConfiguracaoAdministrativa salvar(@PathVariable String chave, @Valid @RequestBody ConfiguracaoDTO dto) {
        var configuracao = repository.findByChave(chave).orElseGet(ConfiguracaoAdministrativa::new);
        configuracao.setChave(chave);
        configuracao.setValor(dto.getValor());
        configuracao.setAtualizadoEm(OffsetDateTime.now());
        return repository.save(configuracao);
    }
}

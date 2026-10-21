package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.RelatorioResumoDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.VistoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/relatorios")
public class RelatorioController {
    private final BemCulturalRepository bemRepository;
    private final VistoriaRepository vistoriaRepository;
    private final ProcessoJudicialRepository processoRepository;

    public RelatorioController(BemCulturalRepository bemRepository, VistoriaRepository vistoriaRepository,
                               ProcessoJudicialRepository processoRepository) {
        this.bemRepository = bemRepository;
        this.vistoriaRepository = vistoriaRepository;
        this.processoRepository = processoRepository;
    }

    @GetMapping("/resumo")
    public RelatorioResumoDTO resumo() {
        var bens = bemRepository.findAll();
        var vistorias = vistoriaRepository.findAll();
        var processos = processoRepository.findAll();
        return RelatorioResumoDTO.builder()
                .totalBens(bens.size())
                .totalVistorias(vistorias.size())
                .totalProcessos(processos.size())
                .bensPorNatureza(bens.stream().collect(Collectors.groupingBy(b -> b.getNatureza().name(), Collectors.counting())))
                .bensPorStatus(bens.stream().collect(Collectors.groupingBy(b -> b.getStatus(), Collectors.counting())))
                .vistoriasPorRisco(vistorias.stream().map(v -> v.getNivelRisco() == null ? "NAO_INFORMADO" : v.getNivelRisco()).collect(Collectors.groupingBy(Function.identity(), Collectors.counting())))
                .processosPorFase(processos.stream().collect(Collectors.groupingBy(p -> p.getFase().name(), Collectors.counting())))
                .build();
    }
}

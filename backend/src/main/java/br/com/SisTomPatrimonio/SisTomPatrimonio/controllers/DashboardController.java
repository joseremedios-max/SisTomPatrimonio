package br.com.SisTomPatrimonio.SisTomPatrimonio.controllers;

import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.AlertaDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.dtos.DashboardDTO;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.BemCulturalRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.ProcessoJudicialRepository;
import br.com.SisTomPatrimonio.SisTomPatrimonio.repositories.VistoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final BemCulturalRepository bemRepository;
    private final VistoriaRepository vistoriaRepository;
    private final ProcessoJudicialRepository processoRepository;

    @GetMapping
    public DashboardDTO dashboard() {
        return DashboardDTO.builder()
                .totalBens(bemRepository.count())
                .bensPublicados(bemRepository.countByStatus("PUBLICADO"))
                .bensEmRevisao(bemRepository.countByStatus("EM_REVISAO"))
                .vistoriasPendentes(vistoriaRepository.countByStatus("PLANEJADA"))
                .bensAltoRisco(vistoriaRepository.findByNivelRiscoIn(List.of("ALTO", "CRITICO")).size())
                .processosAbertos(processoRepository.count())
                .build();
    }

    @GetMapping("/alertas")
    public List<AlertaDTO> alertas() {
        var alertasRisco = vistoriaRepository.findByNivelRiscoIn(List.of("ALTO", "CRITICO")).stream()
                .map(v -> AlertaDTO.builder()
                        .tipo("RISCO_CONSERVACAO")
                        .severidade("CRITICO".equalsIgnoreCase(v.getNivelRisco()) ? "CRITICA" : "ALTA")
                        .mensagem("Bem em situação de risco: " + v.getBem().getNome())
                        .referenciaId(v.getBem().getId())
                        .build())
                .toList();
        var alertasProcessuais = processoRepository.findAll().stream()
                .filter(processo -> processo.getDataEncerramento() == null)
                .map(processo -> AlertaDTO.builder()
                        .tipo("PROCESSO_JUDICIAL")
                        .severidade(processo.getSegredoJustica() ? "RESTRITA" : "MEDIA")
                        .mensagem("Processo judicial ativo: " + processo.getNumeroProcesso())
                        .referenciaId(processo.getId())
                        .build())
                .toList();
        return java.util.stream.Stream.concat(alertasRisco.stream(), alertasProcessuais.stream()).toList();
    }
}

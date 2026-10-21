package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.Builder;
import lombok.Value;

import java.util.Map;

@Value
@Builder
public class RelatorioResumoDTO {
    long totalBens;
    long totalVistorias;
    long totalProcessos;
    Map<String, Long> bensPorNatureza;
    Map<String, Long> bensPorStatus;
    Map<String, Long> vistoriasPorRisco;
    Map<String, Long> processosPorFase;
}

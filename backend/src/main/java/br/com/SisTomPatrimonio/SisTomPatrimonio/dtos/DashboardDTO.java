package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DashboardDTO {
    long totalBens;
    long bensPublicados;
    long bensEmRevisao;
    long vistoriasPendentes;
    long bensAltoRisco;
    long processosAbertos;
}

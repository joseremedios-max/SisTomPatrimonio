package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class AlertaDTO {
    String tipo;
    String severidade;
    String mensagem;
    UUID referenciaId;
}

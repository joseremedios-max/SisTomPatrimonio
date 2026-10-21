package br.com.SisTomPatrimonio.SisTomPatrimonio.events;

import lombok.Builder;
import lombok.Value;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Value
@Builder
public class AuditoriaEvent {
    String entidade;
    UUID entidadeId;
    String acao;
    UUID usuarioId;
    Map<String, Object> dadosAnteriores;
    Map<String, Object> dadosNovos;
    String origem;
    UUID correlationId;
    @Builder.Default
    OffsetDateTime timestamp = OffsetDateTime.now();
}

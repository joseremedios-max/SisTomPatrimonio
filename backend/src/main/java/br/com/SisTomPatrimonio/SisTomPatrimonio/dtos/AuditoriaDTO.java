package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriaDTO {
    private Long id;
    private UUID usuarioId;
    private String usuarioNome;
    private OffsetDateTime ocorridoEm;
    private String acao;
    private String entidade;
    private UUID entidadeId;
    private Map<String, Object> dadosAnteriores;
    private Map<String, Object> dadosNovos;
    private String origem;
    private UUID correlationId;
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public class VistoriaDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "O código é obrigatório.")
        private String codigo;

        @NotNull(message = "O ID do bem cultural é obrigatório.")
        private UUID bemId;

        private UUID responsavelId;
        private UUID organizacaoId;
        private OffsetDateTime agendadaEm;
        private String situacaoConservacao;
        private String nivelRisco;
        private String resumo;
        private String recomendacao;
        private LocalDate proximaVistoria;
        private Map<String, Object> equipe;
        private Map<String, Object> patologias;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private String codigo;
        private UUID bemId;
        private String bemNome;
        private String status;
        private String responsavelNome;
        private OffsetDateTime agendadaEm;
        private OffsetDateTime realizadaEm;
        private String situacaoConservacao;
        private String nivelRisco;
        private Boolean homologada;
        private OffsetDateTime criadoEm;
    }
}
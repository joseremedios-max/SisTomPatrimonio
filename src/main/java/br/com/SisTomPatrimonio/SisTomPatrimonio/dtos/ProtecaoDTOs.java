package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class ProtecaoDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotNull(message = "O ID do bem cultural é obrigatório.")
        private UUID bemId;

        @NotBlank(message = "O número do processo é obrigatório.")
        private String numeroProcesso;

        private UUID organizacaoId;
        private String esfera;
        private String fase;
        private String tipoProtecao;
        private LocalDate dataAbertura;
        private LocalDate dataDecisao;
        private String atoNormativo;
        private String livroTombo;
        private String numeroInscricao;
        private String observacao;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID bemId;
        private String bemNome;
        private String numeroProcesso;
        private String esfera;
        private String fase;
        private String tipoProtecao;
        private Boolean vigente;
        private LocalDate dataAbertura;
        private OffsetDateTime criadoEm;
    }
}
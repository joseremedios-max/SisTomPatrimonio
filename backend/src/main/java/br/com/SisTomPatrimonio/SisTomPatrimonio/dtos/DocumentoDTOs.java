package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public class DocumentoDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "O título é obrigatório.")
        private String titulo;

        private String categoria;
        private String classificacao;
        private UUID bemId;
        private UUID vistoriaId;
        private UUID protecaoId;

        @NotBlank(message = "O nome do arquivo é obrigatório.")
        private String nomeArquivo;

        private String mimeType;
        private Long tamanhoBytes;

        @NotBlank(message = "A chave de armazenamento é obrigatória.")
        private String storageKey;

        private String sha256;
        private LocalDate dataDocumento;
        private String descricao;
        private Map<String, Object> metadados;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private String codigo;
        private String titulo;
        private String categoria;
        private String classificacao;
        private String statusValidacao;
        private String nomeArquivo;
        private String storageKey;
        private String sha256;
        private Integer versao;
        private Boolean publicacaoAutorizada;
        private OffsetDateTime criadoEm;
    }
}
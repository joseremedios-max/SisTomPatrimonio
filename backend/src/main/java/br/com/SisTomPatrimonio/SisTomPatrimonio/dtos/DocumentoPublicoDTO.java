package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class DocumentoPublicoDTO {
    private UUID id;
    private String codigo;
    private String titulo;
    private String categoria;
    private String nomeArquivo;
    private String mimeType;
    private Long tamanhoBytes;
    private LocalDate dataDocumento;
    private String descricao;
}

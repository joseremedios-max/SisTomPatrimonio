package br.com.SisTomPatrimonio.SisTomPatrimonio.models.entities;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true)
    private String codigo;

    @Column(nullable = false)
    private String titulo;

    private String categoria;

    @Builder.Default
    @Column(nullable = false)
    private String classificacao = "INTERNA";

    @Builder.Default
    @Column(name = "status_validacao", nullable = false)
    private String statusValidacao = "PENDENTE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bem_id")
    private BemCultural bem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vistoria_id")
    private Vistoria vistoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "protecao_id")
    private Protecao protecao;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @Column(name = "storage_key", nullable = false)
    private String storageKey; // Caminho MinIO/S3 ou File System Local

    @Column(length = 64)
    private String sha256; // Checksum de Integridade Hashing

    @Builder.Default
    @Column(nullable = false)
    private Integer versao = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(name = "autoria_externa")
    private String autoriaExterna;

    @Column(name = "data_documento")
    private LocalDate dataDocumento;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column
    private Map<String, Object> metadados;

    @Builder.Default
    @Column(name = "publicacao_autorizada", nullable = false)
    private Boolean publicacaoAutorizada = false;

    @Builder.Default
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm = OffsetDateTime.now();
}
package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.NaturezaBem;
import br.com.SisTomPatrimonio.SisTomPatrimonio.models.enums.StatusBemCultural;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class BemCulturalResponseDTO {

    private UUID id;
    private String codigo;
    private NaturezaBem natureza;
    private String nome;
    private String resumoPublico;
    private String descricao;
    private StatusBemCultural status;
    private String organizacaoNome;

    // Coordenadas para renderização em mapas (Leaflet/MapLibre no frontend)
    private Double latitude;
    private Double longitude;

    private BigDecimal areaConstruidaM2;
    private Map<String, Object> dadosEspecificos;
    private OffsetDateTime criadoEm;
}
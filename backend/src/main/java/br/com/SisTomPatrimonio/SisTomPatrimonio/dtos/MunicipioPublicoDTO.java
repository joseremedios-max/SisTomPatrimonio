package br.com.SisTomPatrimonio.SisTomPatrimonio.dtos;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class MunicipioPublicoDTO {
    UUID id;
    String codigoIbge;
    String nome;
    String uf;
}

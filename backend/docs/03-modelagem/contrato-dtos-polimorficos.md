# Contrato de DTOs Polimórficos do Bem Cultural

## Objetivo

O endpoint de cadastro recebe os atributos comuns do bem e um objeto
`dadosEspecificos`. O campo `natureza` define qual DTO especializado valida o
conteúdo antes que ele seja convertido para JSONB.

## Estrutura do Payload

```json
{
  "nome": "Palácio dos Leões",
  "natureza": "MATERIAL_EDIFICADO",
  "classificacao": "PUBLICA",
  "dadosEspecificos": {
    "tipoImovel": "Casarão Histórico",
    "areaConstruidaM2": 450.0,
    "dominioAtual": "PUBLICO"
  }
}
```

## Tipos Suportados

| `natureza` | Implementação | Validações principais |
| :--- | :--- | :--- |
| `MATERIAL_EDIFICADO` | `DadosMaterialEdificadoDTO` | tipo do imóvel, área maior que zero e domínio atual |
| `IMATERIAL` | `DadosImaterialDTO` | categoria e contexto da prática obrigatórios |
| `ARQUEOLOGICO` | `DadosArqueologicoDTO` | tipo do sítio e período cultural obrigatórios |

O contrato é implementado por `DadosEspecificosDTO` e pelas anotações
`@JsonTypeInfo`, `@JsonSubTypes`, `@Valid` e `@NotNull` em `BemCulturalDTO`.

A propriedade `natureza` funciona como discriminador polimórfico do Jackson:

```java
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "natureza",
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = DadosImaterialDTO.class, name = "IMATERIAL"),
    @JsonSubTypes.Type(value = DadosMaterialEdificadoDTO.class, name = "MATERIAL_EDIFICADO"),
    @JsonSubTypes.Type(value = DadosArqueologicoDTO.class, name = "ARQUEOLOGICO")
})
public interface DadosEspecificosDTO {
}
```

O valor de `natureza` determina a desserialização e a validação do DTO
especializado, enquanto os atributos específicos são persistidos em
`bem_cultural.dados_especificos`.

### Payload `IMATERIAL`

```json
{
  "nome": "Tambor de Crioula do Maranhão",
  "natureza": "IMATERIAL",
  "classificacao": "REGISTRO_ESTADUAL",
  "dadosEspecificos": {
    "categoriaImaterial": "Dança e manifestação musical",
    "contextoPratica": "Celebrações comunitárias tradicionais",
    "comunidadeDetentora": "Grupos tradicionais do Maranhão"
  }
}
```

Os payloads `IMATERIAL` e `MATERIAL_EDIFICADO` possuem a mesma estrutura
externa, mas apresentam atributos diferentes dentro de `dadosEspecificos`,
conforme a natureza do bem.

## Persistência

O serviço converte a implementação concreta para `Map<String, Object>` usando
Jackson. O mapa é persistido em `bem_cultural.dados_especificos`, mapeado pelo
Hibernate 6 com `@JdbcTypeCode(SqlTypes.JSON)`.

Adicionar uma nova natureza exige criar o DTO, registrar o subtipo Jackson,
adicionar suas validações e cobrir o contrato com testes. Não exige, por si só,
uma nova coluna na tabela mestre.

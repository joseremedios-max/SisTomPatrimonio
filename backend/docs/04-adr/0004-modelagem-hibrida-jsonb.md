# ADR 0004: Modelagem Híbrida com JSONB para Dados Semiestruturados

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê de Desenvolvimento

---

## 1. Contexto e Declaração do Problema
O domínio de patrimônio cultural envolve dados com graus de dinamismo muito distintos:
* Laudos de vistoria técnica registram listas variáveis de patologias (trincas, cupins, umidade) e membros de equipe pericial.
* Bens culturais possuem detalhes decorativos ou etnográficos muito singulares (mestres de cultura popular, rituais, detalhes de prospecção arqueológica).
* Planos de salvaguarda contêm listas de metas e prazos.

A abordagem relacional purista exigiria criar 4 a 6 tabelas associativas extras (`vistoria_patologia`, `vistoria_equipe`, `salvaguarda_acao`, `bem_caracteristica_extra`), aumentando o número de JOINs e a complexidade do ORM.

### Arquitetura Anterior: Single Table

A modelagem anterior utilizava uma estratégia **Single Table**, concentrando na
tabela `bem_cultural` os atributos comuns e os atributos específicos de todas
as naturezas de patrimônio.

Essa abordagem gerava 18 colunas específicas, muitas delas nulas dependendo da
natureza do bem, como atributos de patrimônio edificado, patrimônio imaterial
e sítios arqueológicos. Além do desperdício estrutural, o modelo dificultava a
evolução do domínio e aumentava a complexidade das validações.

### Transição para a Modelagem Híbrida

A Solução C elimina as 18 colunas específicas da entidade central
`bem_cultural`. Os atributos variáveis passam a ser armazenados no campo
`dados_especificos JSONB`.

A tabela mantém apenas os atributos comuns, de controle, segurança e auditoria.
A estrutura interna do JSONB é validada por DTOs polimórficos conforme o valor
de `natureza`.

---

## 2. Opções Consideradas
* **Opção 1**: Normalização relacional estrita (3NF) com tabelas associativas para cada lista aninhada.
* **Opção 2**: Serialização em texto/XML puro.
* **Opção 3**: Modelagem híbrida utilizando colunas nativas **JSONB** do PostgreSQL com anotação `@JdbcTypeCode(SqlTypes.JSON)` do Hibernate 6.

---

## 3. Decisão Tomada
Adotar a **Opção 3 — Modelagem Híbrida com JSONB**:
* As tabelas `bem_cultural` (`dados_especificos`), `vistoria` (`equipe`, `patologias`), `salvaguarda` (`acoes`) e `auditoria` (`dados_anteriores`, `dados_novos`) utilizam tipo `jsonb`.
* O Hibernate 6 mapeia essas colunas diretamente para `Map<String, Object>` ou DTOs Java sem necessidade de plugins proprietários.
* Em `bem_cultural`, os atributos específicos de material edificado, patrimônio imaterial e sítios arqueológicos ficam exclusivamente em `dados_especificos`.
* A API usa `DadosEspecificosDTO` e implementações especializadas para validar o payload conforme `natureza` antes da persistência.
* O índice `idx_bem_cultural_dados_especificos` usa GIN para acelerar consultas por chaves e valores JSONB.

O índice é criado com a seguinte definição:

```sql
CREATE INDEX idx_bem_cultural_dados_especificos
    ON bem_cultural
    USING GIN (dados_especificos);
```

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* Redução drástica da complexidade relacional e eliminação de JOINs custosos.
* Flexibilidade para peritos registrarem campos dinâmicos sem alterar o schema do banco.
* Capacidade de indexação com índice GIN no PostgreSQL para buscas analíticas em campos JSON. O índice atual usa a classe padrão do PostgreSQL; `jsonb_path_ops` permanece uma alternativa para uma necessidade específica de consulta.

### Impactos Negativos (Custos):
* A validação da estrutura interna do JSONB passa a ser responsabilidade da camada de aplicação (`Services` e Bean Validation nos DTOs) em vez de constraints do banco de dados.
* A solução não é schema-less irrestrita: DTOs, regras de negócio, versionamento de contratos e testes continuam sendo a governança dos atributos dinâmicos.
* Consultas JSONB devem ser avaliadas com planos de execução; GIN melhora a busca, mas não promete desempenho equivalente a uma coluna física em qualquer predicado.

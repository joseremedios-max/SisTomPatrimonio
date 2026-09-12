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

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* Redução drástica da complexidade relacional e eliminação de JOINs custosos.
* Flexibilidade para peritos registrarem campos dinâmicos sem alterar o schema do banco.
* Capacidade de indexação com índices GIN (`jsonb_path_ops`) no PostgreSQL caso sejam necessárias buscas analíticas em campos JSON.

### Impactos Negativos (Custos):
* A validação da estrutura interna do JSONB passa a ser responsabilidade da camada de aplicação (`Services` e Bean Validation nos DTOs) em vez de constraints do banco de dados.

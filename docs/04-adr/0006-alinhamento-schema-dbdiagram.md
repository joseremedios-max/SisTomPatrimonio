# ADR 0006: Alinhamento Estrito do Schema Físico com o dbdiagram Oficial

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê Técnico e Coordenação do Projeto

---

## 1. Contexto e Declaração do Problema
Durante as primeiras iterações do protótipo, o script Flyway inicial (`V1__criar_schema_sipma.sql`) foi gerado a partir do `dbdiagram` oficial fornecido pelo comitê acadêmico. Contudo, 4 entidades JPA (`Salvaguarda`, `EventoBem`, `ProcessoJudicial` e `ProcessoBem`) foram desenvolvidas com nomes de colunas e relacionamentos divergentes do DDL oficial:
* Em `salvaguarda`: entidade usava `plano_acao` enquanto o DDL usava `titulo`, `versao`, `acoes JSONB`.
* Em `evento_bem`: entidade usava `tipo_evento` e `responsavel_id` enquanto o DDL usava `tipo` e `organizacao_id`.
* Em `processo_judicial`: entidade usava `numero_processo` e `assunto` enquanto o DDL usava `numero_cnj` e `objeto`.
* Em `processo_bem`: entidade usava `processo_judicial_id` e `bem_cultural_id` enquanto o DDL usava `processo_id` e `bem_id`.

Essa divergência causava crash imediato na inicialização da aplicação contra o PostgreSQL sob a diretiva `spring.jpa.hibernate.ddl-auto=validate`.

---

## 2. Opções Consideradas
* **Opção 1**: Alterar o script de migração Flyway e o `dbdiagram` para se adaptarem às classes Java.
* **Opção 2**: Manter o `dbdiagram` oficial como a **Fonte da Verdade Única** e refatorar as 4 entidades JPA para espelharem com precisão o modelo de dados acordado.

---

## 3. Decisão Tomada
Adotar a **Opção 2**. O `dbdiagram` aprovado pela coordenação do projeto é a especificação oficial de dados. As entidades JPA, DTOs e Services devem ser refatorados para manter conformidade absoluta com o schema físico versionado no Flyway.

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* A aplicação valida com sucesso o schema físico (`ddl-auto: validate`) em ambiente de produção com PostgreSQL + PostGIS.
* Elimina divergências conceituais entre o time de banco de dados/arquitetura e os desenvolvedores backend.

### Impactos Negativos (Custos):
* Necessidade de ajustar os testes unitários e DTOs que faziam referência aos atributos antigos.

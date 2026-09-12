# ADR 0005: Estratégia Zero-Bytea para Mídias Digitais e Validação por Hash SHA-256

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê de Desenvolvimento e Infraestrutura

---

## 1. Contexto e Declaração do Problema
O acervo do SIP-MA armazena um alto volume de arquivos pesados: fotos de alta resolução de fachadas históricas, plantas arquitetônicas em PDF, certidões de cartório e peças judiciais.
Salvar arquivos binários diretamente em colunas `bytea` ou `BLOB` no banco relacional provoca:
* Inchaço exponencial do banco de dados (tabelas TOAST massivas).
* Lentidão em backups (`pg_dump`) e restaurações.
* Desperdício de memória RAM no pool de buffers do banco.

---

## 2. Opções Consideradas
* **Opção 1**: Armazenar os bytes no PostgreSQL via coluna `bytea`.
* **Opção 2**: Armazenar os arquivos no sistema de arquivos local do servidor sem nenhum hash de verificação.
* **Opção 3**: Estratégia **Zero-Bytea** com storage desacoplado (S3/MinIO/Local) + persistência de metadados e cálculo de hash **SHA-256** no banco de dados.

---

## 3. Decisão Tomada
Adotar a **Opção 3 — Estratégia Zero-Bytea com Hash SHA-256**:
1. A tabela `documento` armazena apenas metadados técnicos: `storage_key`, `nome_arquivo`, `mime_type`, `tamanho_bytes` e `sha256`.
2. O binário é gravado em storage de objetos ou volume desacoplado através de uma interface de serviço (`StorageService`).
3. O hash SHA-256 é calculado na ingestão e garante o não-repúdio e a detecção de adulteração de documentos periciais.

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* Banco de dados leve, rápido e com backups ágeis.
* Possibilidade de troca de provedor de storage (de disco local para AWS S3 ou MinIO) sem alterar o schema do banco nem a lógica de domínio.
* Garantia legal de integridade dos laudos periciais.

### Impactos Negativos (Custos):
* Exige gerenciar o ciclo de vida do arquivo no storage caso o registro no banco seja excluído (necessidade de rotinas de limpeza de arquivos órfãos).

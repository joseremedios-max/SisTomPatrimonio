# ADR 0008: Abstracao de Armazenamento via Strategy Pattern e Integridade SHA-256

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comite de Desenvolvimento

---

## 1. Contexto e Declaracao do Problema

Em conformidade com a ADR-0005 (Estrategia Zero-Bytea para Midias), o banco de dados PostgreSQL nao armazena blobs binarios de fotos, mapas e laudos periciais, mas apenas metadados e ponteiros de armazenamento (`storage_key`).

No entanto, o ambiente de execucao varia conforme o estagio do ciclo de vida do software:
* Em **desenvolvimento e testes automatizados**, os arquivos devem ser armazenados de forma agil em disco local ou diretorios temporarios, sem depender de conexao com a internet ou credenciais de nuvem.
* Em **producao e homologacao**, os arquivos devem ser persistidos em servicos de storage de objetos distribuidos (como AWS S3, MinIO ou storage governamental SECMA).

Acoplar diretamente o servico de negocios `DocumentoService` a APIs de disco (`java.nio.file.Files`) ou SDKs proprietarios (ex: AWS SDK) viola os principios SOLID:
* **Principio da Responsabilidade Unica (SRP)**: O servico de documentos acumula regras de catalogacao patrimonial com regras de I/O de infraestrutura.
* **Principio Aberto/Fechado (OCP)**: A adocao de um novo provedor de nuvem exigiria modificar a classe de negocio.
* **Principio da Inversao de Dependencia (DIP)**: Modulos de alto nivel dependendo diretamente de modulos de baixo nivel de infraestrutura.

---

## 2. Opcoes Consideradas

* **Opcao 1**: Implementacao direta de I/O em disco local dentro do `DocumentoService`.
* **Opcao 2**: Inclusao condicional de blocos `if/else` no servico verificando variaveis de ambiente de nuvem.
* **Opcao 3**: Adocao do **Padrao Strategy (GoF)** com injecao de dependencia baseada em interface (`StorageService`).

---

## 3. Decisao Tomada

Adotar a **Opcao 3 — Strategy Pattern**:
1. Criacao da interface `StorageService` definindo o contrato estrito para:
   * `armazenar(nomeOriginal, conteudo, mimeType)`: Retorna a chave unica de armazenamento.
   * `carregar(storageKey)`: Retorna os bytes do arquivo para download.
   * `remover(storageKey)`: Exclui o arquivo fisico.
   * `calcularSha256(conteudo)`: Gera o hash criptografico de 64 caracteres hexadecimais para garantia de integridade.
2. Criacao de implementacoes concretas:
   * `LocalStorageService`: Ativada por padrao (`sipma.storage.type=local`), gerencia gravacao em diretorio configuravel.
   * `S3StorageService`: Ativada via perfil/propriedade (`sipma.storage.type=s3`), isolando clientes de nuvem.
3. Inversao de Dependencia no `DocumentoService`, que passa a depender unicamente da interface `StorageService`.

---

## 4. Consequencias e Trade-offs

### Impactos Positivos:
* **Baixo Acoplamento**: A camada de aplicacao desconhece a tecnologia fisica de persistencia de arquivos.
* **Testabilidade**: Facilidade de criacao de testes unitarios e mocks sem efeitos colaterais em discos reais de producao.
* **Extensibilidade**: Suporte futuro a novos provedores (Google Cloud Storage, Azure Blob, Ceph) criando apenas uma nova classe sem alterar nenhum servico existente.

### Impactos Negativos (Custos):
* Cria mais uma camada de indirecao e classes no projeto.

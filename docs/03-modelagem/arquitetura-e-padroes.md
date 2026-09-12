# Arquitetura de Software e Padroes de Projeto (SIP-MA)

Este documento descreve a arquitetura tecnica, os padroes de projeto aplicados e como os principios de **Alta Coesao** e **Baixo Acoplamento** sao garantidos em todo o codigo-fonte do SIP-MA.

---

## 1. Visao Geral da Arquitetura em Camadas

O sistema adota uma **Arquitetura em Camadas com Fronteiras Estritas de DTO**, garantindo que entidades JPA e detalhes internos de banco nunca vazem para a camada de apresentacao web.

```mermaid
graph TD
    Client["Cliente HTTP (Frontend / Mobile)"] -->|JSON Request DTO| Controller["Camada Controller (REST API)"]
    Controller -->|ProblemDetail RFC 7807| GlobalHandler["GlobalExceptionHandler"]
    Controller -->|DTO de Entrada| Service["Camada Service (Regras de Negocio e Transacoes)"]
    
    Service -->|Leitura / Escrita| Entity["Entidades Ricas (Protecao de Invariantes)"]
    Service -->|Inversao de Dependencia| Storage["StorageService (Strategy Pattern)"]
    Service -->|Disparo Assincrono| EventPublisher["ApplicationEventPublisher (Spring)"]
    Service -->|CRUD / Queries Espaciais| Repo["Camada Repository (Spring Data JPA / PostGIS)"]
    
    Storage -.->|sipma.storage.type=local| LocalStorage["LocalStorageService (Disco / SHA-256)"]
    Storage -.->|sipma.storage.type=s3| S3Storage["S3StorageService (AWS S3 / MinIO)"]
    
    EventPublisher -->|AuditoriaEvent| AuditListener["AuditoriaEventListener (@TransactionalEventListener)"]
    AuditListener -->|Persistencia Independente| AuditRepo["AuditoriaRepository"]
    
    Repo --> DB[("PostgreSQL 16 + PostGIS")]
    AuditRepo --> DB
    
    Service -->|Response DTO sem Senhas| Controller
    Controller -->|JSON Response DTO| Client
```

---

## 2. Padroes de Projeto Implementados

### A. Strategy Pattern (Armazenamento de Arquivos)
Utilizado para isolar o servico de catalogacao documental `DocumentoService` dos detalhes fisicos de I/O de arquivos.

```mermaid
classDiagram
    class DocumentoService {
        -DocumentoRepository documentoRepository
        -BemCulturalRepository bemCulturalRepository
        -StorageService storageService
        +cadastrar(Request) Response
        +armazenarEDocumentar(bemId, titulo, ...) Response
        +baixarArquivo(documentoId) byte[]
    }

    class StorageService {
        <<interface>>
        +armazenar(nomeOriginal, conteudo, mimeType) String
        +carregar(storageKey) byte[]
        +remover(storageKey) void
        +calcularSha256(conteudo) String
    }

    class LocalStorageService {
        -Path rootLocation
        +armazenar(nomeOriginal, conteudo, mimeType) String
        +carregar(storageKey) byte[]
        +remover(storageKey) void
        +calcularSha256(conteudo) String
    }

    class S3StorageService {
        +armazenar(nomeOriginal, conteudo, mimeType) String
        +carregar(storageKey) byte[]
        +remover(storageKey) void
        +calcularSha256(conteudo) String
    }

    DocumentoService --> StorageService : Inversao de Dependencia DIP
    StorageService <|.. LocalStorageService : Implementa Dev e Test
    StorageService <|.. S3StorageService : Implementa Producao e Nuvem
```

---

### B. Observer Pattern via Spring Domain Events (Auditoria Desacoplada)
Garante que a gravacao da trilha de auditoria nunca desacelere nem interrompa uma transacao de negocio principal caso ocorra uma falha de log.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Perito / Tecnico
    participant Controller as VistoriaController
    participant Service as VistoriaService
    participant Model as Vistoria (Entidade Rica)
    participant Repo as VistoriaRepository
    participant Publisher as ApplicationEventPublisher
    participant Listener as AuditoriaEventListener
    participant AuditRepo as AuditoriaRepository

    Usuario->>Controller: POST /api/v1/vistorias/{id}/homologar
    Controller->>Service: homologar(vistoriaId, usuarioId)
    Service->>Repo: findById(vistoriaId)
    Repo-->>Service: vistoria
    Service->>Model: vistoria.homologar(perito)
    Note over Model: Valida se status == REALIZADA<br/>Bloqueia re-homologacao<br/>Grava perito e data
    Service->>Repo: save(vistoria)
    Service->>Publisher: publishEvent(AuditoriaEvent)
    Service-->>Controller: VistoriaDTOs.Response
    Controller-->>Usuario: HTTP 200 OK (Laudo Homologado)

    Note over Publisher,Listener: Apos commit da transacao principal (AFTER_COMMIT)
    Publisher->>Listener: processarEventoAuditoria(AuditoriaEvent)
    Listener->>AuditRepo: save(Auditoria) em transacao REQUIRES_NEW
```

---

### C. Dominio Rico (Invariantes na Entidade)
Diferente do Modelo Anemico, onde a entidade e passiva, no SIP-MA o proprio modelo responde por suas transicoes de estado:

1. **Vistoria**:
   * `homologar(Usuario homologador)`: So pode homologar se o status for `REALIZADA`. Ativa o booleano `homologada = true` e sela o laudo contra futuras edicoes.
   * `registrarRealizacao(...)`: Lanca excecao de negocio se tentar alterar dados de uma vistoria ja homologada.
2. **BemCultural**:
   * `publicar()`: Altera status para `PUBLICADO`, definindo o timestamp oficial de publicacao. Impede a publicacao de bens que estejam com status `ARQUIVADO`.
   * `arquivar(Usuario responsavel)`: Altera status para `ARQUIVADO` e registra auditoria institucional.

---

### D. Seguranca e Isolamento de DTOs
1. **Sem vazamento de senhas**: O objeto `Usuario` nunca e exposto no `UsuarioController`. Apenas `UsuarioResponseDTO` e retornado, sem a presenca da propriedade `senha`.
2. **RFC 7807 Global**: O `GlobalExceptionHandler` padroniza todos os erros com status semanticamente corretos:
   * `422 Unprocessable Entity`: Violacoes de regras de negocio do dominio (`RegraNegocioRunTime`).
   * `400 Bad Request`: Erros de validacao de campos `@Valid` e headers ausentes.
   * `404 Not Found`: Recursos nao localizados (`RecursoNaoEncontradoException`).
   * `409 Conflict`: Violacoes de integridade e duplicidades de banco.

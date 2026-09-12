# Diagramas de Sequência e Fluxos Operacionais — SIP-MA

Este documento modela os fluxos dinâmicos e temporais de execução entre os atores, a camada de controle REST, a camada de serviços transacionais e a infraestrutura de banco de dados.

---

## 1. Fluxo: Cadastro de Bem Cultural e Georreferenciamento

```mermaid
sequenceDiagram
    autonumber
    actor T as Perito Técnico
    participant C as BemCulturalController
    participant S as BemCulturalService
    participant RB as BemCulturalRepository
    participant RL as LocalizacaoBemRepository
    participant DB as PostgreSQL / PostGIS

    T->>C: POST /api/v1/bens-culturais (DTO + Coord WGS84)
    C->>C: Validação de Payload (@Valid)
    C->>S: cadastrarBem(dto, usuarioAutenticadoId)
    
    activate S
    S->>RB: existsByCodigo(dto.codigo)
    alt Código já existente
        S-->>C: Lança RegraNegocioRunTime ("Código duplicado")
        C-->>T: HTTP 422 Unprocessable Entity
    end

    S->>S: Constrói BemCultural (status = RASCUNHO)
    S->>RB: save(bem)
    RB->>DB: INSERT INTO bem_cultural (...)
    
    opt Coordenadas informadas (lat/long)
        S->>S: GeometryFactory.createPoint(long, lat) [SRID 4326]
        S->>RL: save(localizacao)
        RL->>DB: INSERT INTO localizacao_bem (geom, ...)
    end

    S-->>C: BemCulturalResponseDTO
    deactivate S

    C-->>T: HTTP 201 Created (JSON Response)
```

---

## 2. Fluxo: Vistoria Pericial de Campo e Homologação

```mermaid
sequenceDiagram
    autonumber
    actor T as Perito Técnico
    actor A as Superintendente / Admin
    participant VC as VistoriaController
    participant VS as VistoriaService
    participant VR as VistoriaRepository
    participant DB as PostgreSQL

    Note over T,VC: Etapa 1: Agendamento e Execução em Campo
    T->>VC: POST /api/v1/vistorias (bemId, equipe JSONB, agendadaEm)
    VC->>VS: criar(request)
    VS->>VR: save(vistoria status=PLANEJADA)
    VR->>DB: INSERT INTO vistoria (...)
    VC-->>T: HTTP 201 Created

    Note over T,VC: Etapa 2: Lançamento de Patologias
    T->>VC: POST /api/v1/vistorias/{id}/patologias (patologias JSONB, realizadaEm)
    VC->>VS: registrarLaudoCampo(id, patologias)
    VS->>VR: save(status=REALIZADA)
    VC-->>T: HTTP 200 OK

    Note over A,VC: Etapa 3: Homologação Pericial
    A->>VC: PUT /api/v1/vistorias/{id}/homologar
    VC->>VS: homologarVistoria(id, usuarioId)
    activate VS
    VS->>VR: findById(id)
    alt Status != REALIZADA
        VS-->>VC: Lança RegraNegocioRunTime ("Apenas vistorias realizadas podem ser homologadas")
        VC-->>A: HTTP 422 Unprocessable Entity
    end
    VS->>VS: Sela registro: homologada=true, homologadaEm=NOW(), homologadaPor=usuarioId
    VS->>VR: save(vistoria)
    VR->>DB: UPDATE vistoria SET homologada=true...
    VS-->>VC: VistoriaResponseDTO
    deactivate VS
    VC-->>A: HTTP 200 OK (Laudo Homologado e Imutável)
```

---

## 3. Fluxo: Processo de Tombamento e Inscrição em Livro de Tombo

```mermaid
sequenceDiagram
    autonumber
    actor A as Gestor SECMA
    participant PC as ProtecaoController
    participant PS as ProtecaoService
    participant PR as ProtecaoRepository
    participant BR as BemCulturalRepository
    participant DB as PostgreSQL

    A->>PC: POST /api/v1/protecoes (bemId, processo, ato, fase=EM_ESTUDO)
    PC->>PS: criarProcesso(request)
    PS->>PR: save(protecao)
    PR->>DB: INSERT INTO protecao (...)
    PC-->>A: HTTP 201 Created

    Note over A,DB: Conclusão do Processo e Inscrição no Livro de Tombo
    A->>PC: PUT /api/v1/protecoes/{id}/homologar (livroTombo, inscricao, folha)
    PC->>PS: homologarTombamento(id, dadosHomologacao)
    activate PS
    PS->>PR: findById(id)
    PS->>PS: Atualiza protecao: fase=HOMOLOGADO, vigente=true
    PS->>PR: save(protecao)
    
    Note over PS,BR: Transição automática do estado do bem
    PS->>BR: findById(protecao.bemId)
    PS->>PS: bem.setStatus(PUBLICADO)
    PS->>BR: save(bem)
    BR->>DB: UPDATE bem_cultural SET status='PUBLICADO'...
    
    PS-->>PC: ProtecaoResponseDTO
    deactivate PS
    PC-->>A: HTTP 200 OK (Bem Tombado e Publicado Oficialmente)
```

---

## 4. Fluxo: Upload e Armazenamento Seguro de Documentos (Strategy Pattern e SHA-256)

```mermaid
sequenceDiagram
    autonumber
    actor T as Perito / Tecnico
    participant DC as DocumentoController
    participant DS as DocumentoService
    participant ST as StorageService (Strategy)
    participant DR as DocumentoRepository
    participant DB as PostgreSQL

    T->>DC: POST /api/v1/documentos/upload (multipart arquivo, bemId, titulo)
    DC->>DS: armazenarEDocumentar(bemId, titulo, ..., bytes)
    activate DS
    
    DS->>ST: calcularSha256(bytes)
    ST-->>DS: hashSha256 (64 hex)
    
    DS->>ST: armazenar(nomeOriginal, bytes, mimeType)
    Note over ST: LocalStorageService: grava em disco<br/>S3StorageService: envia para bucket S3
    ST-->>DS: storageKey
    
    DS->>DS: Instancia Documento (storageKey, sha256, versao=1)
    DS->>DR: save(documento)
    DR->>DB: INSERT INTO documento (storage_key, sha256, ...)
    
    DS-->>DC: DocumentoDTOs.Response (sem binario)
    deactivate DS
    DC-->>T: HTTP 201 Created (Metadados e Chave)
```

---

## 5. Fluxo: Disparo e Processamento Assincrono de Auditoria (Domain Events)

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario Autenticado
    participant C as Controller
    participant S as Servico de Negocio
    participant EP as ApplicationEventPublisher
    participant R as Repositorio Principal
    participant DB as PostgreSQL
    participant AL as AuditoriaEventListener
    participant AR as AuditoriaRepository

    U->>C: Requisicao de alteracao cadastral
    C->>S: Executa regra transacional
    activate S
    S->>R: save(entidade)
    R->>DB: INSERT / UPDATE
    
    S->>EP: publishEvent(AuditoriaEvent)
    Note over S,EP: Desacoplado: Servico desconhece AuditoriaRepository
    S-->>C: ResponseDTO
    deactivate S
    C-->>U: HTTP 200/201 (Sucesso)

    Note over EP,AL: Execucao automatica apos o commit (AFTER_COMMIT)
    EP->>AL: processarEventoAuditoria(AuditoriaEvent)
    activate AL
    AL->>AR: save(Auditoria) em transacao REQUIRES_NEW
    AR->>DB: INSERT INTO auditoria (entidade, acao, dados_novos, ...)
    deactivate AL
```


# Modelo de Classes de Domínio — SIP-MA

O Modelo de Classes de Domínio representa os conceitos de negócio, suas propriedades estruturais e seus relacionamentos no ecossistema de patrimônio e tombamento.

---

## Diagrama Conceitual de Classes (Mermaid)

```mermaid
classDiagram
    class Organizacao {
        +UUID id
        +String nome
        +String sigla
        +String tipo
        +String esfera
        +String cnpj
        +Boolean ativo
    }

    class Usuario {
        +UUID id
        +String nome
        +String email
        +String senha
        +PerfilUsuario perfil
        +Boolean ativo
        +Boolean doisFatores
        +registrarAcesso()
    }

    class Municipio {
        +UUID id
        +String codigoIbge
        +String nome
        +String uf
        +MultiPolygon geom
    }

    class BemCultural {
        +UUID id
        +String codigo
        +NaturezaBem natureza
        +String nome
        +String resumoPublico
        +String descricao
        +String status
        +Map dadosEspecificos
        +tornarPublicado()
        +arquivar()
    }

    class LocalizacaoBem {
        +UUID id
        +String logradouro
        +String numero
        +String bairro
        +String cep
        +Geometry geom
        +Boolean principal
    }

    class LocalizacaoArqueologicaRestrita {
        +UUID id
        +Point geomExata
        +Polygon bufferProtecao
        +String nivelRestricao
        +String fundamento
    }

    class Protecao {
        +UUID id
        +String numeroProcesso
        +String esfera
        +String fase
        +String tipoProtecao
        +String atoNormativo
        +String livroTombo
        +String numeroInscricao
        +Boolean vigente
        +homologar(livro, inscricao)
        +revogar()
    }

    class Vistoria {
        +UUID id
        +String codigo
        +String status
        +OffsetDateTime agendadaEm
        +OffsetDateTime realizadaEm
        +Map equipe
        +Map patologias
        +Boolean homologada
        +adicionarPatologia(patologia)
        +homologar(usuario)
    }

    class ProcessoJudicial {
        +UUID id
        +String numeroCnj
        +String tribunal
        +String vara
        +String fase
        +String objeto
        +BigDecimal valorCausa
    }

    class ProcessoBem {
        +String papelDoBem
        +String impactoConservacao
        +String observacao
    }

    class Documento {
        +UUID id
        +String codigo
        +String titulo
        +String categoria
        +String storageKey
        +String sha256
        +Long tamanhoBytes
        +Boolean publicacaoAutorizada
    }

    class EventoBem {
        +UUID id
        +String tipo
        +String titulo
        +LocalDate dataInicio
        +LocalDate dataFim
        +BigDecimal custo
    }

    class Salvaguarda {
        +UUID id
        +String titulo
        +String versao
        +String status
        +LocalDate vigenciaInicio
        +LocalDate vigenciaFim
        +Map acoes
    }

    class Auditoria {
        +Long id
        +String acao
        +String entidade
        +UUID entidadeId
        +Map dadosAnteriores
        +Map dadosNovos
        +UUID correlationId
    }

    %% Relacionamentos
    Organizacao "1" --> "*" Usuario : vincula
    Organizacao "1" --> "*" BemCultural : responde_por
    Usuario "1" --> "*" BemCultural : cria_e_atualiza
    BemCultural "1" --> "*" LocalizacaoBem : possui_enderecos
    BemCultural "1" --> "0..1" LocalizacaoArqueologicaRestrita : possui_local_sigiloso
    Municipio "1" --> "*" LocalizacaoBem : abrange
    BemCultural "1" --> "*" Protecao : recebe_atos_de
    BemCultural "1" --> "*" Vistoria : sofre
    Vistoria "*" --> "0..1" Usuario : executada_por
    Vistoria "*" --> "0..1" Usuario : homologada_por

    BemCultural "1" --> "*" ProcessoBem : participa
    ProcessoJudicial "1" --> "*" ProcessoBem : contem
    BemCultural "1" --> "*" EventoBem : historico
    BemCultural "1" --> "*" Salvaguarda : plano_imaterial
    BemCultural "1" --> "*" Documento : anexos
    Auditoria "*" --> "0..1" Usuario : executado_por
```

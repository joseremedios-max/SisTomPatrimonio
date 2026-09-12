# Modelo de Dados — Diagrama Entidade-Relacionamento (DER)

Este documento contém a transcrição oficial do modelo físico e lógico do banco de dados relacional **PostgreSQL + PostGIS**, espelhando rigorosamente o `dbdiagram` oficial acordado para o projeto SIP-MA.

---

## 1. Diagrama Entidade-Relacionamento (Mermaid)

```mermaid
erDiagram
    ORGANIZACAO ||--o{ USUARIO : "possui_servidores"
    ORGANIZACAO ||--o{ BEM_CULTURAL : "instituicao_responsavel"
    ORGANIZACAO ||--o{ PROTECAO : "orgao_concedente"
    ORGANIZACAO ||--o{ VISTORIA : "orgao_vistoriador"
    ORGANIZACAO ||--o{ EVENTO_BEM : "promove_evento"
    ORGANIZACAO ||--o{ SALVAGUARDA : "coordena_plano"

    USUARIO ||--o{ BEM_CULTURAL : "criado_por"
    USUARIO ||--o{ BEM_CULTURAL : "atualizado_por"
    USUARIO ||--o{ LOCALIZACAO_BEM : "validado_por"
    USUARIO ||--o{ LOCALIZACAO_ARQUEOLOGICA_RESTRITA : "criado_por"
    USUARIO ||--o{ VISTORIA : "responsavel_tecnico"
    USUARIO ||--o{ VISTORIA : "homologada_por"
    USUARIO ||--o{ DOCUMENTO : "autor_interno"
    USUARIO ||--o{ AUDITORIA : "autor_transacao"

    MUNICIPIO ||--o{ LOCALIZACAO_BEM : "localiza_em"
    MUNICIPIO ||--o{ PROCESSO_JUDICIAL : "comarca_afetada"

    BEM_CULTURAL ||--o{ LOCALIZACAO_BEM : "enderecos_publicos"
    BEM_CULTURAL ||--o| LOCALIZACAO_ARQUEOLOGICA_RESTRITA : "coordenada_sigilosa"
    BEM_CULTURAL ||--o{ PROTECAO : "atos_de_tombamento"
    BEM_CULTURAL ||--o{ VISTORIA : "fiscalizacoes"
    BEM_CULTURAL ||--o{ PROCESSO_BEM : "vinculado_a"
    BEM_CULTURAL ||--o{ DOCUMENTO : "anexos_documentais"
    BEM_CULTURAL ||--o{ EVENTO_BEM : "marcos_historicos"
    BEM_CULTURAL ||--o{ SALVAGUARDA : "planos_imateriais"

    PROCESSO_JUDICIAL ||--o{ PROCESSO_BEM : "abrange"
    PROCESSO_JUDICIAL ||--o{ MOVIMENTACAO_JUDICIAL : "historico_andamentos"
    PROCESSO_JUDICIAL ||--o{ DOCUMENTO : "pecas_processuais"

    VISTORIA ||--o{ DOCUMENTO : "laudos_e_fotos"
    PROTECAO ||--o{ DOCUMENTO : "decretos_e_portarias"

    ORGANIZACAO {
        uuid id PK
        text nome
        varchar sigla
        varchar tipo
        varchar esfera
        varchar cnpj UK
        varchar email
        varchar telefone
        boolean ativo
        timestamptz criado_em
    }

    USUARIO {
        uuid id PK
        text nome
        varchar email UK
        varchar senha
        uuid organizacao_id FK
        varchar perfil
        varchar registro_profissional
        boolean ativo
        boolean dois_fatores
        timestamptz criado_em
        timestamptz ultimo_acesso_em
    }

    MUNICIPIO {
        uuid id PK
        char codigo_ibge UK
        varchar nome
        char uf
        geometry geom
    }

    BEM_CULTURAL {
        uuid id PK
        varchar codigo UK
        varchar natureza
        text nome
        text resumo_publico
        text descricao
        text observacoes_internas
        varchar classificacao
        varchar status
        uuid organizacao_responsavel_id FK
        varchar tipo_imovel
        varchar tipologia_arquitetonica
        varchar uso_original
        varchar uso_atual
        varchar dominio_atual
        smallint ano_inicio
        smallint ano_fim
        numeric area_construida_m2
        numeric area_terreno_m2
        smallint numero_pavimentos
        varchar estrutura
        varchar cobertura
        varchar categoria_imaterial
        varchar periodicidade
        text contexto_pratica
        text riscos_continuidade
        varchar tipo_sitio
        varchar periodo_cultural
        varchar regime_acesso
        boolean restrito
        jsonb dados_especificos
        timestamptz publicado_em
        uuid criado_por FK
        timestamptz criado_em
        uuid atualizado_por FK
        timestamptz atualizado_em
        timestamptz arquivado_em
    }

    LOCALIZACAO_BEM {
        uuid id PK
        uuid bem_id FK
        uuid municipio_id FK
        varchar distrito_localidade
        varchar bairro
        varchar logradouro
        varchar numero
        varchar complemento
        varchar cep
        varchar zona
        varchar tipo_localizacao
        geometry geom
        numeric precisao_m
        varchar metodo_coleta
        varchar datum
        integer epsg
        varchar fonte
        boolean principal
        varchar numero_matricula
        varchar serventia
        varchar inscricao_imobiliaria
        timestamptz validado_em
        uuid validado_por FK
        timestamptz criado_em
    }

    LOCALIZACAO_ARQUEOLOGICA_RESTRITA {
        uuid id PK
        uuid bem_id FK
        geometry geom_exata
        geometry buffer_protecao
        varchar nivel_restricao
        text fundamento
        numeric precisao_m
        varchar fonte
        uuid criado_por FK
        timestamptz criado_em
    }

    PROTECAO {
        uuid id PK
        uuid bem_id FK
        varchar numero_processo
        uuid organizacao_id FK
        varchar esfera
        varchar fase
        varchar tipo_protecao
        date data_abertura
        date data_decisao
        date data_inicio
        date data_fim
        varchar ato_normativo
        varchar livro_tombo
        varchar numero_inscricao
        varchar folha
        boolean vigente
        text observacao
        timestamptz criado_em
    }

    VISTORIA {
        uuid id PK
        varchar codigo UK
        uuid bem_id FK
        varchar status
        timestamptz agendada_em
        timestamptz realizada_em
        uuid responsavel_id FK
        uuid organizacao_id FK
        jsonb equipe
        varchar situacao_conservacao
        varchar nivel_risco
        jsonb patologias
        text resumo
        text recomendacao
        date proxima_vistoria
        boolean homologada
        uuid homologada_por FK
        timestamptz homologada_em
        timestamptz criado_em
    }

    PROCESSO_JUDICIAL {
        uuid id PK
        varchar numero_cnj UK
        varchar tribunal
        varchar vara
        uuid municipio_id FK
        varchar tipo_acao
        varchar fase
        text objeto
        numeric valor_causa
        date data_distribuicao
        date data_encerramento
        boolean segredo_justica
        varchar classificacao
        timestamptz atualizado_em
    }

    PROCESSO_BEM {
        uuid processo_id FK
        uuid bem_id FK
        varchar papel_do_bem
        text impacto_conservacao
        text observacao
    }

    MOVIMENTACAO_JUDICIAL {
        uuid id PK
        uuid processo_id FK
        integer sequencia
        timestamptz data_hora
        varchar titulo
        text descricao
        varchar fase_resultante
        varchar fonte
        timestamptz criado_em
    }

    DOCUMENTO {
        uuid id PK
        varchar codigo UK
        varchar titulo
        varchar categoria
        varchar classificacao
        varchar status_validacao
        uuid bem_id FK
        uuid vistoria_id FK
        uuid processo_judicial_id FK
        uuid protecao_id FK
        varchar nome_arquivo
        varchar mime_type
        bigint tamanho_bytes
        varchar storage_key
        varchar sha256
        integer versao
        uuid autor_id FK
        varchar autoria_externa
        date data_documento
        text descricao
        jsonb metadados
        boolean publicacao_autorizada
        timestamptz criado_em
    }

    EVENTO_BEM {
        uuid id PK
        uuid bem_id FK
        varchar tipo
        varchar titulo
        text descricao
        date data_inicio
        date data_fim
        smallint ano_inicio
        smallint ano_fim
        uuid organizacao_id FK
        numeric custo
        uuid documento_id FK
        boolean publico
        timestamptz criado_em
    }

    SALVAGUARDA {
        uuid id PK
        uuid bem_id FK
        varchar titulo
        varchar versao
        varchar status
        uuid organizacao_responsavel_id FK
        date vigencia_inicio
        date vigencia_fim
        text objetivo
        numeric orcamento
        jsonb acoes
        timestamptz criado_em
    }

    AUDITORIA {
        bigserial id PK
        uuid usuario_id FK
        timestamptz ocorrido_em
        varchar acao
        varchar entidade
        uuid entidade_id
        jsonb dados_anteriores
        jsonb dados_novos
        varchar origem
        uuid correlation_id
    }
```

---

## 2. Dicionário de Dados Resumido (Tabelas Principais)

1. **`organizacao`**: Cadastro das entidades que tutelam ou custodiam o patrimônio (ex: SECMA, IPHAN, Prefeituras).
2. **`usuario`**: Servidores, peritos técnicos e assessores jurídicos com credenciais protegidas e RBAC.
3. **`municipio`**: Base cartográfica com limites poligonais do IBGE para relacionamentos geoespaciais automáticos.
4. **`bem_cultural`**: Tabela mestre do acervo. Unifica bens materiais, imateriais e arqueológicos com metadados estruturados e híbridos (`dados_especificos JSONB`).
5. **`localizacao_bem`**: Permite múltiplos endereços, coordenadas ou polígonos públicos por monumento, além de dados cartorários simplificados.
6. **`localizacao_arqueologica_restrita`**: Coordenadas sensíveis isoladas 1:1 para impedir divulgação não-autorizada de sítios arqueológicos.
7. **`protecao`**: Consolida em uma só tabela o processo administrativo de tombamento e o registro no Livro de Tombo estadual.
8. **`vistoria`**: Inspeção técnica física, catalogando a equipe pericial e anomalias prediais em colunas `JSONB`.
9. **`processo_judicial` & `processo_bem`**: Controle N:N de ações civis públicas, embargos e execuções de restauro.
10. **`documento`**: Repositório de anexos com chave S3, verificação de hash SHA-256 e vínculos polimórficos opcionais.
11. **`evento_bem`**: Linha do tempo de restauros, tombamentos, reformas e eventos marcantes na história do monumento.
12. **`salvaguarda`**: Planos de ação e fomento a patrimônios imateriais com metas em JSONB.
13. **`auditoria`**: Trilha transacional com snapshots lógicos dos estados anteriores e posteriores.

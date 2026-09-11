-- ============================================================
-- SIP-MA (Sistema de Informação do Patrimônio - Maranhão)
-- Script de Migração Física Inicial (DDS/DDL)
-- PostgreSQL + PostGIS estendido
-- ============================================================

-- Habilita a extensão geoespacial PostGIS (requisito não funcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ------------------------------------------------------------
-- 1. Tabela: ORGANIZACAO (Órgãos e Entidades Responsáveis)
-- ------------------------------------------------------------
CREATE TABLE organizacao (
    id UUID PRIMARY KEY,
    nome TEXT NOT NULL,
    sigla VARCHAR(30),
    tipo VARCHAR(40),
    esfera VARCHAR(20), -- FEDERAL, ESTADUAL, MUNICIPAL, PRIVADA
    cnpj VARCHAR(14) UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. Tabela: USUARIO (Usuários do Sistema SECMA/Público)
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id UUID PRIMARY KEY,
    nome TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(256) NOT NULL,
    organizacao_id UUID REFERENCES organizacao(id) ON DELETE SET NULL,
    perfil VARCHAR(30) NOT NULL, -- ADMIN, TECNICO, CONSULTOR, LEITOR, JURIDICO
    registro_professional VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    dois_fatores BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ultimo_acesso_em TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- 3. Tabela: MUNICIPIO (Divisão Territorial de Referência)
-- ------------------------------------------------------------
CREATE TABLE municipio (
    id UUID PRIMARY KEY,
    codigo_ibge CHAR(7) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL DEFAULT 'MA',
    geom GEOMETRY(MultiPolygon, 4326) -- Armazena a poligonal do limite municipal
);

-- ------------------------------------------------------------
-- 4. Tabela: BEM_CULTURAL (Entidade Core Generalizada)
-- ------------------------------------------------------------
CREATE TABLE bem_cultural (
    id UUID PRIMARY KEY,
    codigo VARCHAR(24) UNIQUE NOT NULL,
    natureza VARCHAR(30) NOT NULL, -- MATERIAL_EDIFICADO, IMATERIAL, ARQUEOLOGICO
    nome TEXT NOT NULL,
    resumo_publico TEXT,
    descricao TEXT,
    observacoes_internas TEXT,
    classificacao VARCHAR(20) NOT NULL DEFAULT 'INTERNA', -- PUBLICA, INTERNA, RESTRITA, SIGILOSA
    status VARCHAR(30) NOT NULL DEFAULT 'RASCUNHO', -- RASCUNHO, EM_REVISAO, APROVADO, PUBLICADO, ARQUIVADO
    organizacao_responsavel_id UUID NOT NULL REFERENCES organizacao(id) ON DELETE RESTRICT,
    
    -- Específicos para Imóveis (Patrimônio Material Edificado)
    tipo_imovel VARCHAR(100),
    tipologia_arquitetonica VARCHAR(100),
    uso_original VARCHAR(100),
    uso_atual VARCHAR(100),
    dominio_atual VARCHAR(30), -- PUBLICO, PRIVADO, MISTO, DESCONHECIDO
    ano_inicio SMALLINT,
    ano_fim SMALLINT,
    area_construida_m2 NUMERIC(12,2),
    area_terreno_m2 NUMERIC(12,2),
    numero_pavimentos SMALLINT,
    estrutura VARCHAR(100),
    cobertura VARCHAR(100),
    
    -- Específicos para Patrimônio Imaterial (Festas e Saberes)
    categoria_imaterial VARCHAR(100),
    periodicidade VARCHAR(100),
    contexto_pratica TEXT,
    riscos_continuidade TEXT,
    
    -- Específicos para Sítios Arqueológicos
    tipo_sitio VARCHAR(100),
    periodo_cultural VARCHAR(100),
    regime_acesso VARCHAR(30), -- PUBLICO_INTEGRAL, PUBLICO_GUIADO, PARCIAL, RESTRITO
    restrito BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadados Dinâmicos (Híbridos Semi-estruturados)
    dados_especificos JSONB, -- Armazena elementos flexíveis sem alterar schemas
    
    -- Controle e Auditoria Geral
    publicado_em TIMESTAMPTZ,
    criado_por UUID NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_por UUID NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    arquivado_em TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- 5. Tabela: LOCALIZACAO_BEM (Geolocalização Geral / Endereço)
-- ------------------------------------------------------------
CREATE TABLE localizacao_bem (
    id UUID PRIMARY KEY,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    municipio_id UUID REFERENCES municipio(id) ON DELETE RESTRICT,
    distrito_localidade VARCHAR(100),
    bairro VARCHAR(100),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    cep VARCHAR(8),
    zona VARCHAR(20), -- URBANA, RURAL, NAO_APLICAVEL
    tipo_localizacao VARCHAR(20) NOT NULL DEFAULT 'PRINCIPAL', -- PRINCIPAL, SECUNDARIA, ABRANGENCIA, ENTORNO
    geom GEOMETRY(Geometry, 4326), -- PostGIS Point ou Polygon representativo
    precisao_m NUMERIC(8,2),
    metodo_coleta VARCHAR(50), -- GNSS, RTK, DIGITALIZACAO, IMPORTACAO, GEOCODIFICACAO, ESTIMATIVA
    datum VARCHAR(20) DEFAULT 'SIRGAS2000',
    epsg INTEGER DEFAULT 4326,
    fonte VARCHAR(100),
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Dados registrais cartorários simplificados
    numero_matricula VARCHAR(50),
    serventia VARCHAR(100),
    inscricao_imobiliaria VARCHAR(50),
    
    -- Fluxo de Validação Geográfica
    validado_em TIMESTAMPTZ,
    validado_por UUID REFERENCES usuario(id) ON DELETE SET NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. Tabela: LOCALIZACAO_ARQUEOLOGICA_RESTRITA (Isolamento 1:1)
-- ------------------------------------------------------------
CREATE TABLE localizacao_arqueologica_restrita (
    id UUID PRIMARY KEY,
    bem_id UUID UNIQUE NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    geom_exata GEOMETRY(Point, 4326) NOT NULL, -- Coordenada exata confidencial
    buffer_protecao GEOMETRY(Polygon, 4326), -- Polígono de entorno e amortecimento
    nivel_restricao VARCHAR(30) NOT NULL DEFAULT 'RESTRITA', -- RESTRITA, SIGILOSA
    fundamento TEXT NOT NULL, -- Justificativa legal / portaria de restrição
    precisao_m NUMERIC(8,2),
    fonte VARCHAR(100),
    criado_por UUID NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 7. Tabela: PROTECAO (Processos de Tombamento / Atos Legais)
-- ------------------------------------------------------------
CREATE TABLE protecao (
    id UUID PRIMARY KEY,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    numero_processo VARCHAR(50),
    organizacao_id UUID REFERENCES organizacao(id) ON DELETE SET NULL,
    esfera VARCHAR(20), -- FEDERAL, ESTADUAL, MUNICIPAL, INTERNACIONAL
    fase VARCHAR(30), -- EM_ESTUDO, EM_INSTRUCAO, PROVISORIO, HOMOLOGADO, INDEFERIDO, REVOGADO
    tipo_protecao VARCHAR(100), -- TOMBAMENTO, REGISTRO, VALORACAO
    data_abertura DATE,
    data_decisao DATE,
    data_inicio DATE,
    data_fim DATE,
    ato_normativo VARCHAR(150), -- Decreto, Resolução ou Portaria SECMA
    livro_tombo VARCHAR(100),
    numero_inscricao VARCHAR(50),
    folha VARCHAR(20),
    vigente BOOLEAN NOT NULL DEFAULT TRUE,
    observacao TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 8. Tabela: VISTORIA (Fiscalização Física Preventiva)
-- ------------------------------------------------------------
CREATE TABLE vistoria (
    id UUID PRIMARY KEY,
    codigo VARCHAR(24) UNIQUE NOT NULL,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- PLANEJADA, PENDENTE, EM_CAMPO, EM_ANALISE, REALIZADA, CANCELADA
    agendada_em TIMESTAMPTZ,
    realizada_em TIMESTAMPTZ,
    responsavel_id UUID REFERENCES usuario(id) ON DELETE SET NULL,
    organizacao_id UUID REFERENCES organizacao(id) ON DELETE SET NULL,
    equipe JSONB, -- Lista de técnicos [{nome, funcao, rtp}]
    situacao_conservacao VARCHAR(30), -- PRESERVADO, RESTAURADO, EM_ATENCAO, EM_RISCO
    nivel_risco VARCHAR(20), -- DESCONHECIDO, BAIXO, MEDIO, ALTO, CRITICO
    patologias JSONB, -- Lista de anomalias detectadas [{tipo, severidade, descricao}]
    resumo TEXT,
    recomendacao TEXT,
    proxima_vistoria DATE,
    homologada BOOLEAN NOT NULL DEFAULT FALSE,
    homologada_por UUID REFERENCES usuario(id) ON DELETE SET NULL,
    homologada_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 9. Tabela: PROCESSO_JUDICIAL (Ações Jurídicas SECMA/MPE)
-- ------------------------------------------------------------
CREATE TABLE processo_judicial (
    id UUID PRIMARY KEY,
    numero_cnj VARCHAR(50) UNIQUE NOT NULL,
    tribunal VARCHAR(100),
    vara VARCHAR(100),
    municipio_id UUID REFERENCES municipio(id) ON DELETE RESTRICT,
    tipo_acao VARCHAR(100), -- Ação Civil Pública, Ação de Embargo, etc.
    fase VARCHAR(30), -- INSTRUCAO, SENTENCA, EXECUCAO, ENCERRADO
    objeto TEXT NOT NULL,
    valor_causa NUMERIC(15,2),
    data_distribuicao DATE,
    data_encerramento DATE,
    segredo_justica BOOLEAN NOT NULL DEFAULT FALSE,
    classificacao VARCHAR(20) NOT NULL DEFAULT 'INTERNA',
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 10. Tabela: PROCESSO_BEM (Relação N:N Associativa Temporal)
-- ------------------------------------------------------------
CREATE TABLE processo_bem (
    processo_id UUID NOT NULL REFERENCES processo_judicial(id) ON DELETE CASCADE,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    papel_do_bem VARCHAR(100), -- REU_EMBARGADO, OBJETO_DANO, GARANTIA
    impacto_conservacao TEXT,
    observacao TEXT,
    PRIMARY KEY (processo_id, bem_id)
);

-- ------------------------------------------------------------
-- 11. Tabela: MOVIMENTACAO_JUDICIAL (Lançamentos / Log Processual)
-- ------------------------------------------------------------
CREATE TABLE movimentacao_judicial (
    id UUID PRIMARY KEY,
    processo_id UUID NOT NULL REFERENCES processo_judicial(id) ON DELETE CASCADE,
    sequencia INTEGER NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    fase_resultante VARCHAR(100),
    fonte VARCHAR(100),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 12. Tabela: DOCUMENTO (Arquivo Polimórfico - Referência S3)
-- ------------------------------------------------------------
CREATE TABLE documento (
    id UUID PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(50), -- PROCESSO_TOMBAMENTO, LAUDO_TECNICO, RELATORIO_VISTORIA, etc.
    classificacao VARCHAR(20) NOT NULL DEFAULT 'INTERNA', -- PUBLICA, INTERNA, RESTRITA
    status_validacao VARCHAR(20) NOT NULL DEFAULT 'PENDENTE', -- PENDENTE, VALIDADO, REJEITADO
    
    -- Chaves Estrangeiras Opcionais para Polimorfismo Físico
    bem_id UUID REFERENCES bem_cultural(id) ON DELETE CASCADE,
    vistoria_id UUID REFERENCES vistoria(id) ON DELETE CASCADE,
    processo_judicial_id UUID REFERENCES processo_judicial(id) ON DELETE CASCADE,
    protecao_id UUID REFERENCES protecao(id) ON DELETE CASCADE,
    
    -- Parâmetros do File Storage (Zero Bytea no DB)
    nome_arquivo VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    tamanho_bytes BIGINT,
    storage_key VARCHAR(255) NOT NULL, -- Chave de objeto exclusiva em S3 / Volume Local
    sha256 VARCHAR(64), -- Hash de verificação de integridade
    versao INTEGER NOT NULL DEFAULT 1,
    
    -- Metadados Opcionais
    autor_id UUID REFERENCES usuario(id) ON DELETE SET NULL,
    autoria_externa VARCHAR(150),
    data_documento DATE,
    descricao TEXT,
    metadados JSONB,
    
    -- Governança de Acesso Público
    publicacao_autorizada BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 13. Tabela: EVENTO_BEM (Linha do Tempo Cronológica do Bem)
-- ------------------------------------------------------------
CREATE TABLE evento_bem (
    id UUID PRIMARY KEY,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL, -- CONSTRUCAO, TOMBAMENTO, RESTAURO, INTERVENCAO, OUTRO
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    ano_inicio SMALLINT,
    ano_fim SMALLINT,
    organizacao_id UUID REFERENCES organizacao(id) ON DELETE SET NULL,
    custo NUMERIC(15,2),
    documento_id UUID REFERENCES documento(id) ON DELETE SET NULL,
    publico BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 14. Tabela: SALVAGUARDA (Plano de Preservação Imaterial)
-- ------------------------------------------------------------
CREATE TABLE salvaguarda (
    id UUID PRIMARY KEY,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    versao VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'PLANEJADO', -- PLANEJADO, ATIVO, CONCLUIDO, CANCELADO
    organizacao_responsavel_id UUID REFERENCES organizacao(id) ON DELETE SET NULL,
    vigencia_inicio DATE,
    vigencia_fim DATE,
    objetivo TEXT,
    orcamento NUMERIC(15,2),
    acoes JSONB, -- Lista de metas e cronogramas [{meta, prazo, status}]
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 15. Tabela: AUDITORIA (Trilha de Eventos Imutável)
-- ------------------------------------------------------------
CREATE TABLE auditoria (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES usuario(id) ON DELETE SET NULL,
    ocorrido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acao VARCHAR(100) NOT NULL, -- INSERT, UPDATE, DELETE, ACCESS
    entidade VARCHAR(100) NOT NULL, -- Nome da tabela física afetada
    entidade_id UUID, -- ID do registro alterado
    dados_anteriores JSONB, -- Captura de estado lógico prévio
    dados_novos JSONB, -- Captura de estado lógico posterior
    origem VARCHAR(100), -- IP ou Plataforma requisitante
    correlation_id UUID -- Id único para rastrear chamadas de rede encadeadas
);

-- ------------------------------------------------------------
-- CRIAÇÃO DE ÍNDICES SECUNDÁRIOS PARA ALTO DESEMPENHO (GIST & B-TREE)
-- ------------------------------------------------------------

-- Índices Espaciais (PostGIS GIST) para Busca de Mapas Veloz
CREATE INDEX idx_municipio_geom ON municipio USING GIST (geom);
CREATE INDEX idx_localizacao_bem_geom ON localizacao_bem USING GIST (geom);
CREATE INDEX idx_local_arqueologica_geom_exata ON localizacao_arqueologica_restrita USING GIST (geom_exata);
CREATE INDEX idx_local_arqueologica_buffer ON localizacao_arqueologica_restrita USING GIST (buffer_protecao);

-- Índices B-Tree convencionais para Otimização de FKs e Consultas Frequentes
CREATE INDEX idx_usuario_organizacao ON usuario(organizacao_id);
CREATE INDEX idx_bem_cultural_org_responsavel ON bem_cultural(organizacao_responsavel_id);
CREATE INDEX idx_localizacao_bem_relacao ON localizacao_bem(bem_id, municipio_id);
CREATE INDEX idx_protecao_bem ON protecao(bem_id);
CREATE INDEX idx_vistoria_bem ON vistoria(bem_id);
CREATE INDEX idx_processo_judicial_municipio ON processo_judicial(municipio_id);
CREATE INDEX idx_documento_vinculos ON documento(bem_id, vistoria_id, processo_judicial_id, protecao_id);
CREATE INDEX idx_evento_bem_bem ON evento_bem(bem_id);
CREATE INDEX idx_salvaguarda_bem ON salvaguarda(bem_id);
CREATE INDEX idx_auditoria_entidade ON auditoria(entidade, entidade_id);

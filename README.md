# 🏛️ SIP-MA — Sistema de Informação do Patrimônio (Maranhão)

O **SisTomPatrimonio** é uma plataforma corporativa e estadual de geoprocessamento, salvaguarda e controle documental projetada para mapear, proteger e fiscalizar a herança cultural tangível (bens materiais edificados), intangível (patrimônio imaterial/folclore) e arqueológica do Estado do Maranhão.

---


## 📋 Sumário
1. [Visão Geral e Propósito do Sistema](#1-visão-geral-e-propósito-do-sistema)
2. [Análise do Domínio e Desafios de Negócio](#2-análise-do-domínio-e-desafios-de-negócio)
3. [Escolhas Arquiteturais e Padrões de Engenharia](#3-escolhas-arquiteturais-e-padrões-de-engenharia)
4. [Estrutura Completa do Projeto Backend](#4-estrutura-completa-do-projeto-backend)
5. [Modelo de Dados Físico, Espacial (PostGIS) e Híbrido (JSONB)](#5-modelo-de-dados-físico-espacial-postgis-e-híbrido-jsonb)
6. [Catálogo Completo de APIs RESTful](#6-catálogo-completo-de-apis-restful)
7. [Estratégia de Qualidade e Testes Automatizados](#7-estratégia-de-qualidade-e-testes-automatizados)
8. [Análise Crítica: Falhas Críticas e Paridade Ambiental (H2 vs. Testcontainers)](#8-análise-crítica-falhas-críticas-e-paridade-ambiental-h2-vs-testcontainers)
9. [🚀 Guia Passo a Passo de Execução para Iniciantes](#9--guia-passo-a-passo-de-execução-para-iniciantes)


## 1.🚀 Diferenciais de Engenharia & Arquitetura

Ao contrário de sistemas tradicionais de tombamento interno de ativos, o SIP-MA foi projetado para escala estadual macro, incorporando decisões arquiteturais avançadas de software:

* **Arquitetura em Camadas Desacopladas**: Backend estruturado estritamente em `Controllers` (REST/DTOs), `Services` (Regras de negócio e transações `@Transactional`), `Repositories` (Spring Data JPA / Hibernate Spatial) e `Entities` (JPA/PostGIS).
* **Identificação Única por UUIDs**: Todas as chaves primárias e relacionamentos utilizam UUIDs de 128 bits (`java.util.UUID`), garantindo interoperabilidade entre sistemas governamentais.
* **Geoprocessamento com PostGIS**: Suporte nativo a geometrias espaciais JTS (`Point`, `Polygon`, `MultiPolygon`) sob o sistema de referência `EPSG:4326` (WGS 84).
* **Isolamento de Segurança Arqueológica**: Separação física e relacional 1:1 das coordenadas exatas de sítios arqueológicos sensíveis para proteção contra saques e vandalismo.
* **Modelagem Híbrida com JSONB**: Utilização do suporte `jsonb` do PostgreSQL no Hibernate 6 (`@JdbcTypeCode(SqlTypes.JSON)`) para catalogar equipes técnicas, patologias de conservação, metas de salvaguarda e trilhas de auditoria, evitando proliferação excessiva de tabelas associativas.
* **Estratégia Zero Bytea (Mídias Digitais)**: Armazenamento externo de mídias e documentos em storage/S3, mantendo no banco de dados apenas a chave lógica (`storageKey`) e o hash **SHA256** de integridade.
* **Segurança Stateless via JWT**: Autenticação baseada em Spring Security, codificação de senhas via BCrypt e suporte a flag declarativa de 2FA.

---


## 1.0 Visão Geral e Propósito do Sistema

O Sistema de Informação do Patrimônio do Estado do Maranhão (**SIP-MA**) atua como a infraestrutura de dados espaciais e administrativos centralizada para a **SECMA** (Secretaria de Estado da Cultura do Maranhão), operando em sintonia com o **IPHAN**, Prefeituras Municipais e o **Ministério Público Estadual** .

### O Escopo Abrange as 3 Naturezas do Patrimônio Cultural :
1. **Material Edificado:** Casarões históricos, igrejas, monumentos e conjuntos urbanos tombados de cidades como São Luís, Alcântara e Caxias .
2. **Imaterial (Intangível):** Manifestações culturais, tradições, festas, saberes e celebrações (ex: Bumba Meu Boi, Tambor de Crioula, Rito do Divino Espírito Santo) .
3. **Arqueológico:** Sítios arqueológicos pré-coloniais, sambaquis, inscrições rupestres e ruínas históricas .


## 2. Análise do Domínio e Desafios de Negócio

A gestão de patrimônio cultural em escala estadual enfrenta gargalos operacionais que o SIP-MA foi projetado para resolver:

* **Dispersão de Dados:** Histórico de portarias, laudos periciais e vistorias descentralizados em arquivos físicos ou planilhas suscetíveis a perdas.
* **Ausência de Georreferenciamento Cartográfico:** Falta de delimitação precisa de zonas de tombamento e áreas de amortecimento (entorno) .
* **Vulnerabilidade de Sítios Arqueológicos:** A exposição pública indevida das coordenadas exatas de sítios arqueológicos resulta em saques, vandalismo e destruição irreversível do acervo.
* **Heterogeneidade do Domínio:** Um imóvel histórico possui métricas físicas (área, pavimentos, estrutura) completamente incompatíveis com uma dança folclórica imaterial. Modelagens relacionais estritas geravam *table bloat* (tabelas com excesso de colunas nulas).


## 3. Escolhas Arquiteturais e Padrões de Engenharia

O backend do SIP-MA adota um padrão rigoroso de **Arquitetura em Camadas Desacopladas (Cliente-Servidor / REST)**:

```text
  [ Frontend React / Mobile App / Insomnia ]
                    │
                    │  (Requisições HTTP RESTful com JSON DTO) [120]
                    ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 1. CONTROLLERS (@RestController)                       │
 │    - Mapeamento de Rotas HTTP (/api/...)               │
 │    - Recebe/Retorna DTOs com ResponseEntity             │
 └──────────────────────────┬──────────────────────────────┘
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 2. SERVICES (@Service & @Transactional)                │
 │    - Regras de Negócio e Validações de Consistência   │
 │    - Lança RegraNegocioRunTime em caso de invalidez    │
 └──────────────────────────┬──────────────────────────────┘
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 3. REPOSITORIES (Spring Data JPA / Hibernate Spatial)   │
 │    - Abstração do Acesso a Dados (Interfaces DAO)      │
 │    - Consultas Derivadas e JPQL Espacial               │
 └──────────────────────────┬──────────────────────────────┘
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 4. DATABASE (PostgreSQL 14 + Extension PostGIS)         │
 │    - Geometrias Espaciais EPSG:4326 + Colunas JSONB     │
 └─────────────────────────────────────────────────────────┘
```

### Principais Decisões Tecnológicas:
* **Identificadores Globais Universais (UUID 128-bit):** Todas as entidades utilizam `java.util.UUID` como chave primária, assegurando interoperabilidade com outros sistemas governamentais sem colisões de IDs .
* **Padrão DTO (Data Transfer Objects):** Nenhuma entidade JPA/Hibernate é exposta diretamente na API REST, protegendo o modelo de dados e evitando vazamento de atributos internos .
* **Modelagem Híbrida Relacional + JSONB:** Uso das colunas `jsonb` do PostgreSQL no Hibernate 6 (`@JdbcTypeCode(SqlTypes.JSON)`) para gerenciar equipes técnicas, patologias em vistorias, metas de salvaguarda e auditoria sem criar tabelas filhas desnecessárias .
* **Estratégia Zero Bytea (RNF05):** Mídias e documentos são mantidos em buckets externos/storage. O PostgreSQL armazena apenas a URL/chave lógica (`storageKey`) e o hash **SHA256** para checagem de integridade .
* **Segurança Stateless e Controle de Acesso (RBAC):** Proteção via Spring Security com tokens JWT, senhas criptografadas com **BCrypt**, indicador de **2FA** e perfis de acesso (`ADMIN`, `TECNICO`, `CONSULTOR`, `LEITOR`, `JURIDICO`) .
* **Tratamento Global de Exceções:** Exceções de negócio lançam a classe personalizada `RegraNegocioRunTime`, que é capturada e convertida automaticamente em respostas HTTP `400 Bad Request`.


## 📂 Estrutura do Projeto Backend

```text
SisTomPatrimonio-api/
├── docker-compose.yml                      # Container PostgreSQL 14 + PostGIS (Geoprocessamento)
├── pom.xml                                 # Dependências Maven (Spring Boot 3, PostGIS, Flyway, H2)
├── README.md                               # Documentação e guia do projeto
└── src/
    ├── main/
    │   ├── java/br/com/SisTomPatrimonio/SisTomPatrimonio/
    │   │   ├── SisTomPatrimonioApplication.java       # Main Spring Boot
    │   │   │
    │   │   ├── config/                     # Configurações do Spring Security e Beans
    │   │   │   └── SecurityConfig.java
    │   │   │
    │   │   ├── controllers/                # Camada REST (Endpoints HTTP)
    │   │   │   ├── BemCulturalController.java
    │   │   │   ├── DocumentoController.java
    │   │   │   ├── EventoBemController.java
    │   │   │   ├── ProcessoJudicialController.java
    │   │   │   ├── ProtecaoController.java
    │   │   │   ├── SalvaguardaController.java
    │   │   │   ├── UsuarioController.java
    │   │   │   └── VistoriaController.java
    │   │   │
    │   │   ├── dtos/                       # Data Transfer Objects (Payloads JSON)
    │   │   │   ├── BemCulturalDTO.java
    │   │   │   ├── DocumentoDTO.java
    │   │   │   ├── EventoBemDTO.java
    │   │   │   ├── ProcessoJudicialDTO.java
    │   │   │   ├── ProtecaoDTO.java
    │   │   │   ├── SalvaguardaDTO.java
    │   │   │   ├── UsuarioDTO.java
    │   │   │   └── VistoriaDTO.java
    │   │   │
    │   │   ├── exceptions/                 # Trutamento Global de Exceções
    │   │   │   └── RegraNegocioRunTime.java
    │   │   │
    │   │   ├── models/                     # Camada de Domínio
    │   │   │   ├── entities/               # Entidades JPA & PostGIS (15 Tabelas)
    │   │   │   │   ├── Auditoria.java
    │   │   │   │   ├── BemCultural.java
    │   │   │   │   ├── Documento.java
    │   │   │   │   ├── EventoBem.java
    │   │   │   │   ├── LocalizacaoArqueologicaRestrita.java
    │   │   │   │   ├── LocalizacaoBem.java
    │   │   │   │   ├── MovimentacaoJudicial.java
    │   │   │   │   ├── Municipio.java
    │   │   │   │   ├── Organizacao.java
    │   │   │   │   ├── ProcessoBem.java
    │   │   │   │   ├── ProcessoBemId.java
    │   │   │   │   ├── ProcessoJudicial.java
    │   │   │   │   ├── Protecao.java
    │   │   │   │   ├── Salvaguarda.java
    │   │   │   │   ├── Usuario.java
    │   │   │   │   └── Vistoria.java
    │   │   │   │
    │   │   │   └── enums/                  # Domínios e Restrições de Enumeração
    │   │   │       ├── CategoriaDocumento.java
    │   │   │       ├── ClassificacaoSeguranca.java
    │   │   │       ├── EventoTipo.java
    │   │   │       ├── FaseProcessoJudicial.java
    │   │   │       ├── NaturezaBem.java
    │   │   │       ├── PerfilUsuario.java
    │   │   │       ├── StatusBemCultural.java
    │   │   │       ├── StatusSalvaguarda.java
    │   │   │       ├── StatusValidacaoDocumento.java
    │   │   │       └── StatusVistoria.java
    │   │   │
    │   │   ├── repositories/               # Interfaces Spring Data JPA
    │   │   │   ├── BemCulturalRepository.java
    │   │   │   ├── DocumentoRepository.java
    │   │   │   ├── EventoBemRepository.java
    │   │   │   ├── MunicipioRepository.java
    │   │   │   ├── OrganizacaoRepository.java
    │   │   │   ├── ProcessoJudicialRepository.java
    │   │   │   ├── ProtecaoRepository.java
    │   │   │   ├── SalvaguardaRepository.java
    │   │   │   ├── UsuarioRepository.java
    │   │   │   └── VistoriaRepository.java
    │   │   │
    │   │   └── services/                   # Regras de Negócio e Transações
    │   │       ├── BemCulturalService.java
    │   │       ├── DocumentoService.java
    │   │       ├── EventoBemService.java
    │   │       ├── ProcessoJudicialService.java
    │   │       ├── ProtecaoService.java
    │   │       ├── SalvaguardaService.java
    │   │       ├── UsuarioService.java
    │   │       └── VistoriaService.java
    │   │
    │   └── resources/
    │       ├── application.yml             # Propriedades da aplicação
    │       └── db/migration/
    │           └── V1__criar_schema_SisTomPatrimonio.sql # Migration DDL do PostGIS
    │
    └── test/
    └── java/
        └── br/com/SisTomPatrimonio/SisTomPatrimonio/
            │
            ├── controllers/
            │   ├── BemCulturalControllerTest.java
            │   ├── DocumentoControllerTest.java         (✨ NOVO)
            │   ├── EventoBemControllerTest.java
            │   ├── ProcessoJudicialControllerTest.java
            │   ├── ProtecaoControllerTest.java          (✨ NOVO)
            │   ├── SalvaguardaControllerTest.java
            │   ├── UsuarioControllerTest.java
            │   └── VistoriaControllerTest.java          (✨ NOVO)
            │
            ├── repositories/
            │   ├── AuditoriaRepositoryTest.java
            │   ├── BemCulturalRepositoryTest.java       (✨ NOVO)
            │   ├── DocumentoRepositoryTest.java
            │   ├── EventoBemRepositoryTest.java         (✨ NOVO)
            │   ├── MunicipioRepositoryTest.java         (✨ NOVO)
            │   ├── OrganizacaoRepositoryTest.java       (✨ NOVO)
            │   ├── ProcessoJudicialRepositoryTest.java  (✨ NOVO)
            │   ├── ProtecaoRepositoryTest.java
            │   ├── SalvaguardaRepositoryTest.java       (✨ NOVO)
            │   ├── UsuarioRepositoryTest.java
            │   └── VistoriaRepositoryTest.java
            │
            ├── services/
            │   ├── BemCulturalServiceTest.java
            │   ├── DocumentoServiceTest.java            (✨ NOVO)
            │   ├── EventoBemServiceTest.java            (✨ NOVO)
            │   ├── ProcessoJudicialServiceTest.java     (✨ NOVO)
            │   ├── ProtecaoServiceTest.java             (✨ NOVO)
            │   ├── SalvaguardaServiceTest.java          (✨ NOVO)
            │   ├── UsuarioServiceTest.java
            │   └── VistoriaServiceTest.java             (✨ NOVO)
            │
            ├── AbstractIntegrationTest.java
            └── SisTomPatrimonioApplicationTests.java
```

---

## 🗄️ Modelo de Dados (15 Entidades Relacionais & Espaciais)

| Entidade | Descrição / Função Arquitetural |
| :--- | :--- |
| **`usuario`** | Servidores e peritos da SECMA com RBAC (`ADMIN`, `TECNICO`, `CONSULTOR`, `LEITOR`, `JURIDICO`) e flag 2FA. |
| **`organizacao`** | Instituições governamentais e de salvaguarda (SECMA, IPHAN, Prefeituras). |
| **`municipio`** | Base cartográfica espacial municipal do Maranhão com geometria `MultiPolygon` PostGIS (EPSG:4326). |
| **`bem_cultural`** | Entidade central do patrimônio (Materiais, Imateriais e Arqueológicos) contendo `dados_especificos` em JSONB. |
| **`localizacao_bem`** | Coordenadas públicas e endereço de referência postal de imóveis e áreas protegidas. |
| **`localizacao_arqueologica_restrita`** | Isolamento de segurança 1:1 de coordenadas exatas de sítios arqueológicos sensíveis. |
| **`protecao`** | Processos legais de tombamento, livros de tombo, instâncias e atos normativos estaduais. |
| **`vistoria`** | Vistorias preventivas com catálogos de patologias e equipes técnicas em colunas **JSONB**. |
| **`processo_judicial`** | Ações judiciais de embargo e preservação contendo o número único CNJ e valor da causa. |
| **`processo_bem`** | Tabela associativa N:N com chave composta (`ProcessoBemId`) vinculando ações aos bens com papel do bem. |
| **`movimentacao_judicial`** | Histórico sequencial de andamentos dos processos judiciais. |
| **`documento`** | Repositório polimórfico de mídias, fotos e portarias com cálculo de hash criptográfico **SHA256**. |
| **`evento_bem`** | Linha do tempo histórica de restauros, reformas e marcos temporais do bem. |
| **`salvaguarda`** | Planos de ação e apoio ao patrimônio imaterial contendo metas/orçamentos estruturados em **JSONB**. |
| **`auditoria`** | Trilha transacional imutável gravando snapshots `dados_anteriores` e `dados_novos` em **JSONB**. |



---

## 5. Modelo de Dados Físico, Espacial (PostGIS) e Híbrido (JSONB)

O banco de dados relacional e geoespacial do SIP-MA é composto por **15 tabelas interdependentes**:

| Tabela / Entidade | Função no Sistema | Tipo de Dados / Destaque Arquitetural |
| :--- | :--- | :--- |
| **`usuario`** | Servidores, peritos e advogados da SECMA | UUID [PK], `perfil` ENUM, flag `dois_fatores` . |
| **`organizacao`** | Instituições governamentais e de salvaguarda (SECMA, IPHAN) | UUID [PK], CNPJ único. |
| **`municipio`** | Base cartográfica espacial dos municípios do Maranhão | UUID [PK], Geometria `MultiPolygon` PostGIS (EPSG:4326) . |
| **`bem_cultural`** | Centralizador unificado de ativos materiais, imateriais e arqueológicos | UUID [PK], `natureza` ENUM, atributo dinâmico `dados_especificos` JSONB . |
| **`localizacao_bem`** | Coordenadas públicas e endereço postal de monumentos | UUID [PK], Geometria `Point` ou `Polygon` PostGIS (EPSG:4326) . |
| **`localizacao_arqueologica_restrita`** | Isolamento de segurança 1:1 de coordenadas exatas de sítios arqueológicos | UUID [PK], Geometria `geom_exata` Point e `buffer_protecao` Polygon . |
| **`protecao`** | Processo legal de tombamento, decreto e livro de tombo | UUID [PK], `fase` ENUM, controle de vigência . |
| **`vistoria`** | Inspeções preventivas de conservação e patologias | UUID [PK], colunas dinâmicas `equipe` JSONB e `patologias` JSONB . |
| **`processo_judicial`** | Ações judiciais de embargo, dano e preservação | UUID [PK], número padronizado CNJ único [74, 75]. |
| **`processo_bem`** | Tabela associativa N:N entre ações judiciais e bens | Chave composta `ProcessoBemId` (`processo_id`, `bem_id`). |
| **`movimentacao_judicial`** | Histórico sequencial de andamentos dos processos judiciais | UUID [PK], ordem sequencial de andamentos . |
| **`documento`** | Repositório polimórfico de plantas, portarias e laudos | UUID [PK], armazena `storageKey` (Zero Bytea) e hash `sha256`. |
| **`evento_bem`** | Linha do tempo histórica de restauros e intervenções | UUID [PK], `tipo` ENUM, anos e datas de início/fim. |
| **`salvaguarda`** | Planos de ação e apoio ao patrimônio imaterial | UUID [PK], plano detalhado na coluna `acoes` JSONB  |
| **`auditoria`** | Trilha transacional imutável de alteração de dados | BIGINT [PK], grava instantâneos `dados_anteriores` e `dados_novos` em JSONB  |



---

## 🔌 Principais Endpoints da API REST

* **`POST /api/usuarios`** — Cadastro de usuários e peritos.
* **`POST /api/bens`** — Cadastro de novos bens culturais materiais, imateriais ou arqueológicos.
* **`GET /api/bens/filtrar?natureza=...`** — Consulta de bens filtrados por natureza e status.
* **`POST /api/vistorias`** — Agendamento de vistorias técnicas.
* **`POST /api/vistorias/{id}/patologias`** — Inclusão de anomalias físicas no vetor JSONB da vistoria.
* **`PUT /api/vistorias/{id}/homologar`** — Homologação pericial de vistorias realizadas.
* **`POST /api/protecoes`** — Registro de processos de tombamento legal.
* **`PUT /api/protecoes/{id}/revogar`** — Revogação de vigência do ato normativo.
* **`POST /api/processos-judiciais`** — Cadastro de ações judiciais de preservação.
* **`POST /api/processos-judiciais/{id}/vincular-bem`** — Associação N:N entre ação judicial e bem cultural.
* **`POST /api/documentos`** — Registro polimórfico de documentos e fotos com validação de hash SHA256.
* **`GET /api/eventos-bem/bem/{bemId}/linha-tempo`** — Consulta da cronologia histórica de intervenções de um monumento.
* **`POST /api/salvaguardas/{id}/acoes`** — Inclusão de metas no plano de salvaguarda imaterial via JSONB.

---

## 6. Catálogo Completo de APIs RESTful

### 👤 Módulo Usuários & Segurança (`/api/usuarios`)
* `POST /api/usuarios`: Cadastra novos servidores/peritos com senha encriptada via BCrypt.
* `POST /api/usuarios/autenticar`: Efetua login e emite o token JWT (verificando flag 2FA).

### 🏛️ Módulo Core Patrimonial (`/api/bens`)
* `POST /api/bens`: Registra novos bens culturais (Materiais, Imateriais e Arqueológicos).
* `GET /api/bens/filtrar?natureza={NATUREZA}`: Busca bens por filtro de natureza e classificação de segurança.

### 🔍 Módulo Vistorias & Fiscalização (`/api/vistorias`)
* `POST /api/vistorias`: Agenda uma nova vistoria técnica preventiva.
* `POST /api/vistorias/{id}/patologias`: Adiciona laudos de patologias físicas ao vetor JSONB da vistoria.
* `PUT /api/vistorias/{id}/homologar`: Homologa pericialmente a vistoria realizada.

### 📜 Módulo Tombamento Legal (`/api/protecoes`)
* `POST /api/protecoes`: Emite o decreto e cria o processo de tombamento.
* `PUT /api/protecoes/{id}/revogar`: Revoga a vigência de um ato normativo.

### ⚖️ Módulo Processos Judiciais N:N (`/api/processos-judiciais`)
* `POST /api/processos-judiciais`: Cadastra ação judicial de embargo por número CNJ.
* `POST /api/processos-judiciais/{id}/vincular-bem`: Associa N:N um processo a um bem cultural via `ProcessoBem`.
* `DELETE /api/processos-judiciais/{id}/desvincular-bem/{bemId}`: Remove o vínculo entre o processo e o bem.

### 📂 Módulo Documentos & Mídias (`/api/documentos`)
* `POST /api/documentos`: Cadastra metadados de plantas/laudos validando tamanho e hash SHA256.

### ⏳ Módulo Linha do Tempo & Salvaguarda Imaterial
* `GET /api/eventos-bem/bem/{bemId}/linha-tempo`: Consulta a cronologia histórica de restauros do bem.
* `POST /api/salvaguardas/{id}/acoes`: Inclui novas metas e orçamentos ao plano de salvaguarda via JSONB.



## 7. Estratégia de Qualidade e Testes Automatizados

O SIP-MA adota uma abordagem de testes sistemática e repetível estruturada no padrão **Cenário -> Ação -> Verificação** :

1. **Testes de Unidade nos Services (JUnit 5 + Mockito):**
   * Avaliam isoladamente as regras de negócio em métodos das classes `@Service` [4].
   * Utilizam `@Mock` e `@InjectMocks` para isolar chamadas de banco e validar se restrições violadas lançam a exceção `RegraNegocioRunTime`.
2. **Testes de Controllers REST (MockMvc + `@WebMvcTest`):**
   * Validam mapeamentos de rotas, serialização JSON e códigos de status HTTP (`201 Created`, `200 OK`, `400 Bad Request`) .
   * Utilizam o utilitário `MockMvc` com `@MockBean` para simular requisições web sem subir o servidor Tomcat .
3. **Testes de Persistência e Repositórios (H2 em Memória):**
   * Utilizam `@SpringBootTest` com `@ActiveProfiles("test")` para testar mapeamentos JPA, constraints e consultas em JPQL contra um banco em memória isolado (`jdbc:h2:mem:sipma_test`).

---


## 8. Análise Crítica: Falhas Críticas e Paridade Ambiental (H2 vs. Testcontainers)

### 📌 Análise de Falhas Críticas de Domínio (O Inaceitável)
1. **Vazamento de Coordenadas Arqueológicas (`localizacao_arqueologica_restrita`):** A exposição das coordenadas exatas (`geom_exata`) de sítios sensíveis para perfis sem credencial (`LEITOR`) resulta em vandalismo e saques físicos.
   * *Mitigação:* DTOs de resposta geral nunca contêm o nó espacial restrito, e o `BemCulturalService` exige validação de perfil `ADMIN`/`TECNICO` e registro de fundamentação em auditoria.
2. **Quebra da Trilha de Auditoria Legal:** A ausência de logs em operações em lote compromete a validade jurídica de processos de tombamento.
   * *Mitigação:* Listeners JPA e eventos síncronos gravam snapshots `dados_anteriores` e `dados_novos` em colunas `jsonb` dentro da transação principal.
3. **Violação do RNF05 (Zero Bytea):** Armazenar binários no PostgreSQL causa *table bloat* e lentidão do banco.
   * *Mitigação:* Armazenamento estrito de referências lógicas (`storageKey`) e verificação via hash **SHA256**.

---

### ⚖️ Discussão Técnica: H2 vs. Testcontainers em CI/CD e Escopo Acadêmico

A decisão de substituir totalmente o **H2** pelo **Testcontainers** (`postgis/postgis:14-3.3-alpine`) deve ser analisada sob dois prismas distintos: **o ambiente real de produção/CI-CD governamental** versus **o projeto acadêmico de entrega e avaliação da disciplina**.

#### Prisma 1: Escopo Acadêmico e Avaliação Disciplinar (Abordagem Atual com H2)
* **Sem Dependência do Daemon do Docker:** Permitir que o professor ou avaliador rode `mvn test` em qualquer ambiente operacional imediatamente, sem a exigência de ter o Docker Desktop instalado ou rodando em background.
* **Velocidade de Execução:** O H2 sobe o contexto de teste em memória em poucos segundos, facilitando a execução rápida durante o desenvolvimento das aulas.
* **Alinhamento Pedagógico:** Atende com precisão às diretrizes da disciplina, utilizando o perfil de testes (`application-test.properties`) com suporte a dialeto espacial H2.

#### Prisma 2: Produção Real e Pipeline CI/CD Governamental (Uso do Testcontainers)
* **Divergência entre Motores Espaciais:** O H2 com `H2SpatialDialect` emula cálculos geodésicos em Java através da biblioteca JTS. Já o **PostGIS** em produção executa rotinas espaciais nativas em C/C++ (GEOS, GDAL, PROJ).
* **Prevenção de Falsos Positivos:** Operações espaciais complexas em SRID `EPSG:4326` (como `ST_Contains` em polígonos de amortecimento ou `ST_Intersects`) podem passar "verde" no H2, mas apresentar diferenças de precisão flutuante ou incompatibilidades de funções SQL no PostGIS real.
* **100% de Paridade Ambiental (12-Factor App):** Adoção da biblioteca Testcontainers em esteiras de integração contínua (GitHub Actions / GitLab CI) para levantar temporariamente a imagem exata `postgis/postgis:14-3.3-alpine`, executando as migrations reais do Flyway e garantindo paridade ambiental perfeita antes do deploy.

---


## 9. 🚀 Guia Passo a Passo de Execução para Iniciantes

Este guia foi elaborado para que qualquer pessoa consiga configurar, rodar, executar a suíte de testes e testar os endpoints REST do SIP-MA do zero.

---

### 📦 Passo 1: Pré-requisitos
Garanta que as seguintes ferramentas estejam instaladas em sua máquina:
1. **JDK 17 ou superior** (Java Development Kit).
2. **Apache Maven 3.8+** (Gerenciador de dependências).
3. **Docker Desktop** (para subir o banco PostgreSQL + PostGIS).
4. **Git** (para clonagem do repositório).
5. **Insomnia REST Client** ou **Postman** (para testar os endpoints da API).
6. **IDE de sua preferência** (IntelliJ IDEA ou VS Code).

---

### 📥 Passo 2: Clonar e Abrir o Projeto
Abra o terminal de comandos e execute:
```bash
# 1. Clonar o repositório do projeto
git clone https://github.com/seu-usuario/SisTomPatrimonio-api.git

# 2. Entrar na pasta raiz do projeto
cd sipma-api

# 3. Abrir o projeto na sua IDE (exemplo no VS Code ou IntelliJ)
code .
```

---

### 🐳 Passo 3: Subir o Banco de Dados PostGIS via Docker
Com o Docker Desktop em execução, abra o terminal na raiz do projeto onde está o arquivo `docker-compose.yml` e digite:
```bash
docker-compose up -d
```
*O Docker baixará a imagem `postgis/postgis:14-3.3-alpine` e inicializará o banco na porta `5432`. Para verificar se o container está ativo, execute:*
```bash
docker ps
```

---

### 🛠️ Passo 4: Compilar o Projeto e Rodar as Migrations do Flyway
Execute o comando de compilação do Maven na raiz do projeto:
```bash
mvn clean install
```
*Durante a inicialização, o **Flyway** executará automaticamente o script `V1__criar_schema_sipma.sql`, criando todas as 15 tabelas e extensões espaciais do PostGIS.*

---

### 🧪 Passo 5: Executar a Suíte Completa de Testes Automatizados
Para rodar todos os testes de unidade de regras de negócio, controladores REST e persistência sem afetar o banco principal, execute:
```bash
mvn test
```
*A suíte utilizará automaticamente o perfil isolado de teste (`@ActiveProfiles("test")`), executando sobre o banco H2 em memória.*

---

### 🚀 Passo 6: Subir a Aplicação Spring Boot
Para rodar a API RESTful localmente escutando na porta `8080`, execute:
```bash
mvn spring-boot:run
```
*A aplicação estará pronta quando exibir no terminal a mensagem:*
`Started SisTomPatrimonio in X.XXX seconds (JVM running for X.XXX)`

---

### 📬 Passo 7: Testar as Rotas da API com o Insomnia
1. Abra o **Insomnia REST Client**.
2. Clique em **Import** -> **Import From File**.
3. Selecione o arquivo **`insomnia-SisTomPatrimonio-collection.json`** localizado na raiz do projeto.
4. Teste os endpoints estruturados nas pastas:
   * **1. Usuários & Autenticação:** Execute a chamada `POST /api/usuarios` para cadastrar um servidor e `POST /api/usuarios/autenticar` para obter o token JWT.
   * **2. Core Patrimonial:** Execute a chamada `POST /api/bens` para cadastrar um bem cultural.
   * **3. Vistorias & Fiscalização:** Teste o agendamento e a inclusão de patologias em JSONB.

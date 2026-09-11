# 🏛️ SIP-MA — Sistema de Informação do Patrimônio (Maranhão)

O **SisTomPatrimonio** é uma plataforma corporativa e estadual de geoprocessamento, salvaguarda e controle documental projetada para mapear, proteger e fiscalizar a herança cultural tangível (bens materiais edificados), intangível (patrimônio imaterial/folclore) e arqueológica do Estado do Maranhão.

---

## 🚀 Diferenciais de Engenharia & Arquitetura

Ao contrário de sistemas tradicionais de tombamento interno de ativos, o SIP-MA foi projetado para escala estadual macro, incorporando decisões arquiteturais avançadas de software:

* **Arquitetura em Camadas Desacopladas**: Backend estruturado estritamente em `Controllers` (REST/DTOs), `Services` (Regras de negócio e transações `@Transactional`), `Repositories` (Spring Data JPA / Hibernate Spatial) e `Entities` (JPA/PostGIS).
* **Identificação Única por UUIDs**: Todas as chaves primárias e relacionamentos utilizam UUIDs de 128 bits (`java.util.UUID`), garantindo interoperabilidade entre sistemas governamentais.
* **Geoprocessamento com PostGIS**: Suporte nativo a geometrias espaciais JTS (`Point`, `Polygon`, `MultiPolygon`) sob o sistema de referência `EPSG:4326` (WGS 84).
* **Isolamento de Segurança Arqueológica**: Separação física e relacional 1:1 das coordenadas exatas de sítios arqueológicos sensíveis para proteção contra saques e vandalismo.
* **Modelagem Híbrida com JSONB**: Utilização do suporte `jsonb` do PostgreSQL no Hibernate 6 (`@JdbcTypeCode(SqlTypes.JSON)`) para catalogar equipes técnicas, patologias de conservação, metas de salvaguarda e trilhas de auditoria, evitando proliferação excessiva de tabelas associativas.
* **Estratégia Zero Bytea (Mídias Digitais)**: Armazenamento externo de mídias e documentos em storage/S3, mantendo no banco de dados apenas a chave lógica (`storageKey`) e o hash **SHA256** de integridade.
* **Segurança Stateless via JWT**: Autenticação baseada em Spring Security, codificação de senhas via BCrypt e suporte a flag declarativa de 2FA.

---

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
    └── test/                               # Suíte de Testes Automatizados
        └── java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/
            ├── BemCulturalControllerTest.java
            ├── EventoBemControllerTest.java
            ├── ProcessoJudicialControllerTest.java
            ├── ProtecaoControllerTest.java
            ├── SalvaguardaControllerTest.java
            ├── UsuarioControllerTest.java
            └── VistoriaControllerTest.java
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

## 🛠️ Requisitos e Execução Local

### Requisitos mínimos

- JDK 25 (recomendado: Temurin 25.x)
- Docker Desktop ou Docker Engine
- Git
- Maven Wrapper incluído no repositório (`./mvnw`)

> A aplicação foi validada com JDK 25. A versão 17 do Java não é compatível com o projeto devido ao `release` configurado em `pom.xml`.

### 1. Configurar o Java 25

No Windows PowerShell:

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
./mvnw -version
```

No Linux/macOS:

```bash
export JAVA_HOME=/caminho/para/jdk-25
export PATH="$JAVA_HOME/bin:$PATH"
java -version
./mvnw -version
```

### 2. Subir a infraestrutura local (PostgreSQL + PostGIS)

```bash
cp .env.example .env
docker compose up -d
```

No PowerShell, o equivalente é `Copy-Item .env.example .env`. O arquivo `.env` é ignorado pelo Git e pode conter os valores da sua máquina.

Esse comando inicia o container da base de dados definida em `docker-compose.yaml` com as seguintes credenciais:

- Banco: `sipma_db`
- Usuário: `postgres`
- Senha: `postgrespassword`
- Porta: `5432`

As configurações da aplicação podem ser sobrescritas por variáveis de ambiente:

| Variável | Uso | Valor local padrão |
| :--- | :--- | :--- |
| `DB_URL` | URL JDBC do PostgreSQL | `jdbc:postgresql://localhost:5432/sipma_db` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgrespassword` |
| `JWT_SECRET` | Segredo criptográfico da aplicação | definido apenas para desenvolvimento |

Em produção, substitua todos os valores padrão por secrets do ambiente de hospedagem ou de um secret manager. Nunca versionar o arquivo `.env`.

### 3. Compilar o projeto

```bash
./mvnw clean install
```

### 4. Executar a aplicação

```bash
./mvnw spring-boot:run
```

A API ficará disponível em:

- http://localhost:8080/api

### 5. Rodar os testes automatizados

```bash
./mvnw test
```

*Os testes utilizam o perfil de teste com `H2` em memória e não dependem do PostgreSQL local. Isso permite validar a camada de controller/service com isolamento e rapidez.*

---

## 🔄 CI/CD no GitHub Actions

Este repositório inclui um workflow de integração contínua em `.github/workflows/ci.yml` que executa:

- checkout do código
- instalação do JDK 25
- build com Maven
- execução da suíte de testes

O objetivo é garantir que qualquer alteração enviada para `main` ou para branches de pull request passe pela validação automática antes do merge.

O workflow `.github/workflows/release.yml` gera uma release automaticamente quando uma tag semântica é publicada:

```bash
git tag v0.1.0
git push origin v0.1.0
```

O pipeline compila o JAR com Java 25 e anexa o artefato à Release do GitHub. O deploy da aplicação deve ser configurado separadamente no ambiente de hospedagem, usando os secrets de produção.

---

## 📌 Observações importantes

- O projeto é construído com Spring Boot 3.5.x e Java 25.
- O banco de produção e desenvolvimento usa PostgreSQL com extensão PostGIS.
- O ambiente de testes usa H2 para manter a execução confiável em CI e em máquinas locais sem depender de um servidor de banco externo.
- O fluxo de execução local recomendado é: Java 25 -> Docker -> `./mvnw test` -> `./mvnw spring-boot:run`.

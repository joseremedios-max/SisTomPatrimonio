# 🏛️ SIP-MA — Sistema de Informação do Patrimônio (Maranhão)

O **SIP-MA** é uma plataforma corporativa e estadual de geoprocessamento, salvaguarda e controle documental projetada para mapear, proteger e fiscalizar a herança cultural tangível (bens materiais edificados), intangível (patrimônio imaterial/folclore) e arqueológica do Estado do Maranhão.

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
sipma-api/
├── docker-compose.yml                      # Container PostgreSQL 14 + PostGIS (Geoprocessamento)
├── pom.xml                                 # Dependências Maven (Spring Boot 3, PostGIS, Flyway, H2)
├── README.md                               # Documentação e guia do projeto
└── src/
    ├── main/
    │   ├── java/br/com/sipma/
    │   │   ├── SipmaApplication.java       # Main Spring Boot
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
    │   │   ├── exceptions/                 # Tratamento Global de Exceções
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
    │           └── V1__criar_schema_sipma.sql # Migration DDL do PostGIS
    │
    └── test/                               # Suíte de Testes Automatizados
        └── java/br/com/sipma/controllers/
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

## 🛠️ Como Executar o Projeto & Estratégia de Testes

### 1. Subir a Infraestrutura (PostgreSQL + PostGIS)
```bash
docker-compose up -d
```

### 2. Executar as Migrações do Banco e Compilação
```bash
mvn clean install
```

### 3. Executar a Suíte de Testes Automatizados
```bash
mvn test
```
*A suíte de testes do ambiente acadêmico executa automaticamente o perfil `@ActiveProfiles("test")` rodando os testes de integração dos controladores via `MockMvc` e `Mockito` sob o banco em memória H2 com extensão espacial.*

---

## 🧪 Estratégia de Qualidade & Recomendação de Paridade Ambiental (Testcontainers)

### Execução de Testes Acadêmicos vs. Produção Governamental

No ambiente de desenvolvimento local e avaliação acadêmica do trabalho, a suíte JUnit é mantida sobre o banco em memória H2 (`@ActiveProfiles("test")`). Isso garante execução leve, ágil e portabilidade imediata para avaliação, sem exigir que o avaliador possua o daemon do Docker em execução.

### Recomendações Arquiteturais para Ambientes de Produção / CI-CD

Para a implantação final em **pipeline de integração contínua (CI/CD)** de escala governamental, recomenda-se a substituição do H2 em memória pela biblioteca **Testcontainers** (`org.testcontainers:postgresql` com imagem `postgis/postgis:14-3.3-alpine`):

1. **Garantia de Paridade Espacial Nativa**: A emulação do H2 via `H2SpatialDialect` e biblioteca JTS pode gerar pequenas variações de precisão flutuante em relação ao motor C/C++ nativo do PostGIS (GEOS/GDAL). O Testcontainers garante 100% de precisão matemática para cálculos de buffers (`ST_Buffer`) e interseção de polígonos (`ST_Intersects`) sob o SRID `EPSG:4326`.
2. **Zero Falsos Positivos em Geoprocessamento**: A checagem de regras críticas — como verificar se as coordenadas de um novo imóvel residem na zona de amortecimento de um sítio arqueológico — é validada contra o mesmo motor espacial de produção.
3. **Execução Fiel das Migrations Flyway**: O Testcontainers executa o script DDL real `V1__criar_schema_sipma.sql` no banco de dados PostGIS temporário, validando os tipos de dados `jsonb`, `uuid` e os índices espaciais `GiST`.

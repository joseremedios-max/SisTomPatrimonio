# Requisitos Não-Funcionais (RNF) — SIP-MA

Os Requisitos Não-Funcionais estabelecem os critérios de qualidade, arquitetura, segurança, desempenho e restrições tecnológicas que regem o **SIP-MA**.

---

## Matriz de Requisitos Não-Funcionais

| Identificador | Categoria | Descrição do Critério | Padrão / Tecnologia |
| :---: | :--- | :--- | :--- |
| **RNF01** | Geoespacial | Utilização estrita de coordenadas e geometrias JTS sob o sistema de referência espacial WGS 84. | `PostGIS`, `EPSG:4326` |
| **RNF02** | Desempenho Espacial | Consultas geográficas por raio e envoltórias devem responder em menos de 100ms em volume de 100k registros. | Índices espaciais `GIST` |
| **RNF03** | Arquitetura de Mídias | Mídias e laudos fotográficos não podem ser armazenados como BLOB/Bytea dentro do banco relacional. | Estratégia `Zero-Bytea` (Storage S3/Local + SHA-256) |
| **RNF04** | Interoperabilidade | Todas as chaves primárias e relacionamentos externos devem utilizar identificadores universais de 128 bits. | `UUID` v4 (`java.util.UUID`) |
| **RNF05** | Evolução de Banco | Nenhuma modificação em tabelas, índices ou views pode ser feita manualmente sem script versionado. | `Flyway Migration` (`V{n}__...sql`) |
| **RNF06** | Segurança | Autenticação stateless, senhas criptografadas com salt dinâmico e controle de acesso por papel. | `Spring Security`, `BCrypt`, RBAC |
| **RNF07** | Tratamento de Erro | Todas as respostas de erro da API REST devem seguir rigorosamente o padrão internacional de erros HTTP. | `RFC 7807 ProblemDetail` |
| **RNF08** | Desempenho e Conexão | Pool de conexões otimizado para operações concorrentes de campo e gravações em lote. | `HikariCP` (10 conexões), `batch_size: 20` |

---

## Detalhamento Técnico

### RNF01 & RNF02 — PostGIS e Índices GIST
O backend deve mapear tipos geométricos espaciais da biblioteca **JTS Topology Suite** (`Point`, `Polygon`, `MultiPolygon`) diretamente para os tipos nativos do PostGIS. Índices do tipo **GIST (Generalized Search Tree)** devem ser mantidos nas tabelas `municipio`, `localizacao_bem` e `localizacao_arqueologica_restrita`, garantindo indexação bidimensional R-Tree de alta velocidade.

### RNF03 — Estratégia Zero-Bytea para Arquivos e Fotos
Para prevenir degradação do banco (bloat em tabelas TOAST e ineficiência de backup), documentos e imagens devem ser persistidos em armazenamento externo desacoplado (Amazon S3, MinIO ou volume local). O banco de dados armazena apenas a URI/chave lógica (`storage_key`), MIME type, tamanho e o hash SHA-256 de 64 caracteres hexadecimais para validação de integridade.

### RNF04 — Identificadores Únicos Universais (UUID)
Em conformidade com as diretrizes do governo federal (e-PING) e interoperabilidade entre sistemas estaduais, todas as entidades persistem UUIDs v4 como chaves primárias (`@GeneratedValue(strategy = GenerationType.AUTO)` ou `GenerationType.UUID`), eliminando conflitos de numeração sequencial em migrações e replicação distribuída.

### RNF05 — Rastreabilidade DDL com Flyway
O schema físico do banco de dados deve ser gerenciado com versionamento estrito de migrações SQL. A aplicação deve validar em tempo de inicialização (`spring.jpa.hibernate.ddl-auto=validate`) a perfeita conformidade entre o mapeamento JPA e o schema físico criado pelo Flyway.

### RNF06 & RNF07 — Segurança Stateless e RFC 7807
* Senhas de peritos e usuários são salvas com função de derivação de chave **BCrypt** com fator de trabalho 10.
* Erros na camada Web (validações, conflitos de banco, regras de negócio) são interceptados por `@RestControllerAdvice` e retornados com o tipo de conteúdo padronizado `application/problem+json`, trazendo URI canônica do erro, timestamp, status HTTP e lista de campos inválidos.

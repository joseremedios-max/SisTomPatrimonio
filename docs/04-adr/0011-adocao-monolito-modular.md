# ADR 0011: Adocao de Monolito Modular em Detrimento de Microservicos Prematuros

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comite de Desenvolvimento
* **Referencias**: [docs/03-modelagem/arquitetura-e-padroes.md](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/docs/03-modelagem/arquitetura-e-padroes.md), [ADR 0007](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/docs/04-adr/0007-desacoplamento-auditoria.md)

---

## 1. Contexto e Declaracao do Problema

Durante a transicao do prototipo conceitual para a arquitetura de producao do SisTomPatrimonio (SIP-MA), surgiu a discussao sobre a adocao de uma arquitetura de microservicos (por exemplo, servico separado para Bens Culturais, servico para Vistorias, servico para Processos Judiciais e servico para Documentos/Storage).

E necessario avaliar criticamente os requisitos de negocio do patrimonio cultural estadual e os impactos de uma distribuicao prematura de servicos:
1. **Transacionalidade e Consistencia ACID**: O processo de homologacao de tombamento estadual altera o processo de protecao, atualiza a inscricao no Livro do Tombo e altera o status juridico do Bem Cultural para TOMBADO. Em microservicos, isso exigiria transacoes distribuidas (Two-Phase Commit ou padrao Saga com transacoes compensatorias), introduzindo complexidade desnecessaria e risco de inconsistencia juridica.
2. **Complexidade Operacional e Infraestrutura**: Microservicos demandam infraestrutura de service mesh, API gateway dedicado, tracing distribuido, orquestracao de conteineres complexa e gerenciamento de multiplas bases de dados independentes.
3. **Volume de Carga e Equipe**: O sistema atende a Secretaria de Estado da Cultura do Maranhao (SECMA/MA), com perfis internos de analistas, gestores e peritos tecnicos. A volumetria de transacoes por segundo nao justifica a latencia de rede e a sobrecarga de comunicacao RPC/HTTP inter-servicos.

---

## 2. Opcoes Consideradas

* **Opcao 1: Microservicos Distribuidos**
  * Separacao de bancos e servicos por dominio de negocio (Bens, Vistorias, Documentos, Seguranca).
  * Comunicacao assincrona via Kafka/RabbitMQ e sincrona via REST/gRPC.
  * Trade-off: Alto custo de latencia de rede, manutencao de consistencia eventual em processos juridicos estatais e operacao complexa.

* **Opcao 2: Monolito Anemico Tradicional**
  * Codigo em bloco unico sem fronteiras bem definidas, com chamadas cruzadas diretas entre servicos e acoplamento forte a nivel de banco de dados.
  * Trade-off: Facil de iniciar, mas degrada rapidamente com o crescimento da base de codigo, gerando codigo espaguete.

* **Opcao 3: Monolito Modular (Modular Monolith) com Fronteiras Claras**
  * Deploy unificado em um unico artefato de producao (Spring Boot), com isolamento rigoroso por modulos, pacotes, DTOs e eventos de dominio.
  * Preservacao da consistencia ACID do PostgreSQL/PostGIS.
  * Comunicacao desacoplada atraves de eventos de dominio (`ApplicationEventPublisher`) e contratos de interface (ex: `StorageService`).

---

## 3. Decisao Tomada

Adotar a **Opcao 3: Monolito Modular**:

1. **Fronteiras Delimitadas por Dominio**:
   * Cada funcionalidade principal e isolada em seus respectivos subpacotes e contratos de servico (`services/`, `models/`, `dtos/`, `repositories/`, `storage/`, `events/`).
   * A camada de apresentacao (`controllers/`) nunca lida com entidades JPA diretamente, operando exclusivamente atraves de DTOs validados (`Jakarta Validation`).
2. **Garantia de Integridade Transacional**:
   * Operacoes criticas como a homologacao de tombamento e homologacao de laudo pericial executam sob uma transacao unica do Spring (`@Transactional`), assegurando integridade referencial e reversao automatica em caso de falha.
3. **Desacoplamento via Eventos**:
   * Operacoes transversais como auditoria e log sao desacopladas do fluxo de negocio principal via `AuditoriaEvent` e `@TransactionalEventListener(phase = AFTER_COMMIT)`.
4. **Caminho Evolutivo Natural**:
   * Se futuramente um modulo especifico (como processamento pesado de arquivos e imagens ou rasterizacao GIS) demandar escala independente, suas fronteiras de DTOs e interfaces isoladas permitirao extrai-lo para um servico autonomo sem necessidade de refatorar o nucleo do negocio.

---

## 4. Consequencias e Trade-offs

### Impactos Positivos:
* **Simplicidade de Implantacao**: Um unico artefato executavel JAR/Docker, facilitando esteiras de CI/CD e monitoramento em producao.
* **Consistencia Transacional Garantida**: Eliminacao do risco de dados orfaos ou estados intermediarios inconsistentes no tombamento e na salvaguarda.
* **Alto Desempenho e Baixa Latencia**: Chamadas diretas em memoria na JVM, sem sobrecarga de serializacao JSON sobre rede entre componentes internos.
* **Manutenibilidade e Testabilidade**: Todos os 9 servicos do sistema possuem suites de testes unitarios com mocks puros executando em milissegundos.

### Impactos Negativos (Custos):
* Exige disciplina continua da equipe de engenharia para respeitar a hierarquia de pacotes e nao criar acoplamentos ciclicos indevidos.

# SisTomPatrimonio (SIP-MA) — Documentação de Engenharia de Software

Bem-vindo à documentação oficial e cronológica do **SisTomPatrimonio (Sistema de Informação do Patrimônio - Maranhão)**. 

Este repositório documental foi estruturado para fornecer total transparência e rastreabilidade sobre a concepção, os requisitos, a modelagem conceitual, as decisões de arquitetura (ADRs) e as decisões de implementação do sistema.

---

## Mapa de Navegação da Documentação

A documentação segue uma cronologia estrita de Engenharia de Software:

```text
docs/
├── 01-concepcao/               # Fase 1: Por que o sistema existe e qual problema ele resolve
│   └── visao-do-produto.md     # Documento de Visão, público-alvo, objetivos e escopo do SIP-MA
│
├── 02-requisitos/              # Fase 2: O que o sistema deve fazer e quais as restrições
│   ├── requisitos-funcionais.md# RF01 a RF12 com descrição e critérios
│   ├── requisitos-nao-funcionais.md # RNF01 a RNF08 (performance, PostGIS, segurança, zero-bytea)
│   └── regras-de-negocio.md    # RN01 a RN10 (invariantes e políticas de domínio)
│
├── 03-modelagem/               # Fase 3: Como o sistema foi desenhado visualmente
│   ├── casos-de-uso.md         # Diagrama de Casos de Uso (Mermaid) e fluxos dos atores
│   ├── modelo-dominio.md       # Diagrama de Classes Conceitual do Domínio (Mermaid)
│   ├── modelo-dados-der.md     # Diagrama Entidade-Relacionamento (DER) e Dicionário de Dados
│   ├── fluxos-e-sequencia.md   # Diagramas de Sequência dos principais fluxos de negócio
│   └── arquitetura-e-padroes.md# Padrões (Strategy, Observer, Domínio Rico) e Alta Coesão/Baixo Acoplamento
│
└── 04-adr/                     # Fase 4: Architecture Decision Records (Por que decidimos assim)
    ├── template-adr.md         # Template padrão para novos registros
    ├── 0001-adocao-de-adrs.md  # Governança e adoção de registros de decisões
    ├── 0002-definicao-escopo-patrimonio.md # Escopo macro cultural vs inventário setorial
    ├── 0003-geoprocessamento-postgis.md    # Uso de PostGIS EPSG:4326 e buscas espaciais
    ├── 0004-modelagem-hibrida-jsonb.md     # Uso de colunas JSONB para patologias e equipes
    ├── 0005-estrategia-zero-bytea-midias.md# Mídias em storage externo com hashes SHA-256
    ├── 0006-alinhamento-schema-dbdiagram.md# Definição do dbdiagram como fonte da verdade
    ├── 0007-desacoplamento-auditoria.md    # Trilha transacional e eventos de domínio
    ├── 0008-estrategia-storage-strategy-pattern.md # Strategy Pattern para storage e SHA-256
    ├── 0009-isolamento-dto-seguranca-senhas.md     # DTOs estritos, segurança e RFC 7807
    ├── 0010-modelo-dominio-rico-invariantes.md     # Domínio rico e proteção de invariantes de estado
    └── 0011-adocao-monolito-modular.md             # Monólito Modular vs Microserviços prematuros
```

---

## Cobertura da Camada de Serviços e Testes Automatizados

O sistema conta com 100% dos seus serviços de negócio testados unitariamente através de testes automatizados com JUnit 5 e Mockito, cobrindo tanto o caminho feliz (funcionalidades) quanto o tratamento de restrições e exceções de negócio. O guia prático de execução e organização técnica está documentado em [src/test/README.md](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/README.md):

| Serviço de Negócio | Classe de Teste Unitário | Cenários Cobertos |
| :--- | :--- | :--- |
| `UsuarioService` | [UsuarioServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/UsuarioServiceTest.java) | Restrições de e-mail único, campos vazios, autenticação BCrypt, DTO sem vazamento de hash |
| `BemCulturalService` | [BemCulturalServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/BemCulturalServiceTest.java) | Cadastro, publicação, arquivamento com eventos de auditoria desacoplados |
| `SalvaguardaService` | [SalvaguardaServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/SalvaguardaServiceTest.java) | Validação da Regra RN02 (exclusividade imaterial), obrigatoriedade de plano, listagem |
| `VistoriaService` | [VistoriaServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/VistoriaServiceTest.java) | Criação planejada, bloqueio de homologação prévia, homologação com status REALIZADA |
| `ProtecaoService` | [ProtecaoServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/ProtecaoServiceTest.java) | Abertura de processo, homologação de tombamento, transição do bem para TOMBADO |
| `DocumentoService` | [DocumentoServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/DocumentoServiceTest.java) | Gestão documental, integração com StorageService, cálculo de SHA-256 e download |
| `EventoBemService` | [EventoBemServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/EventoBemServiceTest.java) | Linha do tempo de intervenções, incidentes e restauros com integridade referencial |
| `ProcessoJudicialService`| [ProcessoJudicialServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/ProcessoJudicialServiceTest.java) | Cadastro judicial, unicidade do número CNJ do processo, listagem geral |
| `AuditoriaService` | [AuditoriaServiceTest](file:///home/josue/Área%20de%20trabalho/SisTomPatrimonio/src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/AuditoriaServiceTest.java) | Consulta paginada por entidade, mapeamento DTO, suporte a ações de sistema |

---

## Diretrizes de Engenharia Aplicadas

1. **Rastreabilidade Bidirecional**: Todo endpoint ou serviço no código rastreia um Requisito Funcional (RF), uma Regra de Negócio (RN) e uma Decisão de Arquitetura (ADR).
2. **Diagramas como Código (Mermaid)**: Todos os diagramas são mantidos em texto puro Markdown via Mermaid, garantindo renderização visual nativa no GitHub/IDE e versionamento preciso no Git (`git diff`).
3. **Fonte da Verdade de Dados**: O modelo relacional e espacial é estritamente baseado no `dbdiagram` oficial acordado com o comitê técnico/acadêmico.

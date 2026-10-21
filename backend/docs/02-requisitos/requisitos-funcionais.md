# Requisitos Funcionais (RF) — SIP-MA

Os Requisitos Funcionais descrevem os comportamentos, fluxos de informação e serviços que o sistema **SIP-MA** deve fornecer aos seus usuários e sistemas integrados.

---

## Matriz de Requisitos Funcionais

| Identificador | Nome do Requisito | Prioridade | Perfil Mínimo | Entidades Principais |
| :---: | :--- | :---: | :---: | :--- |
| **RF01** | Cadastro de Organizações Responsáveis | Essencial | `ADMIN` | `organizacao` |
| **RF02** | Gestão e Autenticação de Usuários | Essencial | `ADMIN` / Público | `usuario` |
| **RF03** | Cadastro e Gestão do Bem Cultural | Essencial | `TECNICO` | `bem_cultural` |
| **RF04** | Georreferenciamento e Consulta por Proximidade | Essencial | `TECNICO` / `LEITOR` | `localizacao_bem`, `municipio` |
| **RF05** | Isolamento de Coordenadas Arqueológicas | Essencial | `TECNICO` / `ADMIN` | `localizacao_arqueologica_restrita` |
| **RF06** | Registro de Processo de Tombamento e Livro de Tombo | Essencial | `TECNICO` / `ADMIN` | `protecao`, `bem_cultural` |
| **RF07** | Agendamento e Registro de Vistoria Técnica | Importante | `TECNICO` | `vistoria`, `bem_cultural` |
| **RF08** | Homologação Pericial de Vistoria | Importante | `ADMIN` / Chefe Técnico | `vistoria`, `usuario` |
| **RF09** | Gestão de Documentos com Integridade SHA-256 | Importante | `TECNICO` | `documento` |
| **RF10** | Registro da Linha do Tempo do Bem (Eventos) | Desejável | `TECNICO` | `evento_bem` |
| **RF11** | Gestão de Planos de Salvaguarda Imaterial | Importante | `TECNICO` | `salvaguarda` |
| **RF12** | Vinculação e Acompanhamento de Ações Judiciais | Desejável | `JURIDICO` | `processo_judicial`, `processo_bem` |
| **RF13** | Registro e Consulta de Trilha de Auditoria | Essencial | Sistema / `ADMIN` | `auditoria` |

---

## Detalhamento dos Requisitos

### RF01 — Cadastro de Organizações Responsáveis
* **Descrição**: O sistema deve permitir o cadastro de órgãos governamentais (SECMA, IPHAN, Prefeituras) e instituições culturais privadas/mistas.
* **Entradas**: Nome, sigla, tipo, esfera (`FEDERAL`, `ESTADUAL`, `MUNICIPAL`, `PRIVADA`), CNPJ (único), e-mail e telefone.
* **Saídas**: Identificador UUID único gerado e status ativo.

### RF02 — Gestão e Autenticação de Usuários
* **Descrição**: O sistema deve permitir o cadastro de servidores e peritos, atribuindo perfil RBAC (`ADMIN`, `TECNICO`, `CONSULTOR`, `LEITOR`, `JURIDICO`).
* **Segurança**: Senhas devem ser armazenadas com hash BCrypt irreversível. Suporte a flag declarativa de 2FA.

### RF03 — Cadastro e Gestão do Bem Cultural
* **Descrição**: O sistema deve cadastrar e atualizar bens culturais das três naturezas: `MATERIAL_EDIFICADO`, `IMATERIAL` e `ARQUEOLOGICO`.
* **Comportamento**:
  * Para bens materiais: registrar tipologia arquitetônica, uso, áreas, número de pavimentos, estrutura e cobertura.
  * Para bens imateriais: registrar categoria, periodicidade, contexto da prática e riscos de continuidade.
  * Para sítios arqueológicos: registrar tipo de sítio, período cultural e regime de acesso.
  * Suportar dados específicos adicionais via coluna semi-estruturada `dados_especificos JSONB`.
  * Todo bem cultural inicia obrigatoriamente no status `RASCUNHO`.

### RF04 — Georreferenciamento e Consulta por Proximidade
* **Descrição**: O sistema deve associar endereços e geometrias espaciais (`Point`, `Polygon`) no sistema de referência WGS 84 (`EPSG:4326`) a um bem.
* **Busca Espacial**: O sistema deve disponibilizar endpoint para busca de bens culturais em um raio de proximidade (metros) a partir de uma coordenada (latitude/longitude), utilizando o índice PostGIS `ST_DWithin`.

### RF05 — Isolamento de Coordenadas Arqueológicas Restritas
* **Descrição**: Sítios arqueológicos com coordenadas sensíveis devem ter seus dados espaciais exatos segregados na tabela `localizacao_arqueologica_restrita`, vinculada 1:1 ao bem.
* **Restrição de Acesso**: Coordenadas exatas só podem ser consultadas por usuários com perfil `TECNICO` ou `ADMIN`. Consultas públicas ou de perfis comuns devem receber apenas o polígono de amortecimento (`buffer_protecao`) ou mensagem de restrição.

### RF06 — Registro de Processo de Tombamento e Livro de Tombo
* **Descrição**: O sistema deve registrar o processo formal de proteção e tombamento: número do processo, esfera, fase (`EM_ESTUDO`, `EM_INSTRUCAO`, `PROVISORIO`, `HOMOLOGADO`, `INDEFERIDO`, `REVOGADO`), tipo de proteção (`TOMBAMENTO`, `REGISTRO`, `VALORACAO`), ato normativo (decreto/portaria), Livro de Tombo, folha e número de inscrição.
* **Transição**: Quando um processo de tombamento for marcado como `HOMOLOGADO`, o bem cultural associado deve transitar para o status `PUBLICADO`.

### RF07 — Agendamento e Registro de Vistoria Técnica
* **Descrição**: O sistema deve agendar e registrar vistorias técnicas preventivas, permitindo informar a equipe técnica pericial (`JSONB`) e o catálogo de anomalias/patologias detectadas (`JSONB` contendo tipo, severidade e descrição).

### RF08 — Homologação Pericial de Vistoria
* **Descrição**: O sistema deve permitir a homologação formal de uma vistoria realizada, registrando o carimbo digital: `homologada = true`, identificador do responsável pela homologação (`homologada_por`) e data/hora (`homologada_em`).

### RF09 — Gestão de Documentos com Integridade SHA-256
* **Descrição**: O sistema deve permitir associar documentos (dossiês, laudos, fotografias, mapas) de forma polimórfica a um bem, vistoria, processo judicial ou processo de proteção.
* **Estratégia Zero-Bytea**: O arquivo binário é armazenado no storage externo; o banco persiste apenas o `storage_key`, MIME type, tamanho em bytes e o hash criptográfico SHA-256 para verificação de integridade contra adulteração.

### RF10 — Registro da Linha do Tempo do Bem (Eventos)
* **Descrição**: O sistema deve manter a cronologia histórica de intervenções e marcos do bem cultural (construção, tombamento, restaurações, mudanças de uso e reformas).

### RF11 — Gestão de Planos de Salvaguarda Imaterial
* **Descrição**: O sistema deve registrar planos de apoio e preservação de bens imateriais, incluindo título, versão, vigência, orçamento e vetor de ações/metas em formato `JSONB`. O sistema deve rejeitar planos de salvaguarda vinculados a bens de natureza diferente de `IMATERIAL`.

### RF12 — Vinculação e Acompanhamento de Ações Judiciais
* **Descrição**: O sistema deve cadastrar ações judiciais de proteção ao patrimônio (número único CNJ, tribunal, vara, valor da causa) e permitir a vinculação N:N com bens afetados através da associação `processo_bem`, registrando o papel do bem (`REU_EMBARGADO`, `OBJETO_DANO`, etc.).

### RF13 — Registro e Consulta de Trilha de Auditoria
* **Descrição**: Toda mutação transacional (criação, edição, revogação) deve ser registrada de forma imutável na tabela `auditoria`, armazenando snapshots `dados_anteriores JSONB` e `dados_novos JSONB`, usuário responsável e correlation ID.

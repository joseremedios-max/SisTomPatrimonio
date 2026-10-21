# 09 - Manual de Homologação Full-Stack, Perfis RBAC e Módulos Operacionais (SIP-MA)

Este documento consolida todas as implementações, regras de controle de acesso baseado em papéis (**RBAC**), dados homologados no PostgreSQL/PostGIS e roteiros de verificação de ponta a ponta (Frontend + Backend + Banco de Dados) do **SIP-MA**.

---

## 1. Perfis de Acesso (RBAC) e Credenciais de Homologação

No perfil de desenvolvimento (`SPRING_PROFILES_ACTIVE=dev`), a classe [`DevAdminInitializer.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/config/DevAdminInitializer.java) garante automaticamente a criação e ativação dos **5 perfis institucionais** no banco de dados PostgreSQL:

| Perfil | Nome Institucional | E-mail | Senha | Escopo de Atuação |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | Administrador Geral SECMA | `admin@local.test` | `Admin@12345` | Governança total do sistema, gestão de usuários, configurações globais e acesso irrestrito a todos os módulos. |
| **`TECNICO`** | Perito Técnico IPHAN/SECMA | `tecnico@local.test` | `Tecnico@12345` | Corpo técnico responsável por cadastro wizard de bens, tombamento e proteção, planos de salvaguarda, vistorias, documentos e auditoria. |
| **`JURIDICO`** | Procurador Jurídico PGE/SECMA | `juridico@local.test` | `Juridico@12345` | Procuradoria jurídica focada em processos judiciais (padrão CNJ), movimentações, embargos, MPMA e dossiês probatórios. |
| **`CONSULTOR`** | Consultor Patrimonial Credenciado | `consultor@local.test` | `Consultor@12345` | Parecerista/consultor externo credenciado para vistorias técnicas (inclusive modo offline PWA), consulta de bens, geoprocessamento e anexos. |
| **`LEITOR`** | Auditor / Consulta Interna | `leitor@local.test` | `Leitor@12345` | Perfil estritamente consultivo para visualização do Dashboard, Bens Culturais, Risco, Georreferenciamento e Relatórios. |

---

## 2. Matriz de Permissões (Frontend + Backend Spring Security)

A segregação de funções ocorre em **três camadas simultâneas**:
1. **Menu Lateral Dinâmico ([`AdminLayout.tsx`](../../src/layout/AdminLayout.tsx)):** Oculta links não permitidos ao perfil autenticado.
2. **Guardas de Rota React ([`AppRoutes.tsx`](../../src/routes/AppRoutes.tsx) & [`ProtectedRoute.tsx`](../../src/routes/ProtectedRoute.tsx)):** Bloqueia navegação direta via URL, exibindo tela de *Acesso Restrito ao Perfil*.
3. **Filtro de Segurança JWT ([`SecurityConfig.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/config/SecurityConfig.java)):** Rejeita chamadas HTTP não autorizadas com **`403 Forbidden`**.

| Módulo / Funcionalidade | Rota Frontend | Endpoint Principal Backend | `ADMIN` | `TECNICO` | `JURIDICO` | `CONSULTOR` | `LEITOR` |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard Executivo** | `/admin/dashboard` | `GET /api/v1/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bens Culturais (Listagem)** | `/admin/bens` | `GET /api/v1/bens-culturais` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Wizard Novo Bem Cultural** | `/admin/bens/novo` | `POST /api/v1/bens-culturais` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Tombamento e Proteção** | `/admin/protecao` | `/api/v1/protecoes/**` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Planos de Salvaguarda** | `/admin/salvaguarda` | `/api/v1/salvaguardas/**` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Vistorias e Fiscalização** | `/admin/vistorias` | `/api/v1/vistorias/**` | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Módulo Jurídico (CNJ)** | `/admin/processos` | `/api/v1/processos-judiciais/**` | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Documentos e Mídias** | `/admin/documentos` | `/api/v1/documentos/**` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Risco e Conservação** | `/admin/risco` | `GET /api/v1/bens-culturais` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Georreferenciamento GIS** | `/admin/georreferenciamento` | `/api/v1/territorial/**` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Relatórios e Indicadores** | `/admin/relatorios` | `/api/v1/relatorios/**` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Trilha de Auditoria** | `/admin/auditoria` | `/api/v1/auditorias/**` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Gestão de Usuários** | `/admin/usuarios` | `/api/v1/administracao/usuarios` | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Configurações do Sistema** | `/admin/configuracoes` | `/api/v1/configuracoes/**` | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Detalhamento dos Módulos Homologados e Melhorias Implementadas

### 3.1. Ouvidoria Cidadã e Triagem Técnica (`Reportar Inconsistência`)
- **Arquivos Envolvidos:**
  - Frontend: [`src/pages/public/ReportarInconsistenciaPage.tsx`](../../src/pages/public/ReportarInconsistenciaPage.tsx)
  - Backend: [`RelatoInconsistenciaController.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/RelatoInconsistenciaController.java), [`RelatoInconsistenciaDTO.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/dtos/RelatoInconsistenciaDTO.java), [`SecurityConfig.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/config/SecurityConfig.java)
- **Funcionalidades Implementadas:**
  - **Acesso Público Sem Login:** Cidadãos podem registrar relatos (`POST /api/v1/cadastros/relatos-inconsistencia`) e consultar os protocolos abertos (`GET /api/v1/cadastros/relatos-inconsistencia`).
  - **Resolução Híbrida de Identificador:** O backend localiza o bem cultural tanto pelo **UUID** quanto pelo **Código Institucional** (ex.: `DEV-MAT-001`, `DEV-IMA-001`, `DEV-ARQ-001`), além de oferecer um seletor populado automaticamente com o acervo público.
  - **Triagem Técnica Protegida por RBAC:** Quando autenticado como `ADMIN` ou `TECNICO`, cada protocolo exibe botões de ação rápida (**"Marcar Em Análise"** e **"Marcar Resolvido"**) via `PATCH /api/v1/cadastros/relatos-inconsistencia/{id}/status`.

### 3.2. Tombamento e Proteção (`/admin/protecao`)
- **Arquivos Envolvidos:**
  - Frontend: [`src/pages/admin/ProtecaoPage.tsx`](../../src/pages/admin/ProtecaoPage.tsx)
  - Backend: [`ProtecaoController.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/ProtecaoController.java), [`ProtecaoService.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/ProtecaoService.java)
- **Funcionalidades Implementadas:**
  - Consulta dinâmica de processos de proteção por Bem Cultural (`GET /api/v1/protecoes/bem/{bemId}`).
  - Formulário completo para **Registrar Ato ou Processo de Proteção** (`POST /api/v1/protecoes`) com Número do Processo, Esfera (`ESTADUAL`, `FEDERAL`, `MUNICIPAL`, `INTERNACIONAL`), Tipo de Proteção (`TOMBAMENTO`, `REGISTRO`, `VALORACAO`), Fase Processual (`EM_ESTUDO`, `EM_INSTRUCAO`, `PROVISORIO`, `HOMOLOGADO`), Ato Normativo, Livro do Tombo e Número de Inscrição.
  - **Regra Automática de Tombamento:** Quando um processo é registrado ou homologado na fase `HOMOLOGADO`, o domínio executa `bem.tombar()` automaticamente e publica evento na trilha de auditoria.
  - **Processos Homologados no Banco:**
    - `PROC-TOMB-2026/00142-SECMA` (`DEV-MAT-001 — Centro Histórico de São Luís`, `HOMOLOGADO`)
    - `PROC-ACAUT-2026/00215-IPHAN` (`DEV-ARQ-001 — Sítio Arqueológico Experimental`, `EM_INSTRUCAO`)
    - `PROC-REG-2026/00088-SECMA` (`DEV-IMA-001 — Tambor de Crioula do Maranhão`, `HOMOLOGADO`)

### 3.3. Planos de Salvaguarda (`/admin/salvaguarda`)
- **Arquivos Envolvidos:**
  - Frontend: [`src/pages/admin/SalvaguardaPage.tsx`](../../src/pages/admin/SalvaguardaPage.tsx)
  - Backend: [`SalvaguardaController.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/SalvaguardaController.java), [`SalvaguardaService.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/SalvaguardaService.java)
- **Funcionalidades Implementadas:**
  - Seletor de Bens Culturais com pré-seleção automática de bens de natureza **`IMATERIAL`** (`DEV-IMA-001 — Tambor de Crioula do Maranhão`) e carregamento imediato dos planos vinculados (`GET /api/v1/salvaguardas/bem/{bemId}`).
  - Formulário para **Cadastrar Novo Plano de Salvaguarda** (`POST /api/v1/salvaguardas`) informando Plano de Ação/Metas, Status (`PLANEJADO`, `ATIVO`, `CONCLUIDO`, `CANCELADO`), Início da Vigência e Previsão de Fim.
  - **Validação da Regra de Negócio RN02:** Caso o usuário selecione um bem de natureza `MATERIAL_EDIFICADO` ou `ARQUEOLOGICO` e tente registrar um plano, o backend rejeita a operação com a mensagem: *"Planos de salvaguarda destinam-se exclusivamente a bens de natureza IMATERIAL."*

### 3.4. Vistorias Técnicas e Fiscalização (`/admin/vistorias`)
- **Arquivos Envolvidos:** [`src/pages/admin/VistoriasPage.tsx`](../../src/pages/admin/VistoriasPage.tsx), [`VistoriaController.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/VistoriaController.java)
- **Funcionalidades Homologadas:**
  - Listagem e cadastro de vistorias técnicas (`VIS-2026-001`, `VIS-2026-002`) com índice de conservação, grau de risco e patologias estruturais.
  - **Fila Offline PWA (`IndexedDB`):** Quando sem conexão, o laudo é salvo localmente em `offline_laudos` e sincronizado automaticamente ao restabelecer a rede.

### 3.5. Módulo Jurídico (`/admin/processos`)
- **Arquivos Envolvidos:** [`src/pages/admin/ModuloJuridicoPage.tsx`](../../src/pages/admin/ModuloJuridicoPage.tsx), [`ProcessoJudicialController.java`](../../../backend/src/main/java/br/com/SisTomPatrimonio/SisTomPatrimonio/controllers/ProcessoJudicialController.java)
- **Funcionalidades Homologadas:**
  - Cadastro de processos judiciais com validação estrita da numeração única **CNJ** (`0801234-55.2026.8.10.0001`), vara/comarca, nível de sigilo (`PUBLICO`, `RESTRITO`, `SEGREDO_JUSTICA`) e linha do tempo de movimentações processuais.

### 3.6. Documentos e Mídias (`/admin/documentos`) e Configurações (`/admin/configuracoes`)
- **Documentos e Mídias:** Upload multipart com cálculo local de checksum **SHA-256** via Web Crypto API, conferência síncrona no servidor e varredura assíncrona via **ClamAV (`zINSTREAM`)** / motor EICAR (`AntivirusScannerService.java`), bloqueando downloads de arquivos `REJEITADO`.
- **Configurações e Usuários:** Gestão de parâmetros administrativos (`ConfiguracaoAdministrativaController.java`) e administração de contas e status ativo/inativo (`AdministracaoUsuarioController.java`) exclusivos para o perfil `ADMIN`.


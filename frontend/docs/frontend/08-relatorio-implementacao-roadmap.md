# 08 - Relatório Técnico de Implementação do Roadmap (SIP-MA)

Este documento detalha todas as alterações arquiteturais, de segurança, resiliência offline, geoprocessamento e qualidade implementadas para concluir integralmente o Roadmap Técnico do **SIP-MA (Sistema de Informação do Patrimônio - Maranhão)**.

---

## 1️⃣ Etapa 1: Segurança e Hardening (Backend & Frontend)

### 1.1. Migração de Sessão para Cookie `HttpOnly` (`SameSite=Strict`) + Access Token em Memória
- **Problema Mitigado:** O armazenamento de tokens JWT no `localStorage` (`sipma_token`) expunha a sessão a riscos de leitura em cenários de Cross-Site Scripting (XSS).
- **Alterações no Backend (Spring Boot 3):**
  - **`JwtService.java`:** Adicionados suporte a *Access Token* de curta duração (`PT15M`, claim `type=access`) e *Refresh Token* de longa duração (`PT8H`, claim `type=refresh`), além dos métodos `gerarRefreshToken(Usuario)`, `isRefreshToken(Claims)` e `getRefreshExpirationSeconds()`.
  - **`UsuarioResponseDTO.java`:** Adicionados campos internos `@JsonIgnore refreshToken` e `@JsonIgnore refreshExpiresIn` para transporte entre camadas sem expor o Refresh Token no corpo JSON da resposta.
  - **`UsuarioService.java`:** Implementado o método `renovarSessao(String refreshToken)` que valida a assinatura e o tipo do Refresh Token, verifica se o usuário permanece ativo no banco e emite novos tokens.
  - **`UsuarioController.java`:**
    - `POST /api/usuarios/autenticar`: Emite o cabeçalho `Set-Cookie` com `sipma_refresh_token` configurado com `HttpOnly=true`, `SameSite=Strict`, `Path=/api/usuarios` e `Max-Age=28800`.
    - `POST /api/usuarios/refresh`: Lê o cookie `sipma_refresh_token` (`@CookieValue`), renova a sessão e rotaciona o cookie.
    - `POST /api/usuarios/logout`: Expira imediatamente o cookie `sipma_refresh_token` (`Max-Age=0`).
  - **`SecurityConfig.java`:** Liberadas as rotas `/api/usuarios/refresh` e `/api/usuarios/logout` no `SecurityFilterChain`.
- **Alterações no Frontend (React / TypeScript):**
  - **`src/services/api.ts`:** Substituída a leitura de `localStorage.getItem('sipma_token')` pela variável encapsulada em memória `inMemoryAccessToken` (`setAccessToken` / `getAccessToken`). Adicionado interceptor de resposta que realiza *silent refresh* automático via `POST /usuarios/refresh` ao receber `HTTP 401` e repete a requisição original.
  - **`src/context/AuthContext.tsx`:** Removida qualquer gravação de JWT no `localStorage`, mantendo o token estritamente em memória (React State + RAM) e restaurando a sessão silenciosamente ao recarregar a página.

### 1.2. Varredura Antivírus Assíncrona (ClamAV) na Esteira de Upload
- **Alterações no Backend:**
  - **`AsyncConfig.java`:** Habilitado o processamento assíncrono do Spring (`@EnableAsync`).
  - **`AntivirusScannerService.java`:** Serviço de inspeção antivírus que se comunica via socket TCP com o daemon **ClamAV (`clamd`)** utilizando o comando `zINSTREAM\0` em chunks de 2 KB, além de motor local determinístico para detecção imediata da assinatura padrão `EICAR-STANDARD-ANTIVIRUS-TEST-FILE`.
  - **`DocumentoService.java`:**
    - Integrada a chamada assíncrona `antivirusScannerService.escanearDocumentoAssincrono(salvo.getId(), conteudo)` em `salvarDocumento` e `armazenarEDocumentar`.
    - Caso uma ameaça seja detectada, o documento recebe `statusValidacao = REJEITADO`, `publicacaoAutorizada = false` e registro detalhado em `metadados` (`antivirusStatus: INFECTED`, `antivirusAssinatura`).
    - No método `baixarArquivo(UUID documentoId)`, adicionado bloqueio explícito (`RegraNegocioRunTime`) impedindo o download de documentos com status `REJEITADO`.

---

## 2️⃣ Etapa 2: Resiliência e Operação Offline (Frontend)

### 2.1. Persistência Local `IndexedDB` no Wizard de 10 Etapas
- **`src/utils/offlineDb.ts`:** Criada camada de persistência local no navegador sobre a API nativa `window.indexedDB` (banco `sipma_offline_db`, stores `wizard_drafts` e `offline_laudos`), com fallback em memória para ambientes de teste (Vitest/Node).
- **`src/pages/admin/BemCulturalWizardPage.tsx`:**
  - Restauração automática do rascunho em andamento (`carregarRascunhoWizard`) ao abrir o assistente.
  - Auto-save com *debounce* de `300ms` (`salvarRascunhoWizard`) em todas as 10 etapas, exibindo indicador visual de rascunho salvo e botão **"Limpar rascunho"**.
  - Limpeza automática do banco local (`limparRascunhoWizard`) após a conclusão do cadastro na API.

### 2.2. Configuração de PWA e Fila Offline para Vistorias em Campo
- **`public/manifest.webmanifest` & `index.html`:** Manifesto Web App institucional configurado com `display: standalone`, cores institucionais (`#123b2a`) e ícones vetoriais.
- **`public/sw.js` & `src/utils/pwaRegistration.ts`:** Service Worker com estratégia *Network-First com Cache Fallback* para rotas `/api/*` e *Stale-While-Revalidate* para a interface estática.
- **`src/pages/admin/VistoriasPage.tsx`:**
  - Monitoramento em tempo real do estado de rede (`online` / `offline`).
  - Gravação automática de laudos técnicos e matrizes de patologias na fila `IndexedDB` (`enfileirarLaudoOffline`) quando o perito está sem internet em campo.
  - Sincronização automática (`sincronizarLaudosPendentes`) assim que a conectividade é restabelecida ou por acionamento manual.

---

## 3️⃣ Etapa 3: Geoprocessamento Avançado (Frontend)

- **`src/utils/geojsonUtils.ts`:**
  - Implementado algoritmo de clusterização espacial adaptativa `clusterizarMarcadores(markers, zoom)` que agrupa bens culturais próximos em células espaciais quando `zoom < 16` e calcula o centroide de cada agrupamento.
  - Implementado conversor `converterVerticesParaGeoJsonPolygon(verticesLatLng)` que gera polígonos GeoJSON fechados no padrão PostGIS (`[longitude, latitude]`).
- **`src/components/map/LeafletClusters.tsx`:** Renderização dinâmica de clusters com contadores visuais e *zoom-to-cluster* ao clicar, desagrupando em marcadores individuais nos níveis de zoom elevados.
- **`src/components/map/GeoJsonLayer.tsx`:** Camada interativa para renderização e desenho ponto-a-ponto de poligonais de tombamento sobre o mapa.
- **`src/components/map/MapContainer.tsx`:** Barra de controle integrada permitindo alternar entre **Mapa Vetorial (OSM)** e **Imagem de Satélite (Esri World Imagery)**, além de ativar a ferramenta **"Desenhar Polígono de Tombamento"**.
- **`HomeMapPage.tsx` & `GeorreferenciamentoPage.tsx`:** Integradas ao novo `MapContainer` com clusterização, alternância de basemaps e exportação do polígono GeoJSON desenhado.

---

## 4️⃣ Etapa 4: Qualidade, Infraestrutura e Acessibilidade WCAG 2.1 AA

### 4.1. Ajustes de Acessibilidade WCAG 2.1 AA no Portal Público
- **`PublicLayout.tsx`, `Header.tsx`, `Footer.tsx`:** Adicionados link de salto rápido (*"Pular para o conteúdo principal"*), landmarks semânticos (`banner`, `navigation`, `main`, `contentinfo`), contraste reforçado e anéis de foco visíveis (`focus:ring-2`).
- **`AcervoPublicoPage.tsx`, `FichaPublicaPage.tsx`, `ReportarInconsistenciaPage.tsx`:** Associados `<label htmlFor="...">` explícitos a todos os campos de formulário, descrições auxiliares via `aria-describedby`, listas de definição (`<dl>/<dt>/<dd>`) na ficha pública e regiões `aria-live="polite"` / `role="alert"`.

### 4.2. Testes Automatizados (Unitários + E2E) e Pipeline CI/CD
- **Testes Backend (`./mvnw clean test`):** Adicionados `AntivirusScannerServiceTest` e novos cenários em `JwtServiceTest` e `UsuarioControllerTest`, totalizando **77 testes automatizados com 100% de aprovação**.
- **Testes Frontend (`npm test` & `npm run e2e`):** Adicionados testes unitários em `geojsonUtils.test.ts` e `offlineDb.test.ts` (7 testes Vitest passando) e suíte E2E Cypress em `cypress/e2e/fluxos-sipma.cy.ts` cobrindo os fluxos completos do cidadão e do perito.
- **CI/CD (`.github/workflows/ci.yml`):** Pipeline GitHub Actions configurado com jobs para Backend (JDK 17 + Maven Test) e Frontend (Node 22 + Oxlint + Vitest + Vite Build).

---

## 5️⃣ Etapa 5: Homologação Full-Stack, Perfis RBAC e Módulos Operacionais

- **Segregação RBAC de 5 Perfis (`ADMIN`, `TECNICO`, `JURIDICO`, `CONSULTOR`, `LEITOR`):**
  - Sincronização automática das 5 contas de homologação em `DevAdminInitializer.java`.
  - Filtragem dinâmica da barra lateral em `AdminLayout.tsx`, guardas por perfil em `AppRoutes.tsx` / `ProtectedRoute.tsx` e validação de papéis no `SecurityConfig.java` (`403 Forbidden`).
- **Ouvidoria Cidadã e Triagem Técnica (`ReportarInconsistenciaPage.tsx` & `RelatoInconsistenciaController.java`):**
  - Envio e listagem pública em `/api/v1/cadastros/relatos-inconsistencia`, aceitando tanto **UUID** quanto **Código Institucional** (`DEV-MAT-001`, `DEV-IMA-001`, `DEV-ARQ-001`) com seletor integrado do acervo público.
  - Triagem de status (`ABERTO`, `EM_ANALISE`, `RESOLVIDO`) protegida para os perfis `ADMIN` e `TECNICO`.
- **Tombamento e Proteção (`ProtecaoPage.tsx`):**
  - Consulta de processos vinculados por Bem Cultural e formulário completo para registro de novos atos/processos (`POST /api/v1/protecoes`), com homologação automática do tombamento quando a fase é `HOMOLOGADO`.
- **Planos de Salvaguarda (`SalvaguardaPage.tsx`):**
  - Seletor inteligente com destaque para bens de natureza `IMATERIAL`, formulário de cadastro de planos (`POST /api/v1/salvaguardas`) e validação em tempo real da **Regra de Negócio RN02** (*exclusividade de planos de salvaguarda para bens imateriais*).
- **Documentação Detalhada de Homologação:** Consulte [`09-manual-homologacao-modulos-e-rbac.md`](./09-manual-homologacao-modulos-e-rbac.md).


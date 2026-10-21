# 06 - Qualidade, Testes (Unitários + E2E), CI/CD e Acessibilidade WCAG 2.1 AA

## 📏 Padrões de Código e Linting

O projeto utiliza **Oxlint** e **TypeScript estrito** (`strict: true`, `verbatimModuleSyntax: true`, `erasableSyntaxOnly: true`):
- Proibição de sintaxes ambíguas e exigência de `import type` para contratos de tipos.
- Nomeação em *PascalCase* para componentes e *camelCase* para hooks e utilitários.

---

## 🧪 Suíte de Testes Unitários (Vitest) e End-to-End (Cypress)

### 1. Testes Unitários (`npm test`):
- **`formatters.test.ts`:** Formatação de datas, moedas e identificadores patrimoniais.
- **`geojsonUtils.test.ts`:** Normalização de coordenadas, clusterização espacial adaptativa por zoom (`clusterizarMarcadores`) e fechamento topológico de polígonos GeoJSON (`converterVerticesParaGeoJsonPolygon`).
- **`offlineDb.test.ts`:** Persistência e limpeza de rascunhos do Wizard em 10 etapas e fila de sincronização de laudos de vistoria offline.

### 2. Testes End-to-End (`cypress/e2e/fluxos-sipma.cy.ts` — `npm run e2e`):
- **Fluxo do Cidadão:** Navegação pelo Mapa Público com alternância de *basemap*, verificação do *skip-link* WCAG 2.1 AA, consulta ao Acervo Público e submissão de Relato de Inconsistência.
- **Fluxo do Perito:** Login técnico validando emissão de Cookie `HttpOnly` e garantindo que nenhum token JWT seja gravado no `localStorage`.

---

## ♿ Conformidade de Acessibilidade WCAG 2.1 AA (Portal Público)

- **Skip Navigation Link (`PublicLayout.tsx`):** Link *"Pular para o conteúdo principal"* visível ao foco do teclado (`sr-only focus:not-sr-only`) apontando para `<main id="conteudo-principal" tabIndex={-1}>`.
- **Landmarks Semânticos:** `role="banner"` no cabeçalho, `<nav aria-label="Navegação principal">`, `<main>` e `role="contentinfo"` no rodapé.
- **Formulários e Feedback Acessíveis:** Todos os campos possuem `<label htmlFor="...">` explícitos, instruções vinculadas via `aria-describedby` e mensagens dinâmicas com `role="status"` / `role="alert"` e `aria-live="polite"`.

---

## ⚙️ Pipeline CI/CD Automatizado (`.github/workflows/ci.yml`)

O workflow do GitHub Actions executa dois jobs independentes a cada *push* ou *Pull Request* nas branches `main` e `develop`:
1. **`backend-test-and-build`:** Configura JDK 17 (Temurin) e executa `./mvnw clean test` (77 testes automatizados com JUnit 5, Mockito, MockMvc e H2 Spatial).
2. **`frontend-lint-test-and-build`:** Configura Node.js 22 e executa `npm ci`, `npm run lint` (Oxlint), `npm test` (Vitest) e `npm run build` (TypeScript + Vite).

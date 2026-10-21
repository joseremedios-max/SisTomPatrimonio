# Runtime Validation Report

**Generated**: 2026-10-15T16:56:00-03:00  
**Target**: `SisTomPatrimonio` + `SisTomPatrimonio-web`

## Summary

| Step | Status | Exit Code | Details |
|------|--------|-----------|---------|
| Infrastructure | PASS | 0 | Docker Desktop disponível; PostgreSQL/PostGIS saudável em `localhost:5432` |
| Backend tests | PASS | 0 | Maven: 73 testes, 0 falhas, 0 erros, 0 ignorados |
| Frontend tests | PASS | 0 | Vitest: 2 arquivos, 3 testes aprovados |
| Frontend build | PASS | 0 | TypeScript e Vite concluídos |
| Backend startup | PASS | n/a | Spring Boot iniciado em 7,466 s; `/actuator/health` retornou HTTP 200 |
| Frontend startup | PASS | n/a | Vite disponível em `http://localhost:5173` |
| API/proxy integration | PASS | 0 | Proxy Vite → backend retornou HTTP 200 para bens públicos |
| Browser flow | PARTIAL | 0 | Página pública e login renderizados; credencial inválida exibiu erro esperado |

**Overall**: PASS WITH GAPS

## Environment

```text
docker: AVAILABLE — Docker Desktop 29.7.2; daemon funcional
node: AVAILABLE — v24.21.0
npm: AVAILABLE — 11.19.0
playwright: AVAILABLE — Chromium installation command exited with code 0
infra-tier: PRIMARY(Docker-based) — postgis/postgis:14-3.3-alpine healthy
browser-tier: PRIMARY(Playwright) — browser flow executed against Vite
```

## Commands and Evidence

- `docker compose up -d` — PASS; `postgres_spatial_sipma` healthy.
- `.\mvnw.cmd test` — PASS; 73/73 tests.
- `npm test -- --run` — PASS; 3/3 tests.
- `npm run build` — PASS; `tsc -b` and `vite build`.
- `.\mvnw.cmd spring-boot:run` with `SPRING_PROFILES_ACTIVE=dev` — PASS.
- `npm run dev -- --host 127.0.0.1` — PASS; Vite on port 5173.
- `npx playwright install chromium` — PASS; exit code 0.

## Runtime Checks

| Flow | Result |
|------|--------|
| Public home page → load public collection | PASS; UI rendered `0 bens disponíveis no mapa público` from the API |
| Vite proxy → `GET /api/v1/bens-culturais/publicos` | PASS; HTTP 200 with empty page |
| Public API → `GET /api/v1/public/mapa-bens` | PASS; HTTP 200 with empty GeoJSON FeatureCollection |
| Protected API without token → `GET /api/v1/dashboard/alertas` | PASS; HTTP 403 |
| Admin login with unknown user | PASS; HTTP 422 and `Usuário não encontrado ou inativo.` rendered |

## Known Gaps

1. The local database has no seed records, so public collections and the map are empty.
2. No active user credentials were available, so the successful login, protected CRUD persistence, and logout flow could not be exercised.
3. Browser validation covered the public journey and authentication failure; a successful authenticated browser journey remains pending seeded local data.

## Verdict

```text
environment:
  docker: AVAILABLE — Docker Desktop 29.7.2; PostgreSQL/PostGIS healthy
  node: AVAILABLE — v24.21.0
  playwright: AVAILABLE — npx playwright install chromium exit_code: 0
  infra-tier: PRIMARY(Docker-based) — PostgreSQL/PostGIS
  browser-tier: PRIMARY(Playwright) — public and login flows exercised
startup: PASS — Spring Boot + Vite ready; backend health HTTP 200
integration: PASS — exit_code: 0; backend 73 passed, frontend 3 passed, 0 failed
e2e: PARTIAL — exit_code: 0; public page and invalid-login flow passed; authenticated persistence flow unavailable
overall: PASS WITH GAPS — local stack is operational; seed data and valid test credentials are still needed for full authenticated coverage
```

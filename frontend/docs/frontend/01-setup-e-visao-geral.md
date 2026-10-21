# 01 - Visão Geral e Setup do Sistema (SIP-MA)

## 📌 Visão Geral do Sistema
O **SIP-MA (Sistema de Informação do Patrimônio - Maranhão)** é a plataforma governamental para inventário, geoprocessamento (PostGIS), fiscalização técnica (com suporte offline PWA), salvaguarda, acompanhamento jurídico (CNJ) e divulgação pública do patrimônio cultural material, imaterial e arqueológico do Estado do Maranhão.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão | Função no Ecossistema |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React + TypeScript** | `19.x` / `5.x` | Interface declarativa com tipagem estrita (`strict: true`) |
| **Frontend** | **Vite** | `8.x` | Servidor de desenvolvimento e bundler de alta performance |
| **Frontend** | **Tailwind CSS** | `3.x` | Design System institucional e acessibilidade WCAG 2.1 AA |
| **Frontend** | **React Router DOM** | `7.x` | Roteamento SPA com guardas RBAC (`ProtectedRoute`) |
| **Frontend** | **Leaflet / PostGIS** | `1.9.x` | Mapa interativo, clusterização espacial e desenho de polígonos GeoJSON |
| **Frontend** | **IndexedDB + PWA** | Nativo | Auto-save do Wizard de 10 etapas e fila offline de vistorias em campo |
| **Backend** | **Java + Spring Boot** | `17` / `3.5.x` | API RESTful corporativa, Spring Security, JPA/Hibernate Spatial |
| **Banco de Dados** | **PostgreSQL + PostGIS** | `15` / `3.3` | Persistência relacional, JSONB e processamento geoespacial (`SRID 4326`) |

---

## 📋 Pré-requisitos de Ambiente

1. **Java JDK**: Versão `17` ou superior (para o Backend Spring Boot).
2. **Docker Desktop**: Para execução do container PostgreSQL + PostGIS (`postgres_spatial_sipma`).
3. **Node.js & npm**: Node `20.x LTS` (ou `18.16+`) e `npm 9+`.

---

## 🚀 Como Rodar Localmente (Full-Stack)

### 1. Subir o Banco de Dados PostgreSQL + PostGIS (Docker)
Execute o comando abaixo para iniciar (ou criar, caso ainda não exista) o container PostGIS na porta `5432`:

```powershell
# Caso o container já exista, apenas inicie:
docker start postgres_spatial_sipma

# Caso seja a primeira execução na máquina, crie o container PostGIS:
docker run -d `
  --name postgres_spatial_sipma `
  -e POSTGRES_DB=sipma_db `
  -e POSTGRES_USER=sipma_admin `
  -e POSTGRES_PASSWORD=sipma_secret_dev `
  -p 5432:5432 `
  postgis/postgis:15-3.3
```

---

### 2. Iniciar o Backend (Spring Boot API — Porta `8080`)
Em um terminal na raiz do projeto, acesse a pasta `backend` e inicie a aplicação com o perfil `dev` ativo (que cria automaticamente os **5 perfis RBAC** e os **bens culturais iniciais** via `DevAdminInitializer` e `DevSampleDataInitializer`):

```powershell
# Windows (PowerShell)
cd backend
$env:SPRING_PROFILES_ACTIVE="dev"
.\mvnw.cmd spring-boot:run
```

```bash
# Linux / macOS (Bash)
cd backend
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

- **API Base URL:** `http://localhost:8080/api`
- **Healthcheck Actuator:** `http://localhost:8080/actuator/health`

---

### 3. Iniciar o Frontend (React + Vite — Porta `5173`)
Em um **segundo terminal**, acesse a pasta `frontend`, instale as dependências e inicie o servidor Vite:

```powershell
# 1. Navegar para a pasta do frontend
cd frontend

# 2. Instalar as dependências (necessário apenas na primeira vez)
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

- **Portal Público (Cidadão):** `http://localhost:5173/`
- **Ouvidoria / Reportar Inconsistência:** `http://localhost:5173/reportar-inconsistencia`
- **Painel Administrativo (Login RBAC):** `http://localhost:5173/admin/login`

---

### 4. Executar Testes Automatizados, Lint e Build

```powershell
# --- BACKEND (na pasta /backend) ---
.\mvnw.cmd clean test          # Executa os 77 testes unitários e de integração

# --- FRONTEND (na pasta /frontend) ---
npm test                       # Executa os testes unitários (Vitest)
npm run lint                   # Executa análise estática ultrarrápida (Oxlint)
npm run build                  # Valida tipagem TypeScript (tsc -b) e gera build de produção
npm run e2e                    # Executa a suíte End-to-End (Cypress)
```

---

## ⚙️ Variáveis de Ambiente do Frontend (`frontend/.env`)

Opcionalmente, crie um arquivo `.env` na pasta `frontend/` para customizar os endpoints:

```env
# URL Base da API REST Spring Boot
VITE_API_URL=http://localhost:8080/api

# Configuração de Camada de Mapas GIS (OpenStreetMap / Esri)
VITE_MAP_TILE_SERVER=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=&copy; SECMA / Governo do Estado do Maranhão
```

---

## 🔐 Credenciais de Homologação (Perfis RBAC - Ambiente `dev`)

Ao iniciar o Backend com `SPRING_PROFILES_ACTIVE=dev`, os **5 perfis institucionais** são criados e sincronizados automaticamente no PostgreSQL (`DevAdminInitializer.java`):

| Perfil | E-mail | Senha | Acessos Principais |
| :--- | :--- | :--- | :--- |
| **`ADMIN`** | `admin@local.test` | `Admin@12345` | Acesso total, Usuários, Configurações e todos os módulos |
| **`TECNICO`** | `tecnico@local.test` | `Tecnico@12345` | Wizard de Bens, Tombamento e Proteção, Salvaguarda, Vistorias, Documentos e Auditoria |
| **`JURIDICO`** | `juridico@local.test` | `Juridico@12345` | Módulo Jurídico (Processos CNJ, Movimentações, Sigilo) e Documentos |
| **`CONSULTOR`** | `consultor@local.test` | `Consultor@12345` | Vistorias Técnicas (incluindo fila offline PWA), Bens, Mapa GIS e Documentos |
| **`LEITOR`** | `leitor@local.test` | `Leitor@12345` | Consulta Interna (Dashboard, Bens Culturais, Risco, Mapa e Relatórios) |

> Para o roteiro detalhado de testes de cada módulo e matriz completa de permissões RBAC, consulte [`09-manual-homologacao-modulos-e-rbac.md`](./09-manual-homologacao-modulos-e-rbac.md).

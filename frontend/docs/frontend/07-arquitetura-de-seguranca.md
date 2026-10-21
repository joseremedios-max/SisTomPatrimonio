# 07-arquitetura-de-seguranca.md

## 1. Visão Geral e Princípios de Blindagem

O **Sistema de Informação do Patrimônio do Maranhão (SIP-MA)** é uma plataforma governamental de escala estadual responsável pelo inventário, salvaguarda, fiscalização e proteção legal do patrimônio cultural.

Por se tratar de um sistema crítico do Estado do Maranhão, a arquitetura de segurança adota o modelo de **Defesa em Profundidade** e verificações rigorosas na camada de API.

---

## 2. Estratégia de Sessão e Gerenciamento de Tokens (Padrão OWASP Implementado)

Para eliminar riscos de exfiltração de tokens via ataques XSS no navegador, o sistema opera com a arquitetura híbrida de sessão:

1. **Access Token em Memória (`api.ts` & `AuthContext.tsx`):** Validade de curta duração (15 minutos), mantido exclusivamente em RAM no processo do React/JavaScript (nunca gravado em `localStorage` ou `sessionStorage`).
2. **Refresh Token em Cookie `HttpOnly` (`UsuarioController.java`):** Validade de longa duração (8 horas), gravado no cookie `sipma_refresh_token` com as flags `HttpOnly`, `SameSite=Strict` e `Path=/api/usuarios`.
3. **Renovação Silenciosa e Rotação:** Ao recarregar a aplicação ou receber `HTTP 401`, o cliente solicita silenciosamente `POST /api/usuarios/refresh`, recebendo um novo Access Token em memória e um novo cookie `HttpOnly`. No logout (`POST /api/usuarios/logout`), o cookie é imediatamente invalidado (`Max-Age=0`).

---

## 3. Política de Segurança de Conteúdo (CSP)

Para garantir que apenas scripts e recursos autorizados sejam executados na Single Page Application, o servidor web Nginx e o Spring Security emitem regras de Content Security Policy:

- **Fonte Padrão (`default-src`):** Restringe fontes padrão ao próprio domínio da aplicação (`'self'`).
- **Scripts (`script-src`):** Autoriza exclusivamente scripts do bundle compresso gerado pelo Vite.
- **Imagens e Cartografia (`img-src`):** Libera mídias locais e os tiles do mapa interativo (OpenStreetMap / ArcGIS Esri).
- **Conexões HTTP (`connect-src`):** Restringe requisições assíncronas estritamente aos endpoints autorizados da API REST.
- **Quadros e Molduras (`frame-ancestors`):** Impede que a interface seja embutida em quadros de páginas externas (`'none'`).

---

## 4. Proteção Geoprocessual e Isolamento de Sítios Arqueológicos

Em conformidade com a legislação de proteção ao patrimônio arqueológico (Lei Federal nº 3.924/1961), as coordenadas exatas de sítios arqueológicos são tratadas como **dados confidenciais**.

### 4.1. Segregação por Camadas e Perfil
- **Portal Público (Cidadão):** Consome a visão semântica `consulta_publica` via `GET /api/v1/bens-culturais/publicos` e `GET /api/v1/public/mapa-bens`, recebendo apenas coordenadas generalizadas do município.
- **Painel Administrativo (Perito Autenticado):** Exige perfil `ADMIN` ou `TECNICO` e retorna o campo geoespacial preciso `geom_exata` em PostGIS (SRID 4326).

---

## 5. Recebimento Seguro de Arquivos, SHA-256 e Varredura Antivírus (ClamAV)

O upload de documentos e laudos utiliza validação em três camadas:

1. **Validação no Cliente (`FileUploadZone.tsx`):** Limite de 50 MB, filtro de extensões (`.pdf`, `.jpg`, `.png`, `.dwg`) e cálculo local do Hash **SHA-256** via Web Crypto API.
2. **Validação Síncrona no Servidor (`DocumentoService.java`):** Conferência do checksum SHA-256 e gravação no storage polimórfico (S3/Local) sem salvar dados em formato `bytea` no banco.
3. **Varredura Antivírus Assíncrona (`AntivirusScannerService.java`):** Inspeção assíncrona (`@Async`) via protocolo TCP `zINSTREAM` do daemon **ClamAV** e motor de assinaturas EICAR. Arquivos infectados têm o status alterado para `REJEITADO`, `publicacaoAutorizada = false` e seu download é bloqueado na API.

---

## 6. Checklist de Auditoria de Segurança

- [x] Rota de autenticação apontada para `/api/usuarios/autenticar` com emissão de Cookie `HttpOnly` (`SameSite=Strict`).
- [x] Access Token mantido exclusivamente em memória (Zero Token em `localStorage`) e renovação silenciosa em `/api/usuarios/refresh`.
- [x] Proteção de rotas no React via `<ProtectedRoute />` por perfis RBAC.
- [x] Rejeição HTTP 403 Forbidden no Spring Security para APIs restritas.
- [x] Cálculo local e conferência no servidor de Hash SHA-256 em uploads com limite de 50 MB.
- [x] Varredura antivírus assíncrona (ClamAV) na esteira de upload e bloqueio de download de documentos `REJEITADO`.
- [x] Mascaramento de coordenadas arqueológicas no Portal Público.

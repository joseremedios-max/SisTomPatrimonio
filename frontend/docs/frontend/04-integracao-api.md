# 04 - Integração com a API, Sessão em Memória e Estado Assíncrono

## 🌐 Configuração do Cliente Axios (`src/services/api.ts`)

A integração HTTP com a API REST Spring Boot é centralizada pelo cliente Axios configurado com `withCredentials: true`, **Access Token em memória (RAM)** e **renovação silenciosa via Cookie `HttpOnly` (`SameSite=Strict`)**:

```typescript
// api.ts - Access Token em memória + Renovação silenciosa via Cookie HttpOnly
let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Envia o cookie HttpOnly sipma_refresh_token automaticamente
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});
```

### Fluxo de Renovação Silenciosa (Interceptor 401):
1. Quando uma requisição autenticada recebe `HTTP 401`, o interceptor dispara automaticamente `POST /api/usuarios/refresh`.
2. O backend valida o cookie `HttpOnly` `sipma_refresh_token`, rotaciona o cookie e devolve um novo `token` de curta duração (15 min) no corpo da resposta.
3. O Axios atualiza `inMemoryAccessToken` em RAM e repete a requisição original de forma transparente ao usuário.
4. Caso o Refresh Token tenha expirado ou sido invalidado, a sessão em memória é limpa e o usuário é redirecionado para `/admin/login?expired=true`.

---

## 🔄 Gerenciamento de Estado Assíncrono com TanStack Query

Para evitar buscas desnecessárias e manter os dados sincronizados em tempo real:

* **Consultas (`useQuery`):** Utilizadas para buscar listas de bens, detalhes de vistorias e opções de municípios com tempo de vida de cache (*staleTime*) configurado em 5 minutos.
* **Mutações (`useMutation`):** Utilizadas para criação/edição. Ao concluir uma mutação com sucesso, o cache correspondente é automaticamente invalidado (`queryClient.invalidateQueries({ queryKey: ['bens-culturais'] })`).

---

## 📑 Contratos e Tipagem Estática (`src/types/dtos.ts`)

O arquivo `dtos.ts` garante a paridade de tipos em TypeScript com as entidades e DTOs Java do Spring Boot:
- `BemCulturalDTO`
- `UsuarioDTO` / `LoginResponseDTO`
- `VistoriaDTO`
- `ProcessoJudicialDTO`
- `DadosEspecificosJSONB` (União discriminada para metadados de imóveis, celebrações e sítios arqueológicos).

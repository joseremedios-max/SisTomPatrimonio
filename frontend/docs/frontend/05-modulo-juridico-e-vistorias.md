# 05 - Módulo Jurídico, Vistorias Técnicas e Operação Offline (PWA)

## 📋 Vistorias Técnicas e Matriz de Patologias (`VistoriasPage.tsx`)

O módulo de fiscalização técnica permite registrar vistorias prediais e laudos com vetor dinâmico de anomalias:

* **Estrutura da Patologia:**
  - `tipo`: Infiltração, rachadura estrutural, desprendimento de reboco, cupim, etc.
  - `severidade`: `BAIXA`, `MEDIA`, `ALTA`, `CRITICA`.
  - `descricao`: Detalhamento técnico pericial com indicação da localização exata do dano.

---

## 📡 Operação em Campo Sem Internet (PWA + Fila `IndexedDB`)

Para permitir vistorias em municípios rurais ou centros históricos sem conectividade móvel:

1. **Progressive Web App (`manifest.webmanifest` + `sw.js`):**
   - O Service Worker aplica estratégia *Stale-While-Revalidate* para os assets da interface e *Network-First com Cache Fallback* para consultas da API (`/api/*`).
2. **Fila de Sincronização Offline (`offlineDb.ts`):**
   - Quando o navegador detecta ausência de rede (`!navigator.onLine`) ou falha de conexão durante o envio do laudo em `VistoriasPage.tsx`, o laudo técnico e suas patologias são gravados na object store `offline_laudos` do `IndexedDB` (`enfileirarLaudoOffline`).
   - Ao restabelecer a conexão (evento `window.ononline` ou botão **Sincronizar pendentes**), os laudos enfileirados são enviados automaticamente ao backend e removidos da fila local.

---

## ⚖️ Módulo Jurídico N:N (`ModuloJuridicoPage.tsx`)

Mapeamento de ações civis públicas e embargos judiciais associados a bens culturais:

* **Validação de CNJ (`cnjValidator.ts`):** Validação estrita do padrão de numeração única de processos do Conselho Nacional de Justiça (`NNNNNNN-DD.AAAA.J.TR.OOOO`).
* **Vínculo N:N (`ProcessoBem`):** Um processo pode envolver múltiplos bens culturais e um bem pode figurar em diversos processos.

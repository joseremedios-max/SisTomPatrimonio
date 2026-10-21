# 03 - Design System e Padronização Visual

## 🎨 Tokens Visuais e Paleta Institucional (Tailwind CSS)

O visual do **SisTomPatrimonio-web** foi extraído da especificação oficial do protótipo, garantindo sobriedade e identidade governamental.

```javascript
// tailwind.config.js - Extensão de Cores
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          petroleo: '#0F2C3D', // Azul Petróleo - Headers e Navegação Principal
          verde: '#1E5E41',    // Verde Institucional - Ações de confirmação
          dourado: '#C59B27',  // Dourado Patrimonial - Destaques e Tombamento
          terracota: '#A8422A',// Terracota - Alertas e Inconsistências
          fundo: '#F8F9FA'     // Fundo neutro de alta legibilidade
        }
      }
    }
  }
}
```

---

## 🔤 Tipografia

- **Títulos Históricos e Cabeçalhos de Destaque:** Fonte Serifada (`Merriweather` / `Georgia`) para reforçar o caráter patrimonial.
- **Corpo de Texto, Tabelas e Dados Técnicos:** Fonte Sans-Serif limpa (`Inter` / `system-ui`) para máxima legibilidade em telas operacionais.

---

## 🧩 Componentes Core Reutilizáveis

1. **`StatusBadge`**: Exibe o estado de tombamento ou situação de vistorias com cores semânticas (`TOMBADO`, `EM_ESTUDO`, `EM_RISCO`).
2. **`PageShell`**: Moldura padronizada contendo título, migalhas de pão (*breadcrumbs*) e ações principais da tela.
3. **`DataTable`**: Tabela paginada com ordenação, filtros de busca rápida e exportação de relatórios.
4. **`FileUploadZone`**: Componente interativo de arrastar-e-soltar com cálculo de hash SHA-256 e barra de progresso.
5. **`EventoBemTimeline`**: Componente visual de linha do tempo cronológica para eventos e restauros do bem cultural.
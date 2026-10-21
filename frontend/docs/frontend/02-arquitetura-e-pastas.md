# 02 - Arquitetura e Estrutura de Pastas (SisTomPatrimonio-web)

## 📂 Árvore de Diretórios do Projeto (`src/`)

```text
src/
├── assets/                  # Recursos visuais (imagens, ícones GIS, brasões e estilos globais)
├── components/              # Componentes de interface reutilizáveis
│   ├── ui/                  # Componentes atômicos (Button, Input, Modal, DataTable, Toast)
│   ├── forms/               # Componentes de formulário (FileUploadZone.tsx, Select)
│   ├── gis/                 # Visualização cartográfica (MapContainer, GeoJsonLayer)
│   ├── timeline/            # Visualizações de histórico (EventoBemTimeline.tsx)
│   └── layout/              # Elementos visuais (Header, Sidebar, Footer)
├── context/                 # Provedores de estado global (AuthContext.tsx)
├── hooks/                   # Custom Hooks reativos (useBemCultural.ts, useVistoria.ts)
├── layout/                  # Molduras visuais (PublicLayout.tsx, AdminLayout.tsx)
├── pages/                   # Telas da aplicação organizadas por domínio
│   ├── public/              # Portal Público do Cidadão (Acesso anônimo)
│   └── admin/               # Painel Administrativo (Acesso restrito RBAC)
├── routes/                  # Gerenciamento de navegação (AppRoutes.tsx, ProtectedRoute.tsx)
├── services/                # Camada de comunicação HTTP (api.ts, serviços de domínio)
├── types/                   # Tipagem estática TypeScript (dtos.ts, enums.ts, jsonb.ts)
└── utils/                   # Utilitários puros (formatters.ts, cnjValidator.ts, geojsonUtils.ts)
```

---

## 🏛️ Dual-Face Architecture (Dupla Interface)

O sistema adota uma separação estrita em dois grandes módulos funcionais:

1. **Portal Público Cidadão (`PublicLayout.tsx`):**
   - **Público-alvo:** Cidadãos, estudantes, pesquisadores e turistas.
   - **Características:** Acesso livre sem autenticação, navegação simplificada pelo mapa estadual, busca por acervo público e fichas sanitizadas de bens culturais (com coordenadas arqueológicas exatas omitidas/generalizadas por lei).

2. **Painel Administrativo (`AdminLayout.tsx`):**
   - **Público-alvo:** Peritos da SECMA, técnicos do IPHAN, consultores e procuradores jurídicos.
   - **Características:** Exige autenticação por JWT/2FA, roteamento protegido por perfil (RBAC), formulários de edição com salvamento em `JSONB`, emissão de laudos de vistoria e trilha de auditoria.

---

## 🛡️ Roteamento e Controle de Acesso (RBAC)

O arquivo `AppRoutes.tsx` gerencia as rotas utilizando o `React Router DOM v6`. A segurança é exercida pelo componente `<ProtectedRoute />`:

```tsx
// Exemplo de rota protegida por perfil no AppRoutes.tsx
<Route
  path="/admin/vistorias"
  element={
    <ProtectedRoute perfisPermitidos={['ADMIN', 'TECNICO']}>
      <VistoriasPage />
    </ProtectedRoute>
  }
/>
```

### Perfis de Acesso Mapeados:
- `ADMIN`: Gestão total do sistema, usuários e auditoria imutável.
- `TECNICO`: Vistorias periciais, cadastro de bens e emissão de laudos.
- `CONSULTOR`: Peritos externos com permissão de leitura e pareceres.
- `JURIDICO`: Acompanhamento de ações civis e embargos (padrão CNJ).
- `LEITOR`: Visualização de dados internos restritos sem poder de edição.
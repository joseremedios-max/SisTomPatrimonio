# 05 - Assistente em Etapas (Wizard), JSONB e Persistência Local IndexedDB

## 🧙‍♂️ Assistente Guiado em 10 Etapas (`BemCulturalWizardPage.tsx`)

O cadastro de um bem cultural é uma operação técnica complexa dividida em 10 etapas lógicas com salvamento automático de rascunho:

1. **Identificação:** Código identificador, natureza patrimonial, nome do bem e organização responsável.
2. **Localização:** Município, endereço e coordenadas SIRGAS 2000 / WGS84.
3. **Características arquitetônicas:** Tipologia, uso atual, período e descrição construtiva.
4. **Proteção e tombamento:** Instrumento legal, número do processo, data e âmbito.
5. **Situação jurídica:** Situação fundiária, proprietário/detentor e processo judicial vinculado.
6. **Conservação e risco:** Estado de conservação, nível de risco (`BAIXO`, `MEDIO`, `ALTO`, `CRITICO`), ameaças e medidas emergenciais.
7. **Vistorias:** Histórico e agendamento de vistorias periciais.
8. **Imagens e documentos:** Chaves de armazenamento e documentos comprobatórios.
9. **Observações e histórico:** Resumo público, descrição técnica e observações.
10. **Revisão final:** Classificação de segurança (`PUBLICA`, `INTERNA`, `RESTRITA`, `SIGILOSA`), conferência do payload `JSONB` e submissão.

---

## 💾 Resiliência contra Perda de Dados via `IndexedDB` (`offlineDb.ts`)

Para evitar perda de preenchimentos longos em quedas de energia, fechamento acidental de aba ou instabilidade de rede:

- Ao abrir `BemCulturalWizardPage.tsx`, o hook inicial consulta `carregarRascunhoWizard()` na object store `wizard_drafts` do banco local `sipma_offline_db` (`IndexedDB`).
- Qualquer alteração em campos ou avanço de etapa dispara um *debounce* de `300ms` que persiste o estado completo no `IndexedDB` (`salvarRascunhoWizard`), exibindo o selo **"Rascunho salvo localmente (IndexedDB)"** com opção de limpeza manual (**"Limpar rascunho"**).
- Ao finalizar o envio para a API REST, o rascunho local é automaticamente expurgado (`limparRascunhoWizard`).

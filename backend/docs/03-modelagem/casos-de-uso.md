# Diagrama de Casos de Uso — SIP-MA

Este documento apresenta a modelagem funcional dos casos de uso do sistema, relacionando os perfis de usuários com as funcionalidades operacionais da plataforma.

---

## 1. Diagrama Geral de Casos de Uso (Mermaid)

```mermaid
flowchart LR
    Tecnico["Perito / Técnico"]
    Admin["Administrador / SECMA"]
    Juridico["Assessor Jurídico"]
    Cidadao["Cidadão / Pesquisador"]

    subgraph Modulo_Patrimonio ["Núcleo Patrimonial & Cartografia"]
        UC01["UC01: Cadastrar Bem Cultural"]
        UC02["UC02: Georreferenciar Bem"]
        UC03["UC03: Consultar Bens por Proximidade"]
        UC04["UC04: Consultar Dados Arqueológicos Sigilosos"]
        UC05["UC05: Registrar Evento Histórico na Linha do Tempo"]
    end

    subgraph Modulo_Tombamento ["Tombamento & Fiscalização"]
        UC06["UC06: Abrir Processo de Proteção / Tombamento"]
        UC07["UC07: Homologar Tombamento em Livro de Tombo"]
        UC08["UC08: Agendar e Registrar Vistoria Técnica"]
        UC09["UC09: Incluir Patologias no Laudo"]
        UC10["UC10: Homologar Vistoria Pericial"]
        UC11["UC11: Elaborar Plano de Salvaguarda Imaterial"]
    end

    subgraph Modulo_Documentos_Juridico ["Documentos & Ações Judiciais"]
        UC12["UC12: Fazer Upload de Documento / Foto"]
        UC13["UC13: Cadastrar Ação Judicial de Preservação"]
        UC14["UC14: Vincular Bem à Ação Judicial"]
        UC15["UC15: Consultar Trilha de Auditoria Transacional"]
    end

    %% Relacionamentos do Técnico
    Tecnico --> UC01
    Tecnico --> UC02
    Tecnico --> UC03
    Tecnico --> UC04
    Tecnico --> UC05
    Tecnico --> UC06
    Tecnico --> UC08
    Tecnico --> UC09
    Tecnico --> UC11
    Tecnico --> UC12

    %% Relacionamentos do Administrador
    Admin --> UC07
    Admin --> UC10
    Admin --> UC15
    Admin --> UC01
    Admin --> UC04

    %% Relacionamentos do Jurídico
    Juridico --> UC13
    Juridico --> UC14
    Juridico --> UC03

    %% Relacionamentos do Cidadão
    Cidadao --> UC03
```

---

## 2. Especificação dos Casos de Uso Críticos

### UC01 — Cadastrar Bem Cultural
* **Ator Principal**: `TECNICO`
* **Pré-condições**: Usuário autenticado e organização responsável cadastrada.
* **Fluxo Principal**:
  1. O técnico seleciona a natureza do bem (`MATERIAL_EDIFICADO`, `IMATERIAL`, `ARQUEOLOGICO`).
  2. Informa o código único, denominação oficial e descrição geral.
  3. Preenche os campos específicos da natureza (ex: área e pavimentos para imóveis; contexto para imateriais).
  4. O sistema valida as restrições e persiste o bem com status `RASCUNHO`.
* **Pós-condições**: Bem criado e evento de auditoria gerado.

### UC08 & UC10 — Vistoria Pericial e Homologação
* **Atores**: `TECNICO` (Execução) e `ADMIN` (Homologação).
* **Fluxo Principal**:
  1. O técnico agenda a vistoria e informa a equipe pericial (`JSONB`).
  2. Em campo, diagnostica anomalias físicas e alimenta o vetor de `patologias` em JSONB.
  3. Altera o status para `REALIZADA` e insere o resumo pericial e prazo de próxima vistoria.
  4. O Administrador/Superintendente revisa o laudo e executa a homologação (`UC10`).
  5. O sistema sela o registro com `homologada = true`, data/hora e identificador do homologador.
* **Pós-condições**: Laudo pericial tornado imutável para uso em processos públicos e judiciais.

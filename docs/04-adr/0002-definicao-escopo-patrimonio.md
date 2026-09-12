# ADR 0002: Definição do Escopo de Domínio — Patrimônio Cultural Estadual vs. Inventário Mobiliário

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Coordenação Acadêmica e Comitê Técnico

---

## 1. Contexto e Declaração do Problema
O termo "Tombamento" na administração pública é polissêmico:
1. **Patrimônio Mobiliário Setorial (Almoxarifado)**: Controle interno de bens permanentes de um departamento (cadeiras, computadores, mesas, plaquetas de patrimônio).
2. **Patrimônio Cultural e Histórico (IPHAN / SECMA)**: Proteção jurídica, fiscalização e salvaguarda de monumentos edificado, folclore e sítios arqueológicos através da inscrição em Livro de Tombo.

Houve necessidade de alinhar formalmente o escopo do projeto, garantindo que os modelos conceituais, entidades e diagramas refletissem fielmente o protótipo de alta fidelidade aprovado.

---

## 2. Opções Consideradas
* **Opção 1**: Simplificar o sistema para um inventário mobiliário setorial interno.
* **Opção 2**: Manter o escopo do **Sistema de Informação do Patrimônio Cultural do Maranhão (SIP-MA)**, consolidando o tombamento legal, cartografia e vistorias periciais conforme o protótipo.

---

## 3. Decisão Tomada
Escolher a **Opção 2**. O projeto é formalmente definido como uma plataforma estadual de salvaguarda e tombamento cultural e arqueológico. Essa decisão preserva a riqueza conceitual da modelagem espacial (PostGIS) e atende aos objetivos de pesquisa e extensão do laboratório.

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* Alinhamento 100% fiel com o protótipo aprovado e com o `dbdiagram` oficial.
* Sistema com alto valor agregado e complexidade arquitetural adequada para um laboratório sênior de Engenharia de Software.

### Impactos Negativos (Custos):
* Exige modelagem de três naturezas distintas de bens (`MATERIAL_EDIFICADO`, `IMATERIAL`, `ARQUEOLOGICO`), resolvida com colunas especializadas e JSONB (conforme ADR-0004).

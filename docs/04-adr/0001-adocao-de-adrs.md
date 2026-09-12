# ADR 0001: Adoção de Architecture Decision Records (ADRs)

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê de Desenvolvimento e Coordenação de Projeto

---

## 1. Contexto e Declaração do Problema
O projeto **SisTomPatrimonio** evoluiu de uma ideia embrionária para uma plataforma real em produção que atende ao patrimônio cultural e arqueológico do Estado do Maranhão. Ao longo do ciclo de vida do software, decisões arquiteturais críticas são tomadas frequentemente (modelagem de dados, estratégias de segurança, escolhas de banco de dados e padrões de API). 

Sem um mecanismo formal e padronizado de registro:
* O conhecimento técnico fica disperso na memória dos desenvolvedores.
* Decisões passadas são questionadas repetidamente sem a compreensão dos trade-offs originais.
* Novos membros da equipe ou avaliadores externos (banca/professor) não conseguem traçar a cronologia do raciocínio arquitetural.

---

## 2. Opções Consideradas
1. **Documentação Esparsa / Comentários no Código**: Deixar as decisões documentadas apenas em Javadoc e anotações nos commits.
2. **Documento Único Monolítico (Word/Wiki Externa)**: Manter um documento central fora do repositório Git.
3. **Architecture Decision Records (ADRs) em Markdown versionadas no Git**: Adotar o padrão proposto por Michael Nygard, com registros curtos e imutáveis armazenados em `docs/04-adr/`.

---

## 3. Decisão Tomada
Adotar a **Opção 3 — Architecture Decision Records (ADRs) versionadas no repositório**. 
Toda decisão que envolva impacto estrutural, escolha de tecnologia, trade-offs de modelagem de dados ou segurança deve ser formalizada em um arquivo numerado sequencialmente (`000X-titulo.md`), seguindo o `template-adr.md`.

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* **Rastreabilidade Histórica**: Cada decisão possui data, contexto e justificativa preservados no histórico de commits do Git.
* **Governança Técnica**: Facilita a comunicação e a integração de novos engenheiros ao projeto.
* **Revisão por Pares**: Decisões de arquitetura podem ser debatidas e aprovadas via Pull Requests.

### Impactos Negativos (Custos):
* Pequeno overhead documental antes de refatorações estruturais significativas (mitigado pelo formato enxuto do template).

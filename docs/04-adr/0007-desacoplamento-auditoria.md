# ADR 0007: Desacoplamento da Trilha de Auditoria via Eventos de Domínio

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comitê de Desenvolvimento

---

## 1. Contexto e Declaração do Problema
O SIP-MA exige auditoria transacional de todas as alterações cadastrais (quem alterou, quando, qual entidade e os snapshots `dados_anteriores` e `dados_novos`).
A abordagem ingênua de injetar `AuditoriaRepository` em todos os 9 serviços e chamar `auditoriaRepository.save(...)` manualmente dentro de cada método cria:
* **Alto acoplamento** entre regras de negócio centrais e a infraestrutura de log.
* Código repetitivo (boilerplate) espalhado pela aplicação.
* Risco de falha na transação principal caso a gravação do log de auditoria lance uma exceção não capturada.

---

## 2. Opções Consideradas
* **Opção 1**: Chamada explícita e manual de `AuditoriaRepository.save(...)` em cada serviço.
* **Opção 2**: Utilização de Hibernate Envers (gera tabelas `_aud` duplicadas para cada entidade).
* **Opção 3**: Desacoplamento via **Spring Application Events** (`ApplicationEventPublisher`) e `@TransactionalEventListener(phase = AFTER_COMMIT)`.

---

## 3. Decisão Tomada
Adotar a **Opção 3 — Eventos de Domínio**:
* Os serviços de negócio apenas publicam eventos semânticos (ex: `RegistroAlteradoEvent`).
* Um componente especializado (`AuditoriaListener`) escuta o evento de forma assíncrona/desacoplada e persiste na tabela genérica `auditoria`.
* Se a auditoria falhar, a transação de negócio principal do usuário já foi consolidada com sucesso (`AFTER_COMMIT`), garantindo resiliência.

---

## 4. Consequências e Trade-offs

### Impactos Positivos:
* **Alta Coesão**: Serviços cuidam exclusivamente de suas regras de domínio.
* **Baixo Acoplamento**: A auditoria pode ser modificada, enviada para Kafka ou log externo sem tocar no código dos serviços de negócio.

### Impactos Negativos (Custos):
* Exige configuração de eventos assíncronos no Spring e compreensão do ciclo de vida transacional por parte dos desenvolvedores.

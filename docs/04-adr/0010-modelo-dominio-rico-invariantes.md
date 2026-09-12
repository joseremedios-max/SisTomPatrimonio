# ADR 0010: Adocao de Dominio Rico e Protecao de Invariantes nas Entidades

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comite de Desenvolvimento

---

## 1. Contexto e Declaracao do Problema

No prototipo inicial, as entidades JPA eram "sacos de dados" anemicos (Modelo de Dominio Anemico), contendo apenas anotacoes do Lombok (`@Getter`, `@Setter`) sem nenhum metodo de comportamento ou validacao intrinseca de estado.

Essa abordagem apresenta deficiencias em sistemas reais de patrimonio publico:
1. **Quebra de Invariantes de Negocio**: Uma vistoria nao pode ter seu laudo alterado se ja foi homologada pelo perito-chefe. Se o modelo permite `vistoria.setNivelRisco(...)` livremente, qualquer parte do codigo pode corromper a integridade do laudo pericial.
2. **Duplicacao de Regras**: As condicoes de homologacao ou publicacao precisam ser repetidas em multiplos servicos ou endpoints.
3. **Complexidade Procedural**: Os servicos de aplicacao acumulam centenas de linhas de condicionais `if/else`, tornando os testes dificeis e o fluxo confuso.

---

## 2. Opcoes Consideradas

* **Opcao 1**: Manter Modelo Anemico com todas as verificacoes concentradas nos servicos (`VistoriaService`, `BemCulturalService`).
* **Opcao 2**: Adotar **Modelo de Dominio Rico (Rich Domain Model)**:
  * As proprias entidades JPA encapsulam seus dados e expoem metodos de negocio que protegem seus estados e suas invariantes.
  * Os servicos atuam como orquestradores de fluxo (transacoes, persistencia, envio de eventos de auditoria), mas o julgamento do estado pertence a entidade.

---

## 3. Decisao Tomada

Adotar a **Opcao 2 — Dominio Rico**:
1. **Invariantes de Vistoria**:
   * `Vistoria.homologar(Usuario homologador)`: Valida se a vistoria esta com status `REALIZADA`, se nao foi homologada anteriormente e se o perito homologador e valido. Preenche automaticamente a data de homologacao e altera o estado.
   * `Vistoria.registrarRealizacao(...)`: Impede expressamente a alteracao ou adulteracao de dados de vistorias que ja foram homologadas no passado.
2. **Ciclo de Vida de Bem Cultural**:
   * `BemCultural.publicar()`: Garante que bens arquivados nao sejam publicados indevidamente.
   * `BemCultural.arquivar(Usuario responsavel)`: Registra data de arquivamento e responsavel institucional.
   * `BemCultural.tombar()` e `BemCultural.registrarSalvaguarda()`: Transicoes controladas de protecao juridica.

---

## 4. Consequencias e Trade-offs

### Impactos Positivos:
* **Alta Coesao e Encapsulamento**: O estado e o comportamento que altera esse estado estao juntos na mesma classe.
* **Seguranca de Integridade**: Torna impossivel colocar a entidade em um estado invalido em memoria.
* **Testes de Unidade Puros**: Regras de negocio podem ser testadas diretamente na entidade sem necessidade de subir o contexto do Spring ou simular repositorios.

### Impactos Negativos (Custos):
* Exige que os desenvolvedores evitem o uso indiscriminado de setters publicos, preferindo invocar metodos com intencao de negocio declarada.

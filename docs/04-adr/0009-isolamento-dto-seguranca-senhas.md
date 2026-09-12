# ADR 0009: Contratos Estritos de DTOs, Nao-Vazamento de Entidades e Padronizacao RFC 7807

* **Status**: Aceita
* **Data**: 2026-09-12
* **Autores**: Equipe de Arquitetura SisTomPatrimonio
* **Decisores**: Comite de Desenvolvimento

---

## 1. Contexto e Declaracao do Problema

Em fases iniciais de prototipacao, e comum que controllers exponham diretamente entidades JPA (como `Usuario` e `BemCultural`) em suas respostas HTTP. 

No entanto, em um sistema real de producao, essa pratica gera falhas graves de seguranca e arquitetura:
1. **Vazamento de Dados Sensiveis**: A entidade `Usuario` possui o campo de hash de senha (`senha`). Se serializada diretamente, o hash da credencial e exposto no JSON de resposta, permitindo ataques de forca bruta offline caso a resposta seja interceptada.
2. **Quebra de Encapsulamento e Acoplamento Temporal**: O contrato publico da API REST fica amarrado as tabelas do banco de dados. Qualquer alteracao no schema relacional quebra imediatamente os clientes externos (frontend, aplicativos moveis, sistemas legados).
3. **Erros de Serializacao (Lazy Loading)**: Relacionamentos JPA mapeados como `FetchType.LAZY` fora da transacao geram `LazyInitializationException` ou ciclos infinitos de serializacao JSON (referencias circulares).
4. **Erros Nao-Padronizados**: O uso de `@ExceptionHandler` locais em controllers gerava retornos em texto puro (`text/plain`), quebrando o padrão REST esperado pelo frontend.

---

## 2. Opcoes Consideradas

* **Opcao 1**: Manter entidades nas respostas e anotar campos sensiveis com `@JsonIgnore`.
* **Opcao 2**: Utilizacao de visualizacoes parciais via `@JsonView`.
* **Opcao 3**: Separacao estrita de camadas utilizando **Data Transfer Objects (DTOs)** dedicados para entrada (Request) e saida (Response), com tratamento de erros centralizado via **RFC 7807 (ProblemDetail)**.

---

## 3. Decisao Tomada

Adotar a **Opcao 3 — DTOs Estritos e RFC 7807**:
1. **Proibicao de Vazamento de Entidades**: Nenhuma entidade JPA deve ultrapassar a fronteira da camada de Servico em direcao ao Controller ou ao cliente HTTP.
2. **DTOs de Saida Seguros**:
   * Criacao de `UsuarioResponseDTO` contendo apenas identificador publico, nome, email, perfil e timestamps, omitindo completamente qualquer referencia a senha.
3. **Centralizacao no GlobalExceptionHandler**:
   * Remocao de todo e qualquer `@ExceptionHandler` local em controllers.
   * Todos os erros de validacao e violacao de regras de negocio (`RegraNegocioRunTime`) retornam o padrao RFC 7807 (`ProblemDetail`) com status HTTP semantico (422 Unprocessable Entity, 400 Bad Request, 404 Not Found) e campos detalhados.

---

## 4. Consequencias e Trade-offs

### Impactos Positivos:
* **Seguranca por Design**: Credenciais e campos internos do banco jamais sao enviados para a rede.
* **Alta Coesao**: O Controller cuida somente de validacao de entrada e retorno HTTP; o Service cuida das regras e conversoes; o Repositorio cuida da persistencia.
* **Estabilidade de API**: O modelo relacional pode ser otimizado ou refatorado sem quebrar o contrato consumido pelo cliente web.

### Impactos Negativos (Custos):
* Necessidade de escrever e manter classes DTO adicionais e metodos de mapeamento.

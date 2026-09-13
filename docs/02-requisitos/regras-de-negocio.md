# Regras de Negócio (RN) — SIP-MA

As Regras de Negócio definem as políticas, restrições operacionais, invariantes e diretrizes legais que o **SIP-MA** deve garantir em todas as transações da camada de serviços.

---

## Tabela Resumo de Regras de Negócio

| Regra | Título da Regra | Gravidade | Módulo Envolvido |
| :---: | :--- | :---: | :--- |
| **RN01** | Código Único do Bem Cultural | Bloqueante | Cadastro de Bens |
| **RN02** | Exclusividade de Salvaguarda para Bens Imateriais | Bloqueante | Salvaguarda |
| **RN03** | Proteção de Coordenadas Arqueológicas Confidenciais | Bloqueante | Geoprocessamento / Segurança |
| **RN04** | Ciclo de Vida e Publicidade do Bem Cultural | Bloqueante | Núcleo Patrimonial |
| **RN05** | Homologação e Inscrição em Livro de Tombo | Bloqueante | Proteção / Tombamento |
| **RN06** | Protocolo de Homologação de Vistoria Técnica | Bloqueante | Vistoria Pericial |
| **RN07** | Validação Criptográfica de Arquivos Digitais | Bloqueante | Documentos |
| **RN08** | Unicidade de E-mail e Integridade de Credenciais | Bloqueante | Usuários |
| **RN09** | Restrição de Papel de Bem em Ações Judiciais | Informativa | Jurídico |
| **RN10** | Imutabilidade e Não-Repúdio da Auditoria | Bloqueante | Auditoria |

---

## Detalhamento das Regras

### RN01 — Código Único do Bem Cultural
* **Definição**: Cada bem cultural registrado no sistema deve possuir um código alfanumérico único de até 24 caracteres (ex: `MA-SL-MAT-0001`).
* **Critério de Aceite**: Tentativas de cadastrar dois bens com o mesmo código devem ser rejeitadas com erro HTTP 422 (`RegraNegocioRunTime`).

### RN02 — Exclusividade de Salvaguarda para Bens Imateriais
* **Definição**: Planos de salvaguarda destinam-se exclusivamente ao patrimônio intangível (tradições, festas, saberes e celebrações populares).
* **Critério de Aceite**: A camada de serviço deve verificar se o bem associado possui `natureza == 'IMATERIAL'`. Se o bem for `MATERIAL_EDIFICADO` ou `ARQUEOLOGICO`, a criação do plano de salvaguarda deve ser rejeitada imediatamente.

### RN03 — Proteção de Coordenadas Arqueológicas Confidenciais
* **Definição**: As coordenadas exatas de sítios arqueológicos armazenadas em `localizacao_arqueologica_restrita` são protegidas pela Lei Federal de Arqueologia e decretos estaduais contra saques e vandalismo.
* **Critério de Aceite**:
  * Usuários com perfil `TECNICO` e `ADMIN` têm acesso de leitura às coordenadas exatas (`geom_exata`).
  * Consultas realizadas por usuários `CONSULTOR`, `LEITOR` ou público geral devem retornar apenas o polígono de amortecimento público (`buffer_protecao`) com coordenadas ofuscadas.

### RN04 — Ciclo de Vida e Publicidade do Bem Cultural
* **Definição**: Os bens culturais transitam entre os seguintes estados operacionais:

```mermaid
stateDiagram-v2
    direction LR
    [*] --> RASCUNHO
    RASCUNHO --> EM_REVISAO
    EM_REVISAO --> APROVADO
    APROVADO --> PUBLICADO
    PUBLICADO --> ARQUIVADO
```

* **Critério de Aceite**:
  * Ao ser cadastrado, o bem inicia compulsoriamente como `RASCUNHO`.
  * Um bem só pode atingir o estado `PUBLICADO` quando possuir pelo menos uma localização principal e um processo de proteção vigente associado.

### RN05 — Homologação e Inscrição em Livro de Tombo
* **Definição**: O ato normativo de tombamento formal só atinge eficácia jurídica quando a proteção atinge a fase `HOMOLOGADO`.
* **Critério de Aceite**:
  * A fase `HOMOLOGADO` exige o preenchimento obrigatório de: `ato_normativo` (número do decreto/portaria), `livro_tombo` e `numero_inscricao`.
  * Se a proteção for revogada (`fase == 'REVOGADO'`), o campo `vigente` deve ser alterado automaticamente para `false`.

### RN06 — Protocolo de Homologação de Vistoria Técnica
* **Definição**: Uma vistoria técnica tem finalidade pericial probatória perante o Estado e o Ministério Público.
* **Critério de Aceite**:
  * Uma vistoria só pode ser homologada se o seu status atual for `REALIZADA`. Vistorias nos estados `PLANEJADA` ou `EM_CAMPO` não podem ser homologadas.
  * A operação de homologação deve registrar em transação atômica: `homologada = true`, `homologada_por = id_usuario_autenticado` e `homologada_em = NOW()`.
  * Vistorias homologadas tornam-se somente-leitura (imutáveis).

### RN07 — Validação Criptográfica de Arquivos Digitais
* **Definição**: Todo documento, laudo pericial ou fotografia inserida no acervo deve ter seu hash SHA-256 gerado e armazenado.
* **Critério de Aceite**: O hash SHA-256 de 64 caracteres garante a comprovação de que o arquivo armazenado no storage não sofreu adulteração ou substituição maliciosa.

### RN08 — Unicidade de E-mail e Integridade de Credenciais
* **Definição**: Não pode haver duplicidade de e-mail na base de usuários da SECMA.
* **Critério de Aceite**: O serviço de usuário deve validar `existsByEmail` antes de persistir. Senhas nunca podem ser trafegadas ou persistidas em formato texto claro.

### RN09 — Restrição de Papel de Bem em Ações Judiciais
* **Definição**: Na relação associativa N:N `processo_bem`, deve-se especificar claramente a qualificação do bem no litígio (`REU_EMBARGADO`, `OBJETO_DANO`, `GARANTIA`).
* **Critério de Aceite**: Evita ambiguidade jurídica sobre se o monumento foi danificado ou se uma obra em seu entorno foi embargada.

### RN10 — Imutabilidade e Não-Repúdio da Auditoria
* **Definição**: A trilha de auditoria é um registro legal para controle de órgãos de fiscalização (TCE-MA e MP-MA).
* **Critério de Aceite**: Registros da tabela `auditoria` nunca podem sofrer operações de `UPDATE` ou `DELETE`. Métodos de serviço devem permitir exclusivamente inserções (`INSERT`) e consultas (`SELECT`).

---

## Matriz de Rastreabilidade: Regras de Negócio e Testes Unitários

| Regra | Título | Classe de Teste | Método(s) de Teste Validador(es) |
| :---: | :--- | :--- | :--- |
| **RN01** | Código Único do Bem Cultural | [BemCulturalServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/BemCulturalServiceTest.java) | `deveCadastrarBemSemGeolocalizacao` |
| **RN02** | Exclusividade de Salvaguarda Imaterial | [SalvaguardaServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/SalvaguardaServiceTest.java) | `deveCriarSalvaguardaComSucesso`, `deveGerarErroAoTentarCriarSalvaguardaParaBemMaterial` |
| **RN04** | Ciclo de Vida do Bem Cultural | [BemCulturalServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/BemCulturalServiceTest.java) | `devePublicarBemCultural`, `deveArquivarBemCultural` |
| **RN05** | Homologação de Tombamento | [ProtecaoServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/ProtecaoServiceTest.java) | `deveHomologarTombamentoComSucessoEAtualizarBem`, `deveGerarErroAoHomologarSemLivroTombo`, `deveGerarErroAoHomologarSemNumeroInscricao`, `deveGerarErroAoHomologarSemAtoNormativo` |
| **RN06** | Homologação de Vistoria Técnica | [VistoriaServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/VistoriaServiceTest.java) | `deveHomologarVistoriaComSucessoEEmitirEventoAuditoria`, `deveGerarErroAoHomologarVistoriaNaoRealizada` |
| **RN07** | Validação Criptográfica de Mídias | [DocumentoServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/DocumentoServiceTest.java) e [LocalStorageServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/storage/LocalStorageServiceTest.java) | `deveArmazenarEDocumentarArquivoComSucesso`, `deveCalcularSha256Corretamente` |
| **RN08** | Unicidade de E-mail e Hash BCrypt | [UsuarioServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/UsuarioServiceTest.java) | `deveGerarErroAoTentarSalvarComEmailDuplicado`, `deveGerarErroAoTentarSalvarSemSenha`, `deveSalvarUsuarioComSucesso`, `deveAutenticarUsuarioComSucesso` |
| **RN10** | Não-Repúdio e Trilha Transacional | [AuditoriaEventListenerTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/listeners/AuditoriaEventListenerTest.java) e [AuditoriaServiceTest](../../src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/services/AuditoriaServiceTest.java) | `deveRegistrarAuditoriaAoReceberEvento`, `deveBuscarAuditoriaPorEntidadeComPaginacao` |

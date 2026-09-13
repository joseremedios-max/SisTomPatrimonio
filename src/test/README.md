# Guia de Testes Automatizados — SisTomPatrimonio (SIP-MA)

Este documento descreve a arquitetura, organizacao, padroes de projeto e instrucoes de execucao da suite de testes automatizados do sistema **SisTomPatrimonio**.

---

## 1. Onde os Testes estao Documentados no Projeto

A documentacao dos testes e mantida de forma rastreavel em multiplos pontos do repositorio:

1. **Neste Arquivo (`src/test/README.md`)**: Guia tecnico imediato para desenvolvedores na raiz do codigo de teste.
2. **[docs/README.md](../../docs/README.md)**: Secao *Cobertura da Camada de Servicos e Testes Automatizados*, contendo o sumario executivo de todas as suites.
3. **[docs/02-requisitos/regras-de-negocio.md](../../docs/02-requisitos/regras-de-negocio.md)**: Secao *Matriz de Rastreabilidade*, que mapeia formalmente cada regra legal (RN01 a RN10) aos metodos de teste unitario correspondentes.
4. **[docs/04-adr/0011-adocao-monolito-modular.md](../../docs/04-adr/0011-adocao-monolito-modular.md)**: Justificativa da testabilidade isolada no modelo de Monolito Modular com mocks puros.

---

## 2. Estrutura de Diretorios dos Testes

Os testes estao organizados sob `src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/`:

```text
src/test/java/br/com/SisTomPatrimonio/SisTomPatrimonio/
├── services/                        # Testes Unitarios da Camada de Servicos (Regras de Negocio)
│   ├── UsuarioServiceTest.java      # 10 testes: validacoes, unicidade, senhas BCrypt, busca DTO
│   ├── BemCulturalServiceTest.java  # 3 testes: cadastro, publicacao, arquivamento, auditoria
│   ├── SalvaguardaServiceTest.java  # 4 testes: regra RN02 (exclusividade imaterial), plano obrigatorio
│   ├── VistoriaServiceTest.java     # 9 testes: criacao planejada, homologacao realizada, bloqueios
│   ├── ProtecaoServiceTest.java     # 10 testes: tombamento, livro do tombo, inscricao, decreto
│   ├── DocumentoServiceTest.java    # 6 testes: metadados, StorageService, hash SHA-256, download
│   ├── EventoBemServiceTest.java    # 4 testes: timeline historica, intervencao, dano, restauro
│   ├── ProcessoJudicialServiceTest.java # 3 testes: processos judiciais, unicidade CNJ
│   └── AuditoriaServiceTest.java    # 2 testes: paginacao, DTO imutavel, acoes do sistema
│
├── storage/                         # Testes do Strategy Pattern de Armazenamento
│   └── LocalStorageServiceTest.java # 2 testes: gravacao fisica, integridade binaria e hash SHA-256
│
├── listeners/                       # Testes de Desacoplamento de Eventos (Observer)
│   └── AuditoriaEventListenerTest.java # 1 teste: consumo assincrono AFTER_COMMIT e transacao REQUIRES_NEW
│
├── models/entities/                 # Testes de Dominio Rico e Protecao de Invariantes
│   └── VistoriaTest.java            # 2 testes: bloqueio de alteracao pos-homologacao
│
├── controllers/                     # Testes de Integracao Web (MockMvc)
│   ├── UsuarioControllerTest.java   # 2 testes: respostas RFC 7807, DTO sem senhas
│   ├── BemCulturalControllerTest.java
│   ├── SalvaguardaControllerTest.java
│   ├── ProcessoJudicialControllerTest.java
│   └── EventoBemControllerTest.java
│
└── repositories/                    # Testes de Integracao de Persistencia (H2 / DataJpaTest)
    ├── UsuarioRepositoryTest.java
    ├── BemCulturalRepositoryTest.java
    ├── VistoriaRepositoryTest.java
    ├── ProtecaoRepositoryTest.java
    ├── DocumentoRepositoryTest.java
    └── AuditoriaRepositoryTest.java
```

---

## 3. Padroes e Praticas Aplicadas

1. **Testes Unitarios com Mocks Puros (Sem Overhead)**:
   * Uso de `@ExtendWith(MockitoExtension.class)`.
   * Injecao com `@Mock` e `@InjectMocks`.
   * Execucao ultrarrapida em memoria sem necessidade de subir contexto do Spring Framework para testes de servico.
2. **Assertivas Legiveis e Robustas**:
   * Uso de AssertJ (`assertThat(...)`) e JUnit 5 (`Assertions.assertThrows(...)`).
   * Validacao de mensagens exatas de excecoes de dominio (`RegraNegocioRunTime`).
   * Verificacao de interacoes com mocks via `verify(mock, times(1))`.
3. **Isolamento de Credenciais e Segurança**:
   * Garantia de que a entidade JPA de usuario nunca e retornada nos DTOs de servico ou respostas de API.

---

## 4. Como Executar no Terminal

Todos os comandos devem ser executados na raiz do projeto:

### A. Executar Todos os 79 Testes do Projeto
```bash
./mvnw test
```

### B. Executar Apenas os Testes da Camada de Servicos (53 Testes)
```bash
./mvnw test -Dtest="*ServiceTest"
```

### C. Executar uma Classe de Teste Especifica
```bash
# Servico de Protecao e Tombamento
./mvnw test -Dtest=ProtecaoServiceTest

# Servico de Vistorias e Homologacao Pericial
./mvnw test -Dtest=VistoriaServiceTest

# Servico de Usuarios e Autenticacao
./mvnw test -Dtest=UsuarioServiceTest
```

### D. Executar um Metodo Individual de Teste
```bash
# Validar regra de exclusividade de salvaguarda para bem imaterial (RN02)
./mvnw test -Dtest=SalvaguardaServiceTest#deveGerarErroAoTentarCriarSalvaguardaParaBemMaterial

# Validar homologacao de tombamento formal (RN05)
./mvnw test -Dtest=ProtecaoServiceTest#deveHomologarTombamentoComSucessoEAtualizarBem
```

### E. Inspecionar Relatorios Gerados pelo Maven Surefire
Os relatorios de texto gerados automaticamente ficam gravados em `target/surefire-reports/`:
```bash
# Listar todos os relatorios gerados
ls -la target/surefire-reports/*.txt

# Visualizar o resumo de um teste especifico
cat target/surefire-reports/br.com.SisTomPatrimonio.SisTomPatrimonio.services.UsuarioServiceTest.txt
```

# Contribuindo com o SisTomPatrimonio

## Pré-requisitos

- JDK 25.
- Docker Desktop para executar o PostgreSQL/PostGIS localmente.
- Git configurado com sua identidade.

## Configuração local

1. Clone o repositório.
2. Copie `.env.example` para `.env` e ajuste os valores locais.
3. Suba o banco:

   ```powershell
   docker compose up -d postgres-spatial
   ```

4. Execute os testes:

   ```powershell
   .\mvnw.cmd clean test
   ```

5. Inicie a aplicação:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

No Linux/macOS, use `./mvnw` no lugar de `./mvnw.cmd`.

## Fluxo de trabalho

1. Atualize a branch principal antes de começar:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

2. Crie uma branch curta e descritiva:

   ```bash
   git switch -c feature/descricao-curta
   ```

   Use `fix/`, `docs/`, `test/` ou `chore/` quando forem mais adequados.

3. Faça alterações pequenas e execute `./mvnw clean test` antes de abrir o Pull Request.
4. Envie a branch e abra um Pull Request para `main`:

   ```bash
   git push -u origin feature/descricao-curta
   ```

5. Aguarde a aprovação e o CI antes do merge. Não faça push direto em `main`.

## Commits

Use mensagens imperativas e objetivas, preferencialmente no formato:

```text
tipo: descrição curta
```

Tipos comuns: `feat`, `fix`, `test`, `docs`, `refactor`, `build` e `chore`.

Exemplo:

```text
fix: validar coordenadas do bem cultural
```

## Regras importantes

- Nunca envie `.env`, senhas, tokens, chaves JWT ou dados reais.
- Atualize testes quando alterar comportamento.
- Atualize a coleção do Insomnia quando alterar contratos HTTP.
- Mantenha migrations Flyway compatíveis e não altere migrations já aplicadas.
- Não faça force push em branches compartilhadas.

## Pull Requests

O autor deve preencher o template e informar como validou a mudança. Pull Requests devem ser revisados antes do merge e permanecer com o CI verde.
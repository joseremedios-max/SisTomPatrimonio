# SIP — Sistema Integrado de Informações Patrimoniais · Maranhão

Protótipo de plataforma institucional para **documentação, visualização e gestão do
patrimônio cultural do Maranhão**: imóveis históricos, sítios arqueológicos e
manifestações de patrimônio imaterial distribuídos pelos 217 municípios do estado.

O sistema tem duas faces:

- **Portal público** — consulta aberta ao acervo, mapas interativos e fichas técnicas.
- **Painel administrativo** — cadastro, vistorias, relatórios, monitoramento de risco e
  gestão de usuários, voltado às equipes técnicas (Governo do Estado, IPHAN-MA e parceiros).

Os dados exibidos são **simulados**, apenas para demonstração visual do protótipo.

---

## Como visualizar

O protótipo precisa ser servido por um servidor HTTP local. **Não basta abrir o
`index.html` direto no navegador** (`file://`), porque os arquivos `.jsx` são carregados
dinamicamente e o navegador bloqueia esse carregamento fora de um servidor.

### Windows — duplo-clique em `SIP-MA.exe` (recomendado)

**Nenhum pré-requisito.** O `SIP-MA.exe` já traz o Python embutido: funciona em um
computador que não tem nada instalado, sem instalar nada e sem senha de administrador.
Ele sobe o servidor e abre o navegador em `http://localhost:8080`.

Para encerrar, feche a janela preta do servidor.

> O executável não é assinado digitalmente. Na primeira execução o Windows pode exibir
> o aviso *"O Windows protegeu o seu PC"* — clique em **Mais informações → Executar
> assim mesmo**. O `.exe` só precisa ficar **na mesma pasta** do `index.html`.

### Windows — alternativa: `server.bat`

Se preferir não usar o executável, dê um duplo-clique em **`server.bat`**. Ele:

1. procura um Python 3 no computador (incluindo instalações fora do `PATH`, e ignorando
   o atalho falso da Microsoft Store);
2. se não encontrar, **instala o Python automaticamente** — via `winget`, ou baixando o
   instalador oficial do python.org como plano B. A instalação é feita apenas para o
   usuário atual, sem exigir senha de administrador;
3. instala as bibliotecas de um `requirements.txt`, se algum dia existir;
4. avisa se a CDN estiver inacessível (veja *Requisito de internet* abaixo);
5. inicia o servidor e abre o navegador.

### Qualquer sistema (terminal)

Requer [Python 3](https://www.python.org/downloads/) instalado.

```bash
python server.py
```

Depois acesse **http://localhost:8080** no navegador.
Para encerrar o servidor, pressione `Ctrl+C` no terminal.

### Requisito de internet

O protótipo **não usa bibliotecas Python** — o servidor usa apenas a biblioteca padrão.
As bibliotecas são de JavaScript (**React**, **Babel**, **Leaflet**) e, junto com as
fontes, são carregadas **via CDN pelo navegador**. Portanto:

> **A máquina da apresentação precisa de conexão com a internet.**
> Sem conexão, o servidor sobe, mas as telas não renderizam.

Tanto o `SIP-MA.exe` quanto o `server.bat` testam a CDN ao iniciar e exibem um aviso
explícito quando ela não está acessível. Se a apresentação for em um local sem internet
garantida, é necessário baixar essas bibliotecas para dentro do projeto antes (hoje elas
apontam para `unpkg.com` no `index.html`).

---

## Funcionalidades / telas

### Portal público
- **Início** — apresentação do acervo, indicadores e mapa do Maranhão em destaque.
- **Mapa** — mapa interativo do estado com filtros por situação e camadas; e mapa de
  satélite de **São Luís** com os bens do centro histórico.
- **Acervo** — listagem navegável dos bens com filtros.
- **Ficha do bem** — página detalhada de cada imóvel (galeria, linha do tempo, localização).
- **Patrimônio imaterial** e **Sítios arqueológicos** — seções temáticas.

### Painel administrativo
- **Dashboard** — visão geral com indicadores e atividade recente.
- **Imóveis** — gestão do acervo de bens imóveis.
- **Cadastro** — formulário em etapas para registrar um novo bem.
- **Vistorias** — acompanhamento de vistorias técnicas.
- **Imóveis em risco** — monitoramento dos bens em situação crítica.
- **Relatórios**, **Documentos**, **Mapa e georreferenciamento**, **Ações judiciais**,
  **Patrimônio imaterial** e **Sítios arqueológicos** (admin), **Usuários e permissões**,
  **Configurações**.

---

## Tecnologia

- **React 18** + **Babel Standalone**, carregados via CDN — **sem etapa de build**.
  Os arquivos `.jsx` são transpilados no próprio navegador.
- **Leaflet** (CDN) para o mapa de satélite de São Luís; o mapa do Maranhão é desenhado
  em **SVG**.
- Servidor estático em **Python** (`http.server`), sem dependências externas.
- Design system próprio em `styles.css` (tipografia Instrument Serif / IBM Plex,
  paleta institucional).

---

## Distribuição

O projeto pode ser entregue como um pacote `.zip` contendo apenas os arquivos necessários
para executar o protótipo — **incluindo o `SIP-MA.exe`**, que é o que dispensa qualquer
instalação na máquina de destino. Itens de desenvolvimento local, como `.git/`,
`.claude/`, arquivos temporários e capturas de validação, ficam fora do pacote.

Para executar no computador da apresentação: extrair o `.zip` (extrair de verdade, não
abrir o zip por cima) e dar duplo-clique em `SIP-MA.exe`. Nada precisa ser instalado —
apenas internet, pelo motivo descrito em *Requisito de internet*.

### Como o `SIP-MA.exe` é gerado

O executável empacota **apenas o servidor** (`server.py`) junto com o interpretador
Python. Os arquivos do protótipo (`.jsx`, `.css`, `assets/`) continuam soltos ao lado do
`.exe` e podem ser editados livremente — **editar as telas não exige recompilar**. Só é
necessário gerar o `.exe` de novo se o `server.py` mudar:

```bash
pip install pyinstaller
pyinstaller --onefile --name SIP-MA --icon sipma.ico server.py
```

O binário sai em `dist/SIP-MA.exe` e deve ser copiado para a raiz do projeto.

---

## Estrutura do projeto

```
index.html            Página de entrada (carrega React, Babel e os módulos abaixo)
styles.css            Design system (variáveis, componentes, responsividade)
data.js               Dados simulados (municípios, imóveis, vistorias, usuários...)

components.jsx        Componentes compartilhados (ícones, mapas, cabeçalho, rodapé...)
public-screens.jsx    Telas públicas: Início, Mapa, Acervo
public-screens-2.jsx  Telas públicas: Ficha, Imaterial, Arqueológico, Login
admin-screens.jsx     Painel: estrutura (AdminShell), Dashboard, Imóveis
admin-screens-2.jsx   Painel: Cadastro, Vistorias, Relatórios, Usuários
admin-screens-3.jsx   Painel: Georreferenciamento, Ações judiciais, Arqueologia,
                      Patrimônio imaterial, Documentos, Configurações
saoluis.jsx           Mapa de satélite de São Luís (Leaflet) + painel de registro
app.jsx               Roteador principal + telas Sobre e Imóveis em risco

SIP-MA.exe            Servidor + Python embutido: roda sem instalar nada (Windows)
server.bat            Alternativa: garante/instala o Python e inicia o servidor
server.py             Servidor HTTP local (porta 8080), apenas biblioteca padrao
sipma.ico             Icone usado na compilacao do SIP-MA.exe
assets/               Imagens (logos institucionais e foto de capa)
```

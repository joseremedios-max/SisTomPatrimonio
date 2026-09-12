# Documento de Visão do Produto — SIP-MA (SisTomPatrimonio)

## 1. Declaração de Posicionamento do Produto

* **Para**: A Secretaria de Estado da Cultura do Maranhão (SECMA), o Instituto do Patrimônio Histórico e Artístico Nacional (IPHAN) e pesquisadores/cidadãos.
* **Que**: Enfrentam dificuldades no mapeamento, controle legal de tombamento, fiscalização preventiva e salvaguarda do patrimônio cultural maranhense.
* **O SIP-MA**: É uma plataforma corporativa e estadual de geoprocessamento, fiscalização pericial e controle documental.
* **Que**: Centraliza o ciclo de vida do patrimônio material edificado, imaterial e arqueológico com suporte geoespacial PostGIS.
* **Diferente de**: Sistemas tradicionais de almoxarifado/controle de bens mobiliários internos ou planilhas descentralizadas.
* **Nosso produto**: Garante integridade cartográfica EPSG:4326, isolamento de segurança de sítios arqueológicos sensíveis, gestão do Livro de Tombo e histórico pericial de patologias em tempo real.

---

## 2. O Problema do Negócio

O Estado do Maranhão abriga um dos mais expressivos acervos culturais do Brasil, incluindo o Centro Histórico de São Luís (Patrimônio Mundial da UNESCO), centenas de sítios arqueológicos no litoral e sertão, e ricas manifestações imateriais (Bumba Meu Boi, Tambor de Crioula).

Entretanto, a governança desse patrimônio sofre com:
1. **Dispersão e Descontinuidade da Informação**: Dossiês físicos de tombamento fragmentados em cartórios e pastas da SECMA.
2. **Vulnerabilidade Arqueológica**: Falta de controle seguro das coordenadas exatas de sítios, expondo monumentos e cavernas com arte rupestre a saques e degradação por garimpos ou obras irregulares.
3. **Fiscalização Reativa**: Vistorias técnicas registradas em papel, sem histórico cronológico de patologias físicas (infiltrações, cupins, trincas).
4. **Desconexão Jurídica**: Falta de rastreabilidade entre processos judiciais de embargo/recuperação de monumentos e os bens afetados.

---

## 3. Objetivos do Sistema

* **Objetivo Geral**: Prover uma infraestrutura unificada de dados do patrimônio do Maranhão para cadastro, geoprocessamento, tombamento, fiscalização e acompanhamento processual.
* **Objetivos Específicos**:
  1. Mapear espacialmente todos os bens protegidos através de coordenadas e polígonos georreferenciados (WGS 84 / EPSG:4326).
  2. Implementar proteção de segurança por design para coordenadas de sítios arqueológicos restritos.
  3. Digitalizar o processo de tombamento formal em consonância com a legislação estadual e os Livros de Tombo.
  4. Padronizar laudos de vistorias técnicas com catálogo estruturado de patologias e equipes.
  5. Oferecer repositório polimórfico de documentos e fotografias históricas com garantia de integridade criptográfica (SHA-256).

---

## 4. Partes Interessadas e Usuários (Perfis de Acesso)

| Perfil | Descrição e Papel no Sistema | Permissões Principais |
| :--- | :--- | :--- |
| **`ADMIN`** | Administradores da SECMA / Superintendentes de TI. | Gestão de usuários, configurações institucionais e permissões globais. |
| **`TECNICO`** | Arquitetos, engenheiros, historiadores e arqueólogos periciais. | Cadastro completo de bens, lançamento de vistorias, inclusão de patologias e consulta a dados arqueológicos restritos. |
| **`JURIDICO`** | Procuradores do Estado e assessores jurídicos setoriais. | Gestão de processos judiciais de preservação, embargos e movimentações processuais. |
| **`CONSULTOR`** | Pesquisadores e acadêmicos credenciados. | Consulta aprofundada de laudos técnicos e inventários (sem acesso a dados sigilosos). |
| **`LEITOR`** | Cidadãos, turistas e público geral. | Consulta pública de bens publicados, mapas de localização e resumos históricos. |

---

## 5. Limites do Escopo (Versão 1.0)

### O que está no escopo (In-Scope):
* Cadastro e gestão do ciclo de vida de bens culturais (Materiais, Imateriais e Arqueológicos).
* Geoprocessamento com PostGIS (pontos, polígonos e busca por raio de proximidade).
* Isolamento de segurança 1:1 de sítios arqueológicos confidenciais.
* Gestão de processos de tombamento legal e registros em Livro de Tombo.
* Agendamento, execução e homologação de vistorias com registro de patologias via JSONB.
* Catálogo de documentos e fotos com cálculo de hash SHA-256 e storage externo (zero-bytea).
* Linha do tempo de eventos e intervenções históricas no bem.
* Planos de salvaguarda com ações estruturadas para bens imateriais.
* Associação N:N entre ações judiciais de preservação e bens envolvidos.
* Trilha imutável de auditoria transacional.

### O que está fora do escopo inicial (Out-of-Scope):
* Aplicação móvel offline para vistorias em campo (planejada para v2.0).
* Assinatura digital com certificado ICP-Brasil em PDFs (planejada para v2.0).
* Integração direta via web service em tempo real com o PJe (Processo Judicial Eletrônico) do TJ-MA.

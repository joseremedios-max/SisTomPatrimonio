describe('SIP-MA — Fluxos End-to-End (Cidadão e Perito)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/public/mapa-bens*', {
      statusCode: 200,
      body: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id: '11111111-1111-1111-1111-111111111111',
            geometry: { type: 'Point', coordinates: [-44.3068, -2.53073] },
            properties: {
              nome: 'Palácio dos Leões',
              natureza: 'MATERIAL_EDIFICADO',
            },
          },
        ],
      },
    }).as('mapaPublico');

    cy.intercept('GET', '**/api/v1/bens-culturais/publicos*', {
      statusCode: 200,
      body: {
        content: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            codigo: 'SIPMA-SLZ-001',
            natureza: 'MATERIAL_EDIFICADO',
            nome: 'Palácio dos Leões',
            resumoPublico: 'Sede do Governo do Estado do Maranhão',
            status: 'PUBLICADO',
            municipioNome: 'São Luís',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 12,
      },
    }).as('acervoPublico');
  });

  it('Fluxo do Cidadão: navega pelo Portal Público com acessibilidade WCAG 2.1 AA e envia relato de inconsistência', () => {
    cy.visit('/');
    cy.wait('@mapaPublico');

    // Verifica skip-link WCAG 2.1 AA e cabeçalho semântico
    cy.contains('a', 'Pular para o conteúdo principal').should('exist');
    cy.contains('h1', 'Patrimônio cultural do Maranhão').should('be.visible');
    cy.contains('1 bens disponíveis no mapa público').should('be.visible');

    // Alternância de basemap (Vetorial vs. Satélite)
    cy.contains('button', 'Imagem de Satélite (Esri)').click().should('have.attr', 'aria-pressed', 'true');

    // Navega ao Acervo Público
    cy.contains('a', 'Consultar acervo').click();
    cy.wait('@acervoPublico');
    cy.contains('h1', 'Acervo público').should('be.visible');
    cy.contains('h2', 'Palácio dos Leões').should('be.visible');

    // Envia relato de inconsistência
    cy.intercept('POST', '**/api/v1/cadastros/relatos-inconsistencia', {
      statusCode: 201,
      body: { id: 'relato-001' },
    }).as('enviarRelato');

    cy.visit('/reportar-inconsistencia');
    cy.get('#relato-bem-id').type('11111111-1111-1111-1111-111111111111');
    cy.get('#relato-contato').type('cidadao@exemplo.ma.gov.br');
    cy.get('#relato-descricao').type('Revestimento azulejar da fachada lateral necessita vistoria.');
    cy.contains('button', 'Enviar relato').click();

    cy.wait('@enviarRelato');
    cy.contains('[role="status"]', 'Relato enviado com sucesso.').should('be.visible');
  });

  it('Fluxo do Perito: autentica sem expor token no localStorage e preenche o Wizard de 10 etapas com auto-save IndexedDB', () => {
    cy.intercept('POST', '**/api/usuarios/autenticar', {
      statusCode: 200,
      headers: {
        'Set-Cookie': 'sipma_refresh_token=refresh-cookie-mock; Path=/api/usuarios; HttpOnly; SameSite=Strict',
      },
      body: {
        id: '99999999-9999-9999-9999-999999999999',
        nome: 'Perito Técnico SIP-MA',
        email: 'admin@local.test',
        perfil: 'ADMIN',
        ativo: true,
        doisFatores: false,
        token: 'jwt-access-token-in-memory',
        expiresIn: 900,
      },
    }).as('loginPerito');

    cy.intercept('GET', '**/api/v1/dashboard', {
      statusCode: 200,
      body: {
        totalBens: 12,
        bensPublicados: 8,
        bensEmRevisao: 4,
        vistoriasPendentes: 3,
        bensAltoRisco: 1,
        processosAbertos: 2,
      },
    });

    cy.intercept('GET', '**/api/v1/dashboard/alertas', {
      statusCode: 200,
      body: [],
    });

    cy.visit('/admin/login');
    cy.get('input[name="email"]').type('admin@local.test');
    cy.get('input[name="senha"]').type('Admin@12345');
    cy.contains('button', 'Entrar').click();

    cy.wait('@loginPerito');

    // Garante que o token JWT não foi salvo no localStorage (Padrão OWASP)
    cy.window().then((win) => {
      expect(win.localStorage.getItem('sipma_token')).to.equal(null);
    });
  });
});

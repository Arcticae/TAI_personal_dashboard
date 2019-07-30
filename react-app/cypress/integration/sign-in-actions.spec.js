describe('App', () => {

    beforeEach( () => {
        cy.visit('http://localhost:3000/sign-in');
    });

    it('Renders with initial data', () => {
      cy.visit('http://localhost:3000');
    });

    it('Logging in', () => {
        cy.get('#username').type('asd');
        cy.get('#password').type('dsa');
        cy.get('[data-cy=submit]').click();
        cy.url().should('include', '/dashboard')
    })

    it('Incorrect email', () => {
        cy.get('#username').type('wrong-email');
        cy.get('[data-cy=submit]').click();
        cy.get('[data-cy=err]').should('contain', 'Incorrect mail or password');
    })

    it('Incorrect password', () => {
        cy.get('#username').type('asd');
        cy.get('#password').type('wrong');
        cy.get('[data-cy=submit]').click();
        cy.get('[data-cy=err]').should('contain', 'Incorrect mail or password');
    })

    it('Register failed', () => {
        cy.get('#username').type('asd');
        cy.get('#password').type('wrong');
        cy.get('[data-cy=register]').click();
        cy.get('[data-cy=regerr]').should('contain', 'This user already exists');
    })

    it('Invalid URL then click sign in button', () => {
        cy.visit('http://localhost:3000/wrong-url');
        cy.get('p').should('contain', '404');
        cy.get('[data-cy=signin]').click();
        cy.url().should('include', '/sign-in')
      });

  });
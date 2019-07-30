describe('App', () => {

    beforeEach( () => {
        cy.visit('http://localhost:3000/sign-in');
        cy.get('#username').type('asd');
        cy.get('#password').type('dsa');
        cy.get('.MuiButton-contained-79 > .MuiButton-label-69').click();
    });

    it('Reload page', () => {
        cy.visit('http://localhost:3000/dashboard');
      });

    it('Sign out', () => {
        cy.get('[data-cy=signout]').click();
        cy.url().should('include', '/sign-in')
      });

    it('Add and delete note', () => {
        cy.get('[data-cy=add]').click();
        cy.get('.MuiInputBase-input-157').type('note');
        cy.get('[data-cy=save]').click();
        cy.get('.MuiInputBase-input-157').should('contain', 'note');
        cy.get('[data-cy=edit]').click();
        cy.get('[data-cy=delete]').click();
        cy.get('[data-cy=confirm]').click();
        cy.get('p').should('contain', 'You have no memos');
    })

    it('Add and do not delete note', () => {
        cy.get('[data-cy=add]').click();
        cy.get('.MuiInputBase-input-157').type('note');
        cy.get('[data-cy=save]').click();
        cy.get('.MuiInputBase-input-157').should('contain', 'note');
        cy.get('[data-cy=edit]').click();
        cy.get('[data-cy=delete]').click();
        cy.get('[data-cy=cancel]').click();
        cy.get('.MuiInputBase-input-157').should('contain', 'note');
    })
    
  });
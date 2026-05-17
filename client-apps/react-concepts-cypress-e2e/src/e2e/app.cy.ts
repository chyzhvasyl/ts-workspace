describe('React App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page', () => {
    cy.contains('This is the generated root route.').should('be.visible');
  });

  it('should have navigation links', () => {
    cy.get('[role="navigation"]').within(() => {
      cy.contains('a', 'Home').should('be.visible');
      cy.contains('a', 'Page 2').should('be.visible');
    });
  });

  it('should navigate to page 2', () => {
    cy.get('[role="navigation"]').contains('a', 'Page 2').click();
    cy.contains('Click here to go back to root page.').should('be.visible');
  });
});

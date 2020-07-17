describe('The Home Page', () => {
  it('should visit the home page', () => {
    cy.visit(Cypress.config().baseUrl + '/')
  })
})

describe('Note app', function () {
  it('Front page can be opened', function () {
    cy.visit('http://localhost:5000');
    cy.contains('Note app');
  });
});

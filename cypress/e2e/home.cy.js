describe("Home Page", () => {
  it("carga la portada en modo E2E y permite navegar al portafolio", () => {
    cy.visit("/");

    cy.contains("h1", "Visualiza tus inversiones de forma clara, simple e interactiva.").should("be.visible");
    cy.contains("a", "Ir al portafolio").click();
    cy.url().should("include", "/portafolio");
    cy.contains("Dashboard del portafolio").should("be.visible");
  });
});

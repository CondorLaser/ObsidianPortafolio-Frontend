describe("Dashboard del portafolio", () => {
  it("carga el resumen del portafolio y permite navegar a vistas principales", () => {
    cy.visit("/portafolio");

    cy.contains("Dashboard del portafolio").should("be.visible");
    cy.contains("Valor total del portafolio").should("be.visible");
    cy.contains("Retorno no realizado").should("be.visible");
    cy.contains("Posiciones activas").should("be.visible");
    cy.contains("Cuentas vinculadas").should("be.visible");
    cy.contains("Evolución del portafolio").should("be.visible");
    cy.contains("Distribución y frescura").should("be.visible");
    cy.contains("Activos principales").should("be.visible");

    cy.contains("a", "Cuentas").click();
    cy.url().should("include", "/cuentas");
    cy.contains("h1", "Cuentas").should("be.visible");

    cy.contains("a", "Activos").click();
    cy.url().should("include", "/activos");
    cy.contains("h1", "Activos").should("be.visible");
  });
});

describe("Flujo de activos", () => {
  it("lista activos del portafolio y abre el detalle de un activo", () => {
    cy.visit("/activos");

    cy.contains("h1", "Activos").should("be.visible");
    cy.contains("Activos del portafolio").should("be.visible");
    cy.contains("Fintual USD").should("be.visible");
    cy.contains("Realty Income").should("be.visible");
    cy.contains("Halliburton").should("be.visible");

    cy.contains("a", "Realty Income").click();

    cy.url().should("include", "/activos/O");
    cy.contains("h1", "O").should("be.visible");
    cy.contains("Realty Income").should("be.visible");
    cy.contains("Detalle de activo").should("be.visible");
    cy.contains("Datos del usuario").should("be.visible");
    cy.contains("Métricas del activo").should("be.visible");
    cy.contains("Evolución del activo").should("be.visible");
    cy.contains("Acciones disponibles").should("be.visible");
  });

  it("permite llegar al detalle de activo desde el dashboard", () => {
    cy.visit("/portafolio");

    cy.contains("Activos principales").should("be.visible");
    cy.contains("a", "Ver detalle").first().click();

    cy.url().should("include", "/activos/");
    cy.contains("Detalle de activo").should("be.visible");
  });
});

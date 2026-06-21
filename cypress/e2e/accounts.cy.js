describe("Flujo de cuentas", () => {
  it("lista cuentas disponibles y abre el detalle de una cuenta", () => {
    cy.visit("/cuentas");

    cy.contains("h1", "Cuentas").should("be.visible");
    cy.contains("Selecciona una cuenta").should("be.visible");
    cy.contains("Fintual USD").should("be.visible");
    cy.contains("IBKR Trading").should("be.visible");

    cy.contains("a", "Fintual USD").click();

    cy.url().should("include", "/cuentas/");
    cy.contains("h1", "Cuenta: Fintual USD").should("be.visible");
    cy.contains("Último P&L Diario").should("be.visible");
    cy.contains("Métricas mensuales").should("be.visible");
    cy.contains("Evolución del P&L Diario").should("be.visible");
    cy.contains("Posiciones de la Cuenta").should("be.visible");
    cy.contains("Historial de Transacciones").should("be.visible");
    cy.contains("Historial de Dividendos").should("be.visible");
  });

  it("permite crear una cuenta nueva desde la vista de cuentas", () => {
    cy.visit("/cuentas");

    cy.contains("button", "Nueva cuenta").click();
    cy.contains("Crear cuenta de inversión").should("be.visible");

    cy.get('input[placeholder="Ej: Fintual Growth"]').type("Cuenta Demo CLP");
    cy.get('input[placeholder="Ej: Fintual"]').type("Broker Demo");
    cy.get("select").select("CLP");

    cy.contains("button", "Crear cuenta").click();

    cy.contains('Cuenta "Cuenta Demo CLP" creada correctamente.').should("be.visible");
    cy.contains("Cuenta Demo CLP").should("be.visible");
    cy.contains("Broker Demo").should("be.visible");
    cy.contains("CLP").should("be.visible");
  });
});

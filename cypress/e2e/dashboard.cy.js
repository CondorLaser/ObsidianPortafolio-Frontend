describe("Dashboard del portafolio", () => {
  beforeEach(() => {
    cy.visit("/portafolio")
  })

  it("muestra las secciones principales de la página", () => {
    cy.contains("Dashboard del portafolio").should("be.visible")
    cy.contains("Evolución del portafolio").should("be.visible")
    cy.contains("Distribución y frescura").should("be.visible")
  })

  it("permite navegar a Cuentas y Activos desde el sidebar", () => {
    cy.contains("a", "Cuentas").click()
    cy.url().should("include", "/cuentas")

    cy.go("back")

    cy.contains("a", "Activos").click()
    cy.url().should("include", "/activos")
  })
})
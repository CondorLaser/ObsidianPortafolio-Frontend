describe("Profile Page", () => {
  beforeEach(() => {
    // Navegar a la página de perfil
    cy.visit("/perfil");
  });

  it("Debería renderizar todos los componentes principales de la vista Perfil", () => {
    // Verificar que la página carga con el título + secciones principales
    cy.contains("Gestiona tus datos y preferencias").should("be.visible");
    cy.contains("Carga o actualiza tus datos").should("be.visible");
    cy.contains("Preferencias de Alertas").should("be.visible");
    cy.contains("Perfil de Riesgo").should("be.visible");
  });

  it("Debería mostrar componente YourDataCard", () => {
    // Verificar que YourDataCard está visible
    cy.contains("Carga o actualiza tus datos").should("be.visible");
    // Verificar que el contenido está colapsado inicialmente
    cy.contains("¿Dónde obtener mis Certificados").should("not.be.visible");
    // Expandir YourDataCard
    cy.contains("Carga o actualiza tus datos").click();
    // Verificar contenido específico de YourDataCard
    cy.contains("¿Dónde obtener mis Certificados?").should("be.visible");
    cy.contains("¿Qué certificados elegir?").should("be.visible");
    cy.contains("Cargar Certificado de Transacciones Acciones y ETFs (PDF)").should("be.visible");
    cy.contains("Cargar Certificado de Transacciones Fondos Mutuos (PDF)").should("be.visible");
  });

  it("Debería mostrar componente de YourPreferencesCard", () => {
    // Verificar que YourPreferencesCard está visible
    cy.contains("Preferencias de Alertas").should("be.visible");
    cy.contains(
      "Define los umbrales que activarán alertas automáticas sobre cambios importantes en tu portafolio"
    ).should("be.visible");
    // Verificar que los campos de preferencias están presentes
    cy.contains("Ganancia/Pérdida (P&L %) diaria por Cuenta").should("be.visible");
    cy.contains("Ganancia/Pérdida (P&L %) diaria por Activo").should("be.visible");
    cy.contains("Máximo drawdown del Portafolio").should("be.visible");
    cy.contains("Máximo drawdown por Cuenta").should("be.visible");
    cy.contains("Peso máximo por activo (Concentración)").should("be.visible");
    cy.contains("Exposición máxima por moneda (FX)").should("be.visible");
    // Verificar que los sliders asociados a las 6 categorías están presentes
    cy.get('input[type="range"]').should("have.length", 6);
    // Verificar que el botón de guardar está visible
    cy.contains("button", "Guardar preferencias").should("be.visible");
  });

  it("Debería mostrar componente YourRiskProfileCard", () => {
    // Verificar que YourRiskProfileCard está visible
    cy.contains("Perfil de Riesgo").should("be.visible");
    // Verificar que contiene elementos relacionados al perfil de riesgo
    // (Ajusta según el contenido real del componente)
    cy.get("h2, h3, p").then(($elements) => {
      // Verificar que hay contenido en la página
      expect($elements.length).to.be.greaterThan(0);
    });
    cy.contains("Conservador").should("be.visible");
    cy.contains("Moderado").should("be.visible");
    cy.contains("Agresivo").should("be.visible");
  });

  it("Should allow user to interact with preference sliders", () => {
    // Buscar los inputs de rango (sliders)
    cy.get('input[type="range"]').first().as("firstSlider");

    // Verificar que el slider tiene un valor inicial
    cy.get("@firstSlider").should("have.value");

    // Cambiar el valor del slider
    cy.get("@firstSlider").invoke("val", 50).trigger("change");

    // Verificar que el valor cambió
    cy.get("@firstSlider").should("have.value", "50");

    // Verificar que se muestra el nuevo valor
    cy.contains("50%").should("be.visible");
  });
});
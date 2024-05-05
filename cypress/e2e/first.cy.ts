import dayjs from "dayjs";

describe("Visiting homepage", () => {
  it("Visiting homepage - testing the disclaimer", () => {
    cy.visit("http://localhost:3000", {
      failOnStatusCode: false,
      timeout: 10000,
    });
    cy.contains("Today's Haikus");
    cy.contains("This website is a hobby project");
    cy.contains("Hide Disclaimer").click();
    cy.contains("This website is a hobby project").should("not.exist");
  });

  it("Testing the archive navigation", () => {
    cy.visit("http://localhost:3000", {
      failOnStatusCode: false,
      timeout: 10000,
    });

    // Click on the previous button - we should switch to the archive page
    cy.get("[data-cy=date-switcher-previous]").click();
    cy.url().should("include", "/archive");
    cy.contains("Haikus for");
    // Click on the next button - we should come back to the home page
    cy.get("[data-cy=date-switcher-next]").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});

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

  it("Visiting other pages - basic test", () => {
    cy.request({
      url: "http://localhost:3000/zorglub",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });

    cy.visit("http://localhost:3000/about", { failOnStatusCode: false });
    cy.contains("About this app");

    // TODO: Simulate login and logout with Clerk.js
    // in order to test the admin and MyHaikus pages
  });
});

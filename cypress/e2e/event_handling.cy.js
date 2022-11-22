beforeEach(() => {
  cy.visit("/test");
});

describe("event firing", () => {
  it("fires with value of 0 when thumbs down is clicked", async () => {
    const result = await new Cypress.Promise((resolve) => {
      cy.document().then((doc) => {
        doc.addEventListener("feedback:interaction", function (e) {
          return resolve(e.detail);
        });
      });

      cy.getComponentById("default")
        .find(".FeedbackBlock-button")
        .last()
        .click();
    });

    expect(result.value).to.equal(0);
  });

  it("fires with value of 1 when thumbs up is clicked", async () => {
    const result = await new Cypress.Promise((resolve) => {
      cy.document().then((doc) => {
        doc.addEventListener("feedback:interaction", function (e) {
          return resolve(e.detail);
        });
      });

      cy.getComponentById("default")
        .find(".FeedbackBlock-button")
        .first()
        .click();
    });

    expect(result.value).to.equal(1);
  });

  it.only("sends base data in event payload", async () => {
    const result = await new Cypress.Promise((resolve) => {
      cy.document().then((doc) => {
        doc.addEventListener("feedback:interaction", function (e) {
          return resolve(e.detail);
        });
      });

      cy.getComponentById("default")
        .find(".FeedbackBlock-button")
        .first()
        .click();
    });

    expect(result).to.have.property("instance");
    expect(result).to.have.property("value");
    expect(result.options).to.have.length(2);
    expect(result.options[0].label).to.equal("thumbs up");
    expect(result.options[0].value).to.equal(1);
    expect(result.options[1].label).to.equal("thumbs down");
    expect(result.options[1].value).to.equal(0);
  });

  it("sends data attribute value in event payload", async () => {
    const result = await new Cypress.Promise((resolve) => {
      cy.document().then((doc) => {
        doc.addEventListener("feedback:interaction", function (e) {
          return resolve(e.detail);
        });
      });

      cy.getComponentById("custom-data")
        .find(".FeedbackBlock-button")
        .first()
        .click();
    });

    expect(result).to.have.property("something", "some value!");
    expect(result).to.have.property("somethingElse", "some other value!");
  });
});

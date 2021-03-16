beforeEach(() => {
    cy.visit('/')
});

describe("event firing", () => {
    it("fires with value of 0 when thumbs down is clicked", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            cy.getComponentById('default')
                .find('.FeedbackBlock-button')
                .last()
                .click();
        });

        expect(result.value).to.equal(0);
    });

    it("fires with value of 1 when thumbs up is clicked", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            cy.getComponentById('default')
                .find('.FeedbackBlock-button')
                .first()
                .click();
        });

        expect(result.value).to.equal(1);
    });

    it("sends base data in event payload", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            cy.getComponentById('default')
                .find('.FeedbackBlock-button')
                .first()
                .click();
        });

        expect(result).to.have.property('instance');
        expect(result).to.have.property('value');
        expect(result.options).to.deep.eq([0, 1]);
    });

    it("sends data attribute value in event payload", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            cy.getComponentById('custom-data')
                .find('.FeedbackBlock-button')
                .first()
                .click();
        });

        expect(result).to.have.property('something', 'some value!')
        expect(result).to.have.property('somethingElse', 'some other value!')
    });
});

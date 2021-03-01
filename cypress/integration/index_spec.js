const getShadow = (id) => {
    return cy.get(`feedback-block#${id}`).shadow();
}

beforeEach(() => {
    cy.visit('http://localhost:5000')
});

describe("rendering", () => {
    it('shows default markup', () => {
        getShadow('default')
            .find('.FeedbackBlock-ctaText')
            .should(e => {
                const [ctaText] = e.get();
                expect(ctaText.textContent).to.contains('Was this helpful?');
            });

        getShadow('default')
            .find('.FeedbackBlock-button')
            .should(e => {
                expect(e.first().data('feedback-block-value')).to.equal(1);
                expect(e.last().data('feedback-block-value')).to.equal(0);
            });
    });

    it.only('respects custom slots', () => {
        getShadow('custom-slots')
            .find('.FeedbackBlock-ctaText')
            .should(e => {
                const [ctaText] = e.get();
                console.log(ctaText.slots);
                expect(ctaText.textContent).to.contains('Was this helpful?');
            });
    });
});

describe("event firing", () => {
    it("fires with value of 0 when thumbs down is clicked", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            getShadow('default')
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

            getShadow('default')
                .find('.FeedbackBlock-button')
                .first()
                .click();
        });

        expect(result.value).to.equal(1);
    });
});


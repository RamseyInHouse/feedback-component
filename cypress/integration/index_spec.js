const getComponent = (id) => {
    return cy.get(`feedback-block#${id}`);
}

beforeEach(() => {
    cy.visit('/')
});

describe("rendering", () => {
    it('shows default markup', () => {
        getComponent('default')
            .find('.FeedbackBlock-ctaText')
            .contains('Was this helpful?')

        getComponent('default')
            .find('.FeedbackBlock-button')
            .should(e => {
                expect(e.first().data('feedback-block-value')).to.equal(1);
                expect(e.last().data('feedback-block-value')).to.equal(0);
            });
    });

    it('respects custom slots', () => {
        getComponent('custom-slots')
            .find('.FeedbackBlock-ctaText')
            .should(e => {
                const [ctaText] = e.get();
                const [renderedSlot] = ctaText.querySelector('[name="cta"]').assignedNodes({ flatten: true });

                expect(renderedSlot.textContent).to.contains('Custom CTA!');
            });

        getComponent('custom-slots')
            .find('.FeedbackBlock-confirmationMessage')
            .should(e => {
                const [ctaText] = e.get();
                const [renderedSlot] = ctaText.querySelector('[name="confirmation"]').assignedNodes({ flatten: true });

                expect(renderedSlot.textContent).to.contains('Custom thank you!');
            });
    });

    // it.only('uses template slots when they exist', () => {
    //     document.body.insertAdjacentHTML('afterbegin', `
    //         <template id="feedback-block-defaults">
    //             <span slot="cta">Template CTA!</span>
    //         </template>
    //     `);
    // });
});

describe("event firing", () => {
    it("fires with value of 0 when thumbs down is clicked", async () => {
        const result = await new Cypress.Promise((resolve) => {
            cy.document().then((doc) => {
                doc.addEventListener('feedback:interaction', function (e) {
                    return resolve(e.detail);
                });
            });

            getComponent('default')
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

            getComponent('default')
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

            getComponent('default')
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

            getComponent('custom-data')
                .find('.FeedbackBlock-button')
                .first()
                .click();
        });

        expect(result).to.have.property('something', 'some value!')
        expect(result).to.have.property('somethingElse', 'some other value!')
    });
});

describe("UI changes upon interaction", () => {
    it("shows confirmation message after being clicked", () => {
        getComponent('default')
            .find('.FeedbackBlock-button')
            .last()
            .click();

        getComponent('default')
            .find('.FeedbackBlock-confirmationContent')
            .should('have.css', 'z-index', '1')
            .and('have.css', 'opacity', '1')
    });
});

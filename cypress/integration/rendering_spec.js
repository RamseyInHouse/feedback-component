beforeEach(() => {
    cy.visit('/')
});

describe("default rendering", () => {
    it('shows default markup', () => {
        cy.getComponentById('default')
            .find('.FeedbackBlock-ctaText')
            .contains('Was this helpful?')

        cy.getComponentById('default')
            .find('.FeedbackBlock-button')
            .should(e => {
                expect(e.first().data('feedback-component-value')).to.equal(1);
                expect(e.last().data('feedback-component-value')).to.equal(0);
            });
    });
});

describe("slot configuration", () => {
    it('respects custom slots', () => {
        cy.getComponentById('custom-slots')
            .find('.FeedbackBlock-ctaText')
            .should(e => {
                const [ctaText] = e.get();
                const [renderedSlot] = ctaText.querySelector('[name="cta"]').assignedNodes({ flatten: true });

                expect(renderedSlot.textContent).to.contains('Custom CTA!');
            });

        cy.getComponentById('custom-slots')
            .find('.FeedbackBlock-confirmationMessage')
            .should(e => {
                const [ctaText] = e.get();
                const [renderedSlot] = ctaText.querySelector('[name="confirmation"]').assignedNodes({ flatten: true });

                expect(renderedSlot.textContent).to.contains('Custom thank you!');
            });
    });
})

describe("fallback template configuration", () => {
    beforeEach(() => {
        cy.visit('/template-test');
    });
    
    it('allows CTA message to be overridden', () => {
        cy.getComponentById('template-fallbacks')
            .find('.FeedbackBlock-ctaText')
            .contains('Template CTA!')
    });

    it('allows button icons to be overridden', () => {
        cy.getComponentById('template-fallbacks')
            .find('[data-feedback-component-value="1"]')
            .contains('U')

        cy.getComponentById('template-fallbacks')
            .find('[data-feedback-component-value="2"]')
            .contains('D')
    });
})

describe("UI changes upon interaction", () => {
    it("shows confirmation message after being clicked", () => {
        cy.getComponentById('default')
            .find('.FeedbackBlock-button')
            .last()
            .click();

        cy.getComponentById('default')
            .find('.FeedbackBlock-confirmationContent')
            .should('have.css', 'z-index', '1')
            .and('have.css', 'opacity', '1')
    });
});

import css from "../dist/styles.css";
import { thumbsUp, thumbsDown } from "./icons";
import options from './options';
class FeedbackComponent extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.attachMarkup();
    this.attachListeners();
    this.attachStyles();
    this.maybeFallBackToTemplateSlots();
  }

  maybeFallBackToTemplateSlots() {
    return this.shadowRoot.querySelectorAll('slot').forEach(slot => {
      if (slot.assignedNodes().length) {
        return;
      };

      const templateElement = this.getTemplateContent(`[slot="${slot.name}"]`);

      if (!templateElement) {
        return;
      }

      slot.innerHTML = templateElement.outerHTML;
    });
  }

  /**
   * Attach listeners for when the user clicks to indicate feedback.
   *
   * @return { void }
   */
  attachListeners() {
    this.shadow
      .querySelectorAll("[data-feedback-block-value]")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const event = this.buildEvent({
            value: parseInt(e.currentTarget.dataset.feedbackBlockValue, 10),
          });

          this.dispatchEvent(event);
          this.showConfirmation();
        });
      });
  }

  /**
   * Display the confirmation message after feedback has been given.
   *
   * @return { void }
   */
  showConfirmation() {
    Object.assign(
      this.shadow.querySelector("[data-feedback-block-cta]").style,
      { zIndex: "-1", opacity: "0" }
    );
    Object.assign(
      this.shadow.querySelector("[data-feedback-block-confirmation]").style,
      { zIndex: "1", opacity: "1" }
    );
  }

  getTemplateContent(selector) {
    const content = document.getElementById('feedback-block-defaults')?.content;

    if (!content) {
      return null;
    }

    return content.querySelector(selector);
  }

  /**
   * Build the initial HTML for the component.
   *
   * @return {void}
   */
  attachMarkup() {
    this.shadow.innerHTML = `
      <div class="FeedbackBlock">
        <div class="FeedbackBlock-content" data-feedback-block-cta>
          <span class="FeedbackBlock-ctaText">
            <slot name="cta">
              Was this helpful?
            </slot>
          </span>

          <ul class="FeedbackBlock-options">
            ${this.buildOptionMarkup()}
          </ul>
        </div>

        <div 
          class="FeedbackBlock-content FeedbackBlock-confirmationContent" 
          data-feedback-block-confirmation
        >
          <span class="FeedbackBlock-confirmationMessage">
            <slot name="confirmation">
              Thanks for your feedback!
            </slot>
          </span>
        </div>
      </div>
    `;
  }

  buildOptionMarkup() {
    return options.reduce((accumulation, option, index) => {
      return accumulation + `
        <li class="FeedbackBlock-option">
          <button
            class="FeedbackBlock-button"
            data-feedback-block-value="${option.value}"
            aria-label="${option.label}"
          >
            <slot name="option-icon:${index + 1}">
              <i>
                ${option.icon}
              </i>
            </slot>
          </button>
        </li>
      `
    }, "");
  }

  /**
   * Given custom payload data, trigger an event indicating feedback has been given.
   *
   * @param {object} data Custom data to be sent with custom event
   * @returns {CustomEvent} Custom event for a feedback interaction
   */
  buildEvent(data) {
    return new CustomEvent("feedback:interaction", {
      bubbles: true,
      detail: {
        ...this.dataset,
        ...data,
        options: [0, 1],
        instance: this,
      },
    });
  }

  /**
   * Set the styles for the block. This must happen for each instance of the block, since global styles cannot penetrate the shadow DOM.
   *
   * https://css-tricks.com/styling-a-web-component/
   *
   * @return { void }
   */
  attachStyles() {
    // Needed for laying out the option grid.
    this.style.setProperty("--feedback-block-option-count", options.length);

    const styleBlock = document.createElement("style");
    styleBlock.appendChild(document.createTextNode(css));
    this.shadow.prepend(styleBlock);
  }
}

if (!window.customElements.get("feedback-block")) {
  window.customElements.define("feedback-block", FeedbackComponent);
}

export default FeedbackComponent;

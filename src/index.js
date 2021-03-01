import css from "../dist/styles.css";
import { thumbsUp, thumbsDown } from "./icons";

class FeedbackComponent extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.attachMarkup();
    this.attachListeners();
    this.attachStyles();
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

          <div class="FeedbackBlock-actions">
            <button
              class="FeedbackBlock-button"
              data-feedback-block-value="1"
              aria-label="thumbs up"
            >
              <i>
                ${thumbsUp}
              </i>
            </button>

            <button
              class="FeedbackBlock-button"
              data-feedback-block-value="0"
              aria-label="thumbs down"
            >
              <i>
                ${thumbsDown}
              </i>
            </button>
          </div>
        </div>

        <div class="FeedbackBlock-content FeedbackBlock-confirmationContent" data-feedback-block-confirmation>
          <span class="FeedbackBlock-confirmationMessage">
            <slot name="confirmation">
              Thanks for your feedback!
            </slot>
          </span>
        </div>
      </div>
    `;
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
    const styleBlock = document.createElement("style");
    styleBlock.appendChild(document.createTextNode(css));
    this.shadow.prepend(styleBlock);
  }
}

if (!window.customElements.get("feedback-block")) {
  window.customElements.define("feedback-block", FeedbackComponent);
}

export default FeedbackComponent;

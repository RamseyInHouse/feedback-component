/* eslint-disable no-undef */

import { getByLabelText } from "@testing-library/dom";
import "./index";

const getShadowRoot = () => {
  return document.body.getElementsByTagName("feedback-block")[0].shadowRoot;
};

describe("FeedbackComponent", () => {
  beforeEach(() => {
    window.document.body.innerHTML = `<feedback-block data-element-id="my-element-id"></feedback-block>`;
  });

  it("shows confirmation message after interaction", async () => {
    const thumbsUpButton = getByLabelText(getShadowRoot(), "thumbs up");
    const confirmationContainer = getShadowRoot().querySelector(
      "[data-feedback-block-confirmation]"
    );

    thumbsUpButton.click();

    process.nextTick(() => {
      expect(confirmationContainer).toHaveStyle({
        zIndex: "1",
        opacity: "1",
      });
    });
  });

  it("fires feedback:interaction event with data set as attributes", async () => {
    const thumbsUpButton = getByLabelText(getShadowRoot(), "thumbs up");
    await new Promise((resolve) => {
      const callback = (e) => {
        expect(e.detail).toMatchObject({
          elementId: "my-element-id",
          options: [0, 1],
          value: 1,
        });

        removeEventListener("feedback:interaction", callback);
        resolve();
      };

      addEventListener("feedback:interaction", callback);

      thumbsUpButton.click();
    });
  });
});

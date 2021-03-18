class TemplateConfig {
    constructor() {
        this.template = document.getElementById('feedback-component-config');
    }

    /**
     * Return the data attached to the config template tag.
     *
     * @returns {object}
     */
    getData() {
        return this.template?.dataset || {};
    }

    /**
     * Retrieve the content of a particular element within the config `template` element.
     * 
     * @param {string} selector 
     * @returns {null | string}
     */
    getContent(selector) {
        const content = this.template?.content;

        if (!content) {
            return null;
        }

        return content.querySelector(selector);
    }
}

export default TemplateConfig;

# Feedback Web Component

[![npm version](https://badge.fury.io/js/%40ramseyinhouse%2Ffeedback-component.svg)](https://badge.fury.io/js/%40ramseyinhouse%2Ffeedback-component)

A custom element for collecting quick, binary user feedback on specific pieces of a page.

<p align="center">
  <img src="./demo.gif" alt="" />
</p>

## Installation

```bash
npm install @ramseyinhouse/feedback-component
```

## Usage

### Basic Usage

Place the `feedback-component` element on a page and load the script. By default, the block will render with the text "Was this helpful?" along with thumb icons a user can click to indicate positive or negative. After collecting this feedback, a generic "Thanks for your feedback!" message is displayed.

```html
<html>
  <head></head>
  <body>
    <feedback-component></feedback-component>

    <script type="module" src="./dist/feedback-component.js"></script>
  </body>
</html>
```

In order to handle the feedback, set up an event listener to watch for a "feedback:interaction" custom event. You can learn more about that event and what it contains by heading to [Handling Feedback Data](#handling-feedback-data).

### Overriding Content

There are two slot-driven approaches that will allow you to set custom content for your component.

#### Local Slots

You can override the messaging by passing `cta` and `confirmation` slots to the component:

```html
<feedback-component>
  <span slot="cta">This is a custom CTA message.</span>
  <span slot="confirmation">This is a custom confirmation message.</span>
</feedback-component>
```

The icons themselves can be overridden by specifying `option-icon:OPTION_INDEX` slots:

```html
<feedback-component>
  <span slot="option-icon:0">
    <svg><!-- A custom "thumbs down" icon --></svg>
  </span>
  <span slot="option-icon:1">
    <svg><!-- A custom "thumbs up" icon --></svg>
  </span>
</feedback-component>
```

#### Global Template Slots

If you'd like to customize the contents of every feedback component instance in one place, you can do so within a `<template id="feedback-component-config">` element.

```html
<template id="feedback-component-config">
  <span slot="cta">This is a custom CTA message.</span>
  <span slot="confirmation">This is a custom confirmation message.</span>
</template>

<feedback-component></feedback-component>
<feedback-component></feedback-component>
<feedback-component></feedback-component>
```

### Passing Custom Data

Any `data-*` attributes placed on the element will be passed through to the event that is triggered when a user interacts with the component. For example, the data object returned for the markup below will include `blockId` and `version` properties with respective data. For more on how this payload looks, see [Logging Data](#logging-data) below.

```html
<feedback-component data-block-id="transaction_map" data-version="2">
</feedback-component>
```

## Handling Feedback Data

By default, the component doesn't communicate with any external services. Instead, it sends a custom `feedback:interaction` event to which the consuming application can listen and handle as appropriate. The `detail` property of that event will contain the value of the feedback, as well as other useful information.

```javascript
document.addEventListener("feedback:interaction", function (e) {
  console.log(e.detail);
});
```

### Payload Structure

The `detail` attribute of the `feedback:interaction` event will contain an object with three default properties.

#### `value` (`Number`)

The numerical value of of the interaction. This can be handled as needed by the consuming application. For example, specific integers could be mapped to other values (like strings) to be sent to a data logging service.

#### `instance` (`feedback-block`)

The instance of the element. This may be useful if you need access to the markup rendered by the component whenever an interaction is made, or for any other potential need.

#### `options` (`Array`)

An `Array` of all the the possible options from which a user could choose. Each option is structured as such:

```javascript
{
  label: "thumbs up",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>`,
  value: 1
}
```

### Passing Custom Data

If you'd like access to any arbitrary data when feedback is given, data attributes can be attached to the element. They'll be automatically made available within the `event.detail` object. For example, this markup...

```html
<feedback-component
  data-version="1.0"
  data-component-label="my component!"
></feedback-component>
```

...would yield the following `event.detail` object:

```javascript
{
  version: "1.0",
  componentLabel: "my component!",
  value: 1,
  options: [OptionObject, OptionObject],
  instance: FeedbackComponent
}
```

You can also use a global `<template>` tag to set these attributes. If any local attributes exist on the components themselves, these will be overridden.

```
<template
  id="feedback-component-config"
  data-component-label="my component!"
  data-version="1.0"
></template>
```

## Styling

The component is packaged with base styles, which can be adjusted as seen fit by modifying CSS custom properties:
| Syntax | Description | Default Value |
| ----------- | ----------- | --------------- |
| `--feedback-component-button-background-color` | Background color of each option button. | #e8eced
| `--feedback-component-button-size` | Width & height of each option button. | 2rem
| `--feedback-component-icon-color` | Color of the icon within each option button. | #69757a
| `--feedback-component-icon-size` | Width & height of each option button. | 1rem
| `--feedback-component-font-color` | Font color for the component's text. | #69757a
| `--feedback-component-font-family` | Font family for the component's text. | Arial, sans-serif
| `--feedback-component-font-size` | Font size for the component's text. | 1.125rem
| `--feedback-component-font-style` | Font style for the component's text. | normal
| `--feedback-component-font-variant` | Font variant for the component's text. | normal
| `--feedback-component-font-weight` | Font weight for the component's text. | 400
| `--feedback-component-line-height` | Line height for the component's text. | normal

## Browser Support

This component is only supported by [modern browsers](https://caniuse.com/custom-elementsv1). To prevent breaking functionality in older browsers (like Internet Explorer), always load the component's source via a script tag that has a `type="module"` attribute, as noted above.

## New Releases

Submit pull request with your change. In a separate commit, please make the appropriate [SemVer](https://semver.org/) version bump in the `package.json` file. Once approved and merged, a new release will be published to npm automatically.

## Attribution

**Icons** - Base icons came from [Heroicons](https://heroicons.com/).

# Feedback Web Component

This web component is designed to collect quick feedback from fans regarding specific components of a page. To start, it supports capturing feedback as "thumbs up" or "thumbs down," but may be extended to support other mechanisms as well.

## Usage

### Setup & Configuration

Place the `feedback-block` element on a page and load the script with a `type="module"` attribute applied. By default, the block will render with "Was this helpful?", thumbs icons, and a generic confirmation message displayed after feedback is collected.

```html
<feedback-block></feedback-block>

<script type="module" src="./dist/feedback-block.min.modern.js"></script>
```

You can also override the messaging by passing `cta` and `confirmation` slots to the component:

```html
<feedback-block>
  <span slot="cta">Is this section <strong>helpful?</strong></span>
  <span slot="confirmation">Thanks for the feedback!</span>
</feedback-block>

<script type="module" src="./dist/feedback-block.min.modern.js"></script>
```

### Passing Through Data

Any `data-*` attributes placed on the element will be passed through to the event that is triggered when a user interacts with the component. For example, the data object returned for the markup below will include `blockId` and `version` attributes with respective data. For more on how this payload looks, see [Logging Data](#logging-data) below.

```html
<feedback-block
  data-block-id="transaction_map"
  data-version="2"
>
</feedback-block>
```

## Logging Data

### Capturing Interaction Events

By default, the component doesn't log to anything to external services. Instead, it sends a custom `feedback:interaction` event to which the consuming application can listen and handle as appropriate.

```javascript
document.addEventListener('feedback:interaction', function (e) {
  console.log(e.detail);
});
```

### Payload Structure

The `detail` attribute of the `feedback:interaction` event will contain an object with three default properties.

#### `value` (number)

The numerical value of of the interaction. This can be handled as needed by the consuming application. For example, specific integers could be mapped to other values (like strings) to be sent to a data logging service.
#### `shadowRoot` (DocumentFragment)

The `DocumentFragment` of the element. This may be useful if you need access to the markup rendered by the component whenever an interaction is made.

#### `options` (array)

An array of all the possible values from which a user could choose. In the future, consuming applications may find this useful when the value is only meaningful when in a certain context of other options. For example, a `3` is strong, positive feedback if there are only three options, but if there are ten, it isn't.

```javascript
{
  value: 1,
  options: [0, 1],
  shadowRoot: DocumentFragment
}
```

#### Custom Attributes

As mentioned, when custom data attributes are applied to the component, those are passed through to this object as well. Using the [example given above](#passing-through-data), the full `event.detail` object would look something like this:

```javascript
{
  version: "2",
  blockId: "transaction_map",
  value: 1,
  options: [0, 1],
  shadowRoot: DocumentFragment
}
```

## Browser Support

This component is only supported by [modern browsers](https://caniuse.com/custom-elementsv1). To prevent it from breaking functionality on older browsers (like Internet Explorer), always load the component's source via a script tag that has a `type="module"` attribute, as noted above.

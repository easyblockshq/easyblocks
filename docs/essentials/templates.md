# Templates

Whenever you add a new No-Code Component to `Config.components` the end-users can start adding its instances to a canvas. It's done via a template picker that is displayed after user clicks on a plus button or a blue placeholder.

The template picker shows a list of templates allowed in this particular slot (defined by a schema property of type `component` or `component-collection`). Under the hood each template is represented by a very simple object:&#x20;

```typescript
{
    id: "template_1", // unique id
    label: "My Super Template", // label displayed in UI (optional)
    thumbnail: thumbnail_url // URL to the thumbnail image (optional)
    entry: { ... } // no-code entry
}
```

All the available templates are stored in a `Config.templates` array.

When you add a new component to `Config.components` and don't specify any templates for this component, Easyblocks will create a single default template and set all the values to the default ones. Whenever you specify at least a one template in `Config.templates` for your component, the default template will be gone.

{% hint style="info" %}
The template picker always displays only the templates for components that allowed by `accepts` field of the parent component (in parent component's `component` or `component-collection` schema property).&#x20;
{% endhint %}

### Working with templates

The best way to work with templates is as follows:

1. Add a default template of your component to the canvas. Beware, it usually looks very bad.
2. Use Easyblocks Editor to make it look good.
3. Click 5 times on a header bar (it unlocks "developer mode").
4. Select your component instance, click "Copy entry" at the bottom of the sidebar. You just copied the No-Code Entry of your new component.
5. Add a new template to the `Config.templates` and paste the entry to the `entry` property of your template.

The best way to understand how it all works is too see the video:

{% embed url="https://vimeo.com/908194117?share=copy" %}

### Template picker types

There are 3 built-in template picker widgets available in Easyblocks:

- `large` - 2 cards in a row, good for sections
- `large-3` - 3 cards in a row, good for cards
- `compact` (default) - good for smaller items like stack elements, buttons, etc.

The picker widget can be set as a part of `component` or `component-collection` schema property:

```typescript
const componentDefinition = {
  // ...
  schema: [
    // ...
    {
      prop: "Card1",
      type: "component",
      required: false,
      picker: "large-3", // picker property allows for changing picker widget
    },
  ],
};
```

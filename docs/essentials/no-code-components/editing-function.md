# editing function

Each definition could define additional `editing` method. This method is responsible for a few things:

- showing/hiding fields displayed in the sidebar
- disabling selection of its own subcomponents (`component` or `component-collection`)
- changing direction in which blue plus buttons are shown when adding items to `component-collection` field
- fields passing - certain fields from parent component can be displayed when child component is selected

Let's look at the `SimpleBanner` `editing` function:

```typescript
import { NoCodeComponentDefinition } from "@easyblocks/core";

export const simpleBannerDefinition: NoCodeComponentDefinition = {
  // ...
  editing: ({ values, editingInfo }) => {
    return {
      components: {
        Buttons: values.Buttons.map(() => ({
          direction: "horizontal",
        })),
        Title: {
          fields: [
            {
              ...editingInfo.fields.find((field) => field.path === "gap")!,
              label: "Bottom gap",
            },
          ],
        },
      },
    };
  },
};
```

The most important input argument is editing info (`editingInfo`). It has the information about fields visibility, labels, grouping and subcomponents editing behaviour (is nested selection allowed, plus button direction, passed fields, etc). Here's the input `editingInfo` for our `SimpleBanner`:

```typescript
{
    "fields": [
        {
            "path": "backgroundColor",
            "type": "field",
            "visible": true,
            "group": "Properties",
            "label": "Background Color"
        },
        {
            "path": "hasBorder",
            "type": "field",
            "visible": true,
            "group": "Properties",
            "label": "Has Border?"
        },
        {
            "path": "padding",
            "type": "field",
            "visible": true,
            "group": "Properties",
            "label": "Pading"
        },
        {
            "path": "gap",
            "type": "field",
            "visible": true,
            "group": "Properties",
            "label": "Gap"
        },
        {
            "path": "buttonsGap",
            "type": "field",
            "visible": true,
            "group": "Properties",
            "label": "Buttons gap"
        },
        {
            "path": "Title",
            "type": "field",
            "visible": false,
            "group": "Properties",
            "label": "Title"
        }
    ],
    "components": {
        "Title": {
            "fields": []
        },
        "Buttons": []
    }
}
```

Whenever you need to make changes in a default editing info, just use `editing` function and return your modified editing info from it.

The `editing` function of the `SimpleBanner` does 2 things:

1. Sets `direction: "horizontal"` for each child Button instance. The default value is `vertical` (arrows would display at the top and bottom edge of selection frame).
2. Passes the `gap` property to the `Title` while changing the `label` to `Bottom margin`. It means that the same property `(gap)` is editable by a parent's `Gap` field and by `Bottom margin` field when title is selected.

#### Changing fields visibility

Also you can modify `visible` flag to show and hide fields. You can do it based on input `values` and `params` which unlocks a lot of customisation.

#### Disabling selection of child components

Sometimes you might want to disable nested selection of child components. You can do it by setting `selectable: false` for a child component:

```typescript
import { NoCodeComponentDefinition } from "@easyblocks/core";

export const simpleBannerDefinition: NoCodeComponentDefinition = {
  // ...
  editing: ({ values, editingInfo }) => {
    return {
      components: {
        Title: {
          selectable: false,
        },
      },
    };
  },
};
```

Of course disabling selection makes it impossible to change the properties of the child component. However, you still might allow for it from the sidebar by setting `Title` field to `visible: true` (by default all the subcomponents are not visible in the sidebar).

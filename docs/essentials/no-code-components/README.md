# No-Code Components

No-Code Component is the main building block of Easyblocks. Each selectable element added to the editor canvas is an instance of a No-Code Component.

Each No-Code Component consists of 2 parts:

- React Component - a standard React component
- No-Code Component Definition - an object that defines visual editing capabilities of the component&#x20;

Here's an example of a simple `SimpleBanner` No-Code Component (you can find it in our [example page builder demo](https://github.com/easyblockshq/page-builder-demo/blob/main/src/app/easyblocks/components/SimpleBanner/SimpleBanner.definition.ts)):

<pre class="language-tsx"><code class="lang-tsx">// No-Code Component Definition

import { NoCodeComponentDefinition } from "@easyblocks/core";

<strong>export const simpleBannerDefinition: NoCodeComponentDefinition = {
</strong>  id: "SimpleBanner",
  label: "SimpleBanner",
  type: "section",
  schema: [
    {
      prop: "backgroundColor",
      label: "Background Color",
      type: "color"
    },
    {
      prop: "hasBorder",
      label: "Has Border?",
      type: "boolean",
      responsive: true
    },
    {
      prop: "padding",
      label: "Pading",
      type: "space"
    },
    {
      prop: "gap",
      label: "Gap",
      type: "space"
    },
    {
      prop: "buttonsGap",
      label: "Buttons gap",
      type: "space"
    },
    {
      prop: "Title",
      type: "component",
      required: true,
      accepts: ["@easyblocks/text"]
    },
    {
      prop: "Buttons",
      type: "component-collection",
      accepts: ["Button"],
      placeholderAppearance: {
        height: 36,
        width: 100,
        label: "Add button" 
      }
    }
  ],
  styles: ({ values }) => {
    return {
      styled: {
        Root: {
          backgroundColor: values.backgroundColor,
          border: values.hasBorder ? "2px solid black" : "none",
          padding: values.padding
        },
        Wrapper: {
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: values.gap
        },
        ButtonsWrapper: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: values.buttonsGap
        }
      }
    }
  },
  editing: ({ values, editingInfo}) => {
    return {
      components: {
        Buttons: values.Buttons.map(() => ({
          direction: "horizontal",
        })),
        Title: {
          fields: [
            {
              ...editingInfo.fields.find(field => field.path === "gap")!,
              label: "Bottom gap"
            }
          ]
        }
      },
    };
  },
};

// Component code

import { ReactElement } from "react";

type SimpleBannerProps = {
  Root: ReactElement;
  Title: ReactElement;
  Wrapper: ReactElement;
  Buttons: ReactElement[];
  ButtonsWrapper: ReactElement
}

export function SimpleBanner(props: SimpleBannerProps) {
  const { Root, Title, Wrapper, Buttons, ButtonsWrapper } = props;

  return (
    &#x3C;Root.type {...Root.props}>
      &#x3C;Wrapper.type {...Wrapper.props}>
        &#x3C;Title.type {...Title.props} />
        &#x3C;ButtonsWrapper.type {...ButtonsWrapper.props}>
          {Buttons.map((Button, index) => &#x3C;Button.type {...Button.props} key={index} />)}
        &#x3C;/ButtonsWrapper.type>
      &#x3C;/Wrapper.type>
    &#x3C;/Root.type>
  )
}
</code></pre>

In order to use this component two things must happen. First, you must add the definition to the [Config.components](../configuration.md#components) property:

```typescript
// easyblocks.config.ts

export const easyblocksConfig = {
  components: {
    // ...other component definitions,
    simpleSectionDefinition,
  },
};
```

The component instance must be passed to the `components` property of the [`EasyblocksEditor`](../editor-page.md):

```tsx
<EasyblocksEditor
  config={easyblocksConfig}
  components={{ ...otherComponents, SimpleSection }}
/>
```

Now the component can be used.

Each No-Code Component must have a unique `id`. You can optionally add a `label` and `thumbnail` to display the component nicely in the UI.

Apart from those basic properties, the most important ones are `schema`, `styles` and `editing`. We'll explain them in the next sections.

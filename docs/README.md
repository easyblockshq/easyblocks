---
description: Welcome to Easyblocks - an open-source visual builder framework.
---

# Introduction

Easyblocks is an open-source React toolkit (white-label editor + framework) for building **completely customised** visual page builders.

It can help you build intuitive visual editors like those in [Shopify](https://shopify.dev/docs/themes/tools/online-editor) (for e-commerce), [Mailchimp](https://mailchimp.com/features/landing-pages/) (landing pages), [Splash](https://splashthat.com/platform/design) (event pages) or [Carrd](https://carrd.co/) (one pagers). It can handle any visual building experience that outputs HTML/CSS or a React component tree - from landing pages to dashboards.

Easyblocks can handle such a wide range of seemingly different visual experiences thanks to a very clear separation between what's common for all visual builders and what's custom and project-specific. The Easyblocks editor knows how to handle common visual builder logic (drag\&drop, nested selections, inline rich text, responsive styling fields, etc), but at the same time doesn't know anything about project-specific things like your [components](essentials/no-code-components/), [data sources](essentials/external-data.md) or [templates](essentials/templates.md). Project-specific stuff can be defined with code using Easyblocks framework, which is based on a novel concept called [No-Code Components.](essentials/no-code-components/)

### Live demo

Visit [https://easyblocks-demo.vercel.app/](https://easyblocks-demo.vercel.app/) to try the editor demo.

### Video explainer

Easyblocks explained in less than 10 minutes:

{% embed url="https://www.youtube.com/watch?v=iNVVb_snEiI" %}

### Main Features

- **Out-of-the-box visual building logic**: drag\&drop, nested selections, inline rich text, multi-selection, styling fields (responsive), design tokens, history management, localisation, templates, dynamic data
- **Simple for end-users.** Not based on HTML/CSS but on [No-Code Components](./#no-code-components).
- **Bring your own components and templates**. You decide what [components](./#no-code-components) are available, their variants, styling options, simplicity levels, children components, constraints, etc.
- [**Bring your own data**](./#external-and-dynamic-data)**.** Connect any data source, fully control data fetching and data picker widget. The data can be dynamic. For example, you can connect texts or images from data sources in the editor.
- **Server-side rendering.** Fully compatible with modern frameworks like next.js or Remix, but can also render to pure HTML/CSS. All the heavy lifting happens on the server - no browser rendering and layout shifts.

### Why?

If you need a custom text editor there are so many solutions available: Slate, Lexical, TinyMCE, CKEditor, etc. But if you need a custom page builder there's a huge chance you must build one from scratch. And it’s an awfully expensive and tedious process.

The goal behind Easyblocks is to make it possible to create truly state-of-the-art visual page building experiences in weeks instead of years, without compromising flexibility.

{% hint style="info" %}
Off-the-shelf OSS builders like [Grape](https://grapesjs.com/) or [Webstudio](https://webstudio.is/) are based on HTML/CSS (they have a panel with HTML nodes on the left and CSS properties on the right). HTML/CSS is very powerful indeed but for many use cases it's too unconstrained and too hard to use for non-technical users. At Easyblocks we dropped HTML/CSS in favour of [No-Code Components.](./#no-code-components)
{% endhint %}

## Main concepts

### No-Code Components

Each selectable element added to an Easyblocks editor canvas must be a No-Code Component. No-Code Component is a standard React component but extended with a so called "No-Code Component Definition", a special object that makes this component visually editable. In a No-Code Component Definition you can set data properties, styling properties or children components slots available in the visual editor when the component is selected. Such architecture allows developers to build visually editable components while keeping full control over what should and should not be customisable for end-users.

Below we're showing a code of a very simple No-Code Component: `SimpleBanner`:

```tsx
// No-Code Component Definition

import { NoCodeComponentDefinition } from "@easyblocks/core";

export const simpleBannerDefinition: NoCodeComponentDefinition = {
  id: "SimpleBanner",
  label: "SimpleBanner",
  type: "section",
  schema: [
    {
      prop: "backgroundColor",
      label: "Background Color",
      type: "color",
    },
    {
      prop: "hasBorder",
      label: "Has Border?",
      type: "boolean",
      responsive: true,
    },
    {
      prop: "padding",
      label: "Pading",
      type: "space",
    },
    {
      prop: "gap",
      label: "Gap",
      type: "space",
    },
    {
      prop: "buttonsGap",
      label: "Buttons gap",
      type: "space",
    },
    {
      prop: "Title",
      type: "component",
      required: true,
      accepts: ["@easyblocks/text"],
    },
    {
      prop: "Buttons",
      type: "component-collection",
      accepts: ["Button"],
      placeholderAppearance: {
        height: 36,
        width: 100,
        label: "Add button",
      },
    },
  ],
  styles: ({ values }) => {
    return {
      styled: {
        Root: {
          backgroundColor: values.backgroundColor,
          border: values.hasBorder ? "2px solid black" : "none",
          padding: values.padding,
        },
        Wrapper: {
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: values.gap,
        },
        ButtonsWrapper: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: values.buttonsGap,
        },
      },
    };
  },
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

// Component code

import { ReactElement } from "react";

type SimpleBannerProps = {
  Root: ReactElement;
  Title: ReactElement;
  Wrapper: ReactElement;
  Buttons: ReactElement[];
  ButtonsWrapper: ReactElement;
};

export function SimpleBanner(props: SimpleBannerProps) {
  const { Root, Title, Wrapper, Buttons, ButtonsWrapper } = props;

  return (
    <Root.type {...Root.props}>
      <Wrapper.type {...Wrapper.props}>
        <Title.type {...Title.props} />
        <ButtonsWrapper.type {...ButtonsWrapper.props}>
          {Buttons.map((Button, index) => (
            <Button.type {...Button.props} key={index} />
          ))}
        </ButtonsWrapper.type>
      </Wrapper.type>
    </Root.type>
  );
}
```

To learn more, continue with [No-Code Components](essentials/no-code-components/) guide.

### External and dynamic data

When you build a custom visual builder you usually want to connect it to the data that is specific to your product. Easyblocks allows for a full control over external data:

- connect any external data sources, create custom widgets and fetching functions
- connect dynamic data to text fields, images, videos, etc

Please read [External Data section](broken-reference) to learn more.

## Contact

We'd love to hear your questions, issues or feedback! You can contact us by [email](mailto:andrzej@easyblocks.io), on [X/Twitter](https://twitter.com/ardabrowski), or on [Github](https://github.com/easyblockshq/easyblocks).

#### Custom license & services

In case AGPL3.0 license is too strict we can offer you a custom license. We can also help you with custom services. Let us know via [email](mailto:andrzej@easyblocks.io).

## Project history

Under the hood it's a spin-off from [Shopstory](https://shopstory.app) - a visual builder for headless CMSes that drives millions of page views for e-commerce brands like [Ace\&Tate](https://aceandtate.com) or [Tekla Fabrics](https://teklafabrics.com/). Here's a quick video of Shopstory working inside of Sanity CMS:

{% embed url="https://vimeo.com/821580462" %}
Shopstory (Easyblocks-based) + Sanity CMS
{% endembed %}

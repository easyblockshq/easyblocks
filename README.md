# Easyblocks

Easyblocks is an open-source React toolkit (white-label editor + framework) for building completely customised visual page builders.

It can help you build intuitive visual editors like those in [Shopify](https://shopify.dev/docs/themes/tools/online-editor) (for e-commerce), [Mailchimp](https://mailchimp.com/features/landing-pages/) (landing pages), [Splash](https://splashthat.com/platform/design) (event pages) or [Carrd](https://carrd.co/) (one pagers). It can handle any visual building experience that outputs HTML/CSS or a React component tree - from landing pages to dashboards.

### Live demo

Visit [https://easyblocks-demo.vercel.app/](https://easyblocks-demo.vercel.app/) to try the editor demo.

### Docs

Please visit [https://docs.easyblocks.io/](https://docs.easyblocks.io/) to learn Easyblocks.

### Video explainer

Watch the video below to learn about Easyblocks in less than 10 minutes:

[![Screenshot-2024-02-12-at-15-08-51.png](https://i.postimg.cc/tTYqBNxN/Screenshot-2024-02-12-at-15-08-51.png)](https://www.youtube.com/watch?v=iNVVb_snEiI)

## Main features

- **Out-of-the-box visual building logic**: drag&drop, nested selections, inline rich text, multi-selection, styling fields (responsive), design tokens, history management, localisation, templates, dynamic data
- **Simple for end-users**. Not based on HTML/CSS but on [No-Code Components](https://docs.easyblocks.io/essentials/no-code-components).
- **Bring your own components and templates**. You decide what components are available, their variants, styling options, simplicity levels, children components, constraints, etc.
- **[Bring your own data](https://docs.easyblocks.io/essentials/external-data)**. Connect any data source, fully control data fetching and data picker widget. The data can be dynamic. For example, you can connect texts or images from data sources in the editor.
- **Server-side rendering**. Fully compatible with modern frameworks like [next.js](https://nextjs.org/) or [Remix](https://remix.run/), but can also render to pure HTML/CSS. All the heavy lifting happens on the server - no browser rendering and layout shifts.

## Why?

If you need a custom text editor there are so many solutions available: Slate, Lexical, TinyMCE, CKEditor, etc. But if you need a custom page builder there's a huge chance you must build one from scratch. And it’s an awfully expensive and tedious process.

The goal behind Easyblocks is to make it possible to create truly state-of-the-art visual page building experiences in weeks instead of years, without compromising flexibility.

## How?

Easyblocks can handle a wide range of seemingly different visual experiences thanks to a very clear separation between what's common for all visual builders and what's custom and project-specific. The Easyblocks editor knows how to handle common visual builder logic (drag&drop, nested selections, inline rich text, responsive styling fields, etc), but at the same time doesn't know anything about project-specific things like your [components](https://docs.easyblocks.io/essentials/no-code-components), [data sources](https://docs.easyblocks.io/essentials/external-data) or [templates](https://docs.easyblocks.io/essentials/templates). Project-specific stuff can be defined with code using Easyblocks framework, which is based on a novel concept called [No-Code Components](https://docs.easyblocks.io/essentials/no-code-components).

Please go to our [docs](https://docs.easyblocks.io) to learn more.

## Authors

Easyblocks is built by the team behind [Shopstory](https://shopstory.app) - a visual builder for headless CMSes. Easyblocks is basically an internal Shopstory engine cleaned up and open-sourced ❤️

High five! ✋

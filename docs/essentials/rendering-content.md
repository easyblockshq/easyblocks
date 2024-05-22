# Rendering content

## Building the document

In order to render the Easyblocks document it must first go through a so-called "build phase", which is done by `buildDocument` function from our SDK. This function prepares the document for rendering:

```typescript
import { buildDocument } from "@easyblocks/core";

const { renderableDocument } = await buildDocument({
  documentId: "<your_document_id>",
  config: easyblockConfig,
  locale: "<your_desired_locale>",
});
```

#### `buildDocument` parameters

- `documentId` - identifier of the document you want to build
- `config` - your Easyblocks config
- `locale` - locale's code for which you want to build content

The result of `buildDocument` is an object with a property `renderableDocument` which is of type `RenderableDocument` and it represents content optimised and prepared for rendering.

## Rendering content

Rendering content is dona via `Easyblocks` component:

```tsx
import { Easyblocks } from "@easyblocks/core";

<Easyblocks
  renderableDocument={renderableDocument}
  components={yourNoCodeComponentInstancesObject}
/>;
```

## External data

The document you build and render might be dependent on external data. If this is the case, you must use `externalData` property returned from `buildDocument` function, fetch the requested data and then pass it to `Easyblocks` via `externalData` property. Like this:

```tsx
const { renderableDocument, externalData } = await buildDocument({
  documentId: "<your_document_id>",
  config: easyblockConfig,
  locale: "<your_desired_locale>",
});

// custom fetching external data
const externalDataValues = await customFetch(externalData);

<Easyblocks
  renderableDocument={renderableDocument}
  components={yourNoCodeComponentInstancesObject}
  externalData={externalDataValues} // passing external data for render
/>;
```

Please read [External Data](external-data.md) guide to understand this process better.

### Can I render in non-React environment? Like Vue.js or pure HTML?

If adding React to your bundle is problematic, there are two available options:

1. **Use Preact**. Easyblocks relies heavily on React, but there's nothing that prevents you from using Preact in the runtime (when real page is rendered). It will heavily decrease the bundle size.
2. **Pure HTML/CSS.** If the code of your No-Code Components doesn't use any `useEffect`, `useState`, etc, then you can pre-render content on the server-side and just sent the generated HTML+CSS to the browser. The rendered document is static so you don't need a rehydration phase or virtual DOM tree living in the front-end (it's kind of similar to what Astro or server components do).

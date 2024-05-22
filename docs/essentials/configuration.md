# Configuration

The `Config` object in Easyblocks is a central object that holds all the essential configuration settings. It's a parameter required by `EasyblocksEditor` ([Editor Page](editor-page.md)) and `buildDocument` ([Rendering Content](rendering-content.md)).&#x20;

```typescript
import type { Config } from "@easyblocks/core";

export const easyblocksConfig: Config = {
  /* config properties */
};
```

### Properties

#### `Config.backend`

Sets the backend service responsible for saving, updating and versioning documents and templates. Please read [Backend](backend.md) guide to learn more.

```typescript
import type { Config, EasyblocksBackend } from "@easyblocks/core";

const config: Config = {
  backend: new EasyblocksBackend({ accessToken: MY_ACCESS_TOKEN }),
  // ...
};
```

#### `Config.components`

All the [No-Code Component Definitions](no-code-components/) available in your setup must be provided in `components` property:

```typescript
import type { Config } from '@easyblocks/core';

const config: Config = {
  ...,
  components: [
    {
      id: 'MyNoCodeComponent',
      schema: [
        {
          prop: 'title',
          type: 'string',
          label: 'Title'
        }
      ]
    }
  ]
};
```

#### `Config.devices`

Devices object allows you reconfigure default devices provided by Easyblocks. Easyblocks comes with an opinionated list of devices:

1. Mobile `xs` - `max-width: 568px`
2. Mobile Horizontal `sm` - `max-width: 768px`
3. Tablet `md` - `max-width: 992px`
4. Tablet Horizontal `lg` - `max-width: 1280px`
5. Desktop `xl` - `max-width: 1600px`
6. Large desktop `2xl`

You can switch between different devices using the device switch from the top bar of editor.

<figure><img src="../.gitbook/assets/image (10).png" alt=""><figcaption><p>Device switch in the editor</p></figcaption></figure>

By default, Mobile Horizontal and Tablet Horizontal are hidden as we find them unnecessary to be visible out of the box. If you would like to have more control over your breakpoints you can make them visible by setting `hidden` property:

```typescript
import type { Config } from '@easyblocks/core';

const config: Config = {
  ...,
  devices: {
    sm: { hidden: false },
    lg: { hidden: false }
  }
};
```

#### `Config.locales`

List of available locales.

<pre class="language-typescript"><code class="lang-typescript">import type { Config } from '@easyblocks/core';

<strong>const config: Config = {
</strong><strong>  ...,
</strong>  locales: [
    {
      code: 'en-US',
      isDefault: true
    },
    {
      code: 'de-DE',
      fallback: 'en-US'
    }
  ]
};
</code></pre>

**One of the locales must be alwyas set as default.** This locale is going to be used as a fallback in cases where locale is missing or a translation for selected locale (different than default) is missing.

#### `Config.types`

Beside using built-in types provided by Eeasyblocks you can also define your own custom types for referencing external data. Learn more about custom types [here](external-data.md).

```typescript
import type { Config } from '@easyblocks/core';

const config: Config = {
  ...,
  types: {
    "shopify.product": {
      widgets: [ /* widgets */ ]
    }
  }
};
```

#### `Config.tokens`

Each type in Easyblocks can be tokenised which means that a predefined list of variables (tokens) is always available in the field widgets. The tokens are defined via `Config.tokens` property.&#x20;

The built-in types like `color`, `font`, `space`, `aspectRatio`, `boxShadow`, `icon` are tokenized. When you use any of those types please remember of defining its tokens (example below).

Your custom types can also be tokenised and you can create your own custom token scales.

```typescript
export const config: Config = {
  // ...,
  tokens: {
    colors: [
      {
        id: "grey_05",
        label: "Dark",
        value: "#252525",
      },
      {
        id: "grey_01",
        label: "Light",
        value: "#f9f8f3",
      },
      {
        id: "beige_01",
        label: "Beige",
        value: "#f1f0ea",
      },
      {
        id: "yellow",
        label: "Lemonade Yellow",
        value: "#FCF0C5",
      },
      {
        id: "golden-yellow",
        label: "Golden Yellow",
        value: "#FCF0C5",
      },
      {
        id: "lavender",
        label: "Lavender",
        value: "#E1E2ED",
      },
      {
        id: "olive",
        label: "Olive",
        value: "#A9A886",
      },
    ],
    space: [
      {
        id: "0",
        label: "0",
        value: "0px",
      },
      {
        id: "1",
        label: "1",
        value: "1px",
      },
      {
        id: "2",
        label: "2",
        value: "2px",
      },
      {
        id: "4",
        label: "4",
        value: "4px",
      },
      {
        id: "6",
        label: "6",
        value: "6px",
      },
      {
        id: "8",
        label: "8",
        value: "8px",
      },
      {
        id: "12",
        label: "12",
        value: "12px",
      },
      {
        id: "16",
        label: "16",
        value: "16px",
      },
      {
        id: "24",
        label: "24",
        value: "24px",
      },
      {
        id: "32",
        label: "32",
        value: "32px",
      },
      {
        id: "48",
        label: "48",
        value: "48px",
      },
      {
        id: "64",
        label: "64",
        value: "64px",
      },
      {
        id: "96",
        label: "96",
        value: "96px",
      },
      {
        id: "128",
        label: "128",
        value: "128px",
      },
      {
        id: "160",
        label: "160",
        value: "160px",
      },
      {
        id: "containerMargin.standard",
        label: "Standard",
        value: {
          // responsive value
          $res: true,
          md: "5vw", // vw units are allowed for "space" type
          lg: "8vw",
        },
      },
      {
        id: "containerMargin.large",
        label: "Large",
        value: {
          // repsonsive value
          $res: true,
          xs: "5vw",
          md: "8vw",
          lg: "12vw",
        },
      },
    ],
    fonts: [
      {
        id: "body",
        label: "Body",
        value: {
          fontSize: 20,
          lineHeight: 1.8,
          fontFamily: "test-soehne-mono",
        },
      },
      {
        id: "body2",
        label: "Body small",
        value: {
          fontSize: 13,
          lineHeight: 1.8,
          fontFamily: "test-soehne-mono",
        },
      },
      {
        id: "heading1",
        label: "Heading 1",
        value: {
          $res: true,
          sm: {
            fontSize: 36,
            fontFamily: "test-national-2",
            lineHeight: 1.2,
            fontWeight: 700,
          },
          md: {
            fontSize: 48,
            fontFamily: "test-national-2",
            lineHeight: 1.2,
            fontWeight: 700,
          },
        },
      },
      {
        id: "heading2",
        label: "Heading 2",
        value: {
          $res: true,
          sm: {
            fontFamily: "test-national-2",
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
          },
          md: {
            fontFamily: "test-national-2",
            fontSize: 36,
            lineHeight: 1.2,
            fontWeight: 700,
          },
        },
      },
    ],
    icons: [
      {
        id: "arrowLeft",
        label: "Arrow left",
        value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="100px" height="100px"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
      },
      {
        id: "arrowRight",
        label: "Arrow right",
        value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>`,
      },
      {
        id: "play",
        label: "Play",
        value: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>`,
      },
      {
        id: "pause",
        label: "Pause",
        value: `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>`,
      },
    ],
    aspectRatios: [
      {
        id: "panoramic",
        label: "Panoramic (2:1)",
        value: "2:1",
      },
      {
        id: "landscape",
        label: "Landscape (16:9)",
        value: "16:9",
      },
      {
        id: "portrait",
        label: "Portrait (4:5)",
        value: "4:5",
      },
      {
        id: "square",
        label: "Square (1:1)",
        value: "1:1",
      },
    ],
    boxShadows: [
      {
        id: "none",
        label: "None",
        value: "none",
      },
      {
        id: "sm",
        label: "sm",
        value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      {
        id: "md",
        label: "md",
        value:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      {
        id: "lg",
        label: "lg",
        value:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      {
        id: "xl",
        label: "xl",
        value:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      {
        id: "2xl",
        label: "2xl",
        value: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
    ],
  },
};
```

#### `config.templates`

This property allows for setting templates. Read the [Templates](templates.md) section to learn more.

```typescript
import type { Config } from '@easyblocks/core';
import bannerTemplate1 from "bannerTemplate1.json"

const config: Config = {
  ...,
  templates: [
    {
      id: "BannerSection",
      entry: bannerTemplate1
    }
  ]
};
```

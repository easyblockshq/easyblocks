# Editor page

In order to use Easyblocks your project must have a dedicated page that contains the Easyblocks Editor, called the editor page.

Creating the editor page is simple:

```tsx
import { EasyblocksEditor } from "@easyblocks/editor";
import { easyblocksConfig } from "../easyblocks.config.ts";

function EditorPage() {
  return (
    <EasyblocksEditor
      config={easyblocksConfig}
      components={yourNoCodeComponentInstances}
    />
  );
}
```

The `config` property takes an Easyblocks configuration object described in a [Configuration](configuration.md) guide. The `components` property takes the instances of your No-Code Components (described in [No-Code Components](no-code-components/) section).

Please keep in mind that the editor page shouldn't render any extra headers, footers, popups etc. It must be blank canvas with `EasyblocksEditor` being a single component rendered.

In order to embed the Easyblocks editor in your product, you should use an `<iframe>` element that points to your editor page. However, in order to play around, you can simply open the editor page directly.

### Query parameters

The editor page takes a few important query parameters:

- `readOnly <boolean> = true` - if set to `true`, no permanent modifications will be done to existing documents or templates. Very good way to play around, debug components, documents, etc. When you open the editor page directly it's by default set to `true` in order to prevent unexpected modifications.
- `document <string>` - the id of the document you want to open. Leaving it undefined means you're creating a new document.
- `rootComponent <string>` - the id of the root component. Mandatory when creating a new document (`document` param is not set).
- `rootTemplate <string>` - the id of the template to copy when creating a new document. Can't be specified together with `rootComponent`.
- `locale <string>` - a locale id. The locale must exist in [`Config.locales`](configuration.md#config.locales).

Examples:

- `https://youdomain.com/easyblocks-editor?rootComponent=RootSectionsStack` - open new document with a root component `RootSectionsStack`. `readOnly` is not set (defaults to `true`) so the document is just temporary, will never be saved to [backend](backend.md). It's the best way to start playing around with the editor.
- `https://youdomain.com/easyblocks-editor?document=abcd123` - open a document with id `abcd123` in read-only mode, a good way to debug the document while being sure it won't get modified in the backend.
- `https://youdomain.com/easyblocks-editor?document=abcd123&readOnly=false&locale=de` - edit the document `abcd123`, all the changes will be saved to the backend. The editor is opened in `de` locale (German).

### Events

The editor page sends [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) events to the parent window.

To listen to any of these events, you can create a callback ref to `<iframe>` and add event listener to `message` event in `useEffect` hook:

```tsx
// We use state instead of ref on purpose to exactly know when the node is attached
// so we could react to it.
const [iframeNode, setIframeNode] = useState<HTMLIFrameElement | null>(null);

useEffect(() => {
  function handleMessage(event: MessageEvent) {
    if (event.data.type === "@easyblocks/closed") {
      // handle closed event
    }

    if (event.data.type === "@easyblocks/content-saved") {
      // handle content saved event
    }
  }

  iframeNode?.contentWindow?.addEventListener("message", handleMessage);

  return () => {
    iframeNode?.contentWindow?.removeEventListener("message", handleMessage);
  };
}, [iframeNode]);

return (
  <iframe
    src={`/your-editor-page?rootContainer=myContainer&mode=app`}
    ref={setIframeNode}
  ></iframe>
);
```

Below is the list of events that editor can publish:

#### `@easyblocks/closed`

Published when editor should be closed because user has clicked the close button in the top bar. The format:

```typescript
{
  type: "@easyblocks/closed";
}
```

#### `@easyblocks/content-saved`&#x20;

Published each time the editor is performing the save of current content. It can be done by autosave mechanism or when closing the editor and the data the current data hasn't been saved yet. The format:

```typescript
{
    type: "@easyblocks/content-saved"
    document: {
        id: string,
        version: number,
        entry: NoCodeEntry
    }
}
```

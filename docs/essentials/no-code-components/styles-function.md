# styles function

The `styles` function has 3 goals:

1. Calculate CSS for your No-Code Component.
2. Creating "computed props" that will be later passed to your React Component instance.
3. Passing parameters to subcomponents.

## Calculate CSS

Let's analyse the `styles` function of our `SimpleBanner` component:

<pre class="language-typescript"><code class="lang-typescript">// No-Code Component Definition

import { NoCodeComponentDefinition } from "@easyblocks/core";

<strong>export const simpleBannerDefinition: NoCodeComponentDefinition = {
</strong>  // ...
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
  // ...
};
</code></pre>

The `styled` property of the output object contains "styled components" (we use [Stitches](https://stitches.dev/) under the hood).

{% hint style="info" %}
We're aware that Stitches seems to be outdated and not properly maintained. We'll planning to change it to a different engine as soon as possible.
{% endhint %}

The styled components you produce will show up as properties of your React component. In the `SimpleBanner.tsx` file shown below `Root`, `Wrapper` and `ButtonsWrapper` are styled components created by `styles` function:

```typescript
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

### Responsiveness

**The most important feature of `styles` function is that you don't need to worry about responsiveness at all.** Just write your CSS for a single breakpoint and Easyblocks will handle the rest. Under the hood Easyblocks will run `styles` function once per each breakpoint, combine the outputs and produce a single stylesheet with all the media queries properly applied.

Why so? A lot of schema properties of your No-Code Components will be responsive. Writing a function for calculating styles that takes into account all the possible combinations of responsive fields is simply a hell. When we started building Easyblocks it quickly became obvious that in order to allow for easy responsiveness and simple code we must create an abstraction layer for that - say hello to `styles` function!

Think of our `SimpleBanner` example. In the [video from the previous section](schema.md#responsiveness) we show that users can set different values for other breakpoints. And if you look at the `styles` function code there's nothing at all about responsiveness.

## Computed props

If you want to compute some props that should be later passed to React component you can do it via `props` property of the output object of `styles` function. In the example below a `computedProp` will show up as a property of a `SimpleBanner` React component.

<pre class="language-typescript"><code class="lang-typescript">// No-Code Component Definition

import { NoCodeComponentDefinition } from "@easyblocks/core";

<strong>export const simpleBannerDefinition: NoCodeComponentDefinition = {
</strong>  // ...
  styles: ({ values }) => {
    return {
      styled: {
        // ...
      },
      props: {
        computedProp: 10
      }
    }
  },
  // ...
};
</code></pre>

## Passing parameters to subcomponents

`styles` function allows to pass parameters to subcomponents:

```typescript
// Parent component

const parentComponentDefinition: NoCodeComponentDefinition = {
  // ...
  styles: ({ values }) => {
    return {
      styled: {
        // ...
      },
      components: {
        ChildComponent: {
          passedParameter: 10,
        },
      },
    };
  },
  // ...
};

// Child component

const childComponentDefinition: NoCodeComponentDefinition = {
  // ...
  styles: ({ values, params }) => {
    console.log(params.passedParameter); // 10
    return {};
  },
};
```

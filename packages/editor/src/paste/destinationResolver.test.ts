import { CompilationContextType } from "@easyblocks/core/_internals";
import { testEditorContext } from "../utils/tests";
import { destinationResolver } from "./destinationResolver";
import { Form } from "../form";

function createForm(initialValues: Record<string, any>): Form {
  return new Form({
    id: "",
    label: "",
    onSubmit: () => {},
    initialValues,
  });
}

describe("destinationResolver", () => {
  const context: CompilationContextType = {
    ...testEditorContext,
    definitions: {
      links: [],
      actions: [],
      components: [
        {
          id: "$RootSection",
          tags: ["root"],
          styles: null,
          schema: [
            {
              prop: "data",
              type: "component-collection",
              accepts: ["section"],
            },
          ],
          pasteSlots: ["Component"],
        },
        {
          id: "$Grid",
          styles: null,
          tags: [],
          schema: [
            {
              prop: "Component",
              type: "component",
              accepts: ["$GridCard"],
              required: true,
            },
          ],
          pasteSlots: ["Component"],
        },
        {
          id: "$GridCard",
          tags: [],
          styles: null,
          schema: [
            {
              prop: "Cards",
              type: "component-collection",
              accepts: ["card", "ASDASd"],
            },
          ],
          pasteSlots: ["Cards"],
        },
        {
          id: "$BannerCard",
          styles: null,
          tags: ["card"],
          schema: [],
        },
        {
          id: "$ProductCard",
          styles: null,
          tags: ["card"],
          schema: [],
        },
        {
          id: "$ComponentA",
          styles: null,
          tags: ["section"],
          schema: [
            {
              prop: "ComponentB",
              type: "component",
              componentType: "$ComponentB",
            },
          ],
          pasteSlots: ["ComponentB"],
        },
        {
          id: "$ComponentB",
          styles: null,
          tags: [],
          schema: [
            {
              prop: "ComponentC",
              type: "component",
              componentType: "$ComponentC",
            },
          ],
          pasteSlots: ["ComponentC"],
        },
        {
          id: "$ComponentCollectionA",
          styles: null,
          tags: ["section"],
          schema: [
            {
              prop: "ComponentCollectionB",
              type: "component-collection",
              componentType: "$ComponentCollectionB",
            },
          ],
          pasteSlots: ["ComponentCollectionB"],
        },
        {
          id: "$ComponentCollectionB",
          styles: null,
          tags: [],
          schema: [
            {
              prop: "ComponentCollectionC",
              type: "component-collection",
              componentType: "$ComponentC",
            },
          ],
          pasteSlots: ["ComponentCollectionC"],
        },
        {
          id: "$ComponentC",
          styles: null,
          tags: [],
          schema: [],
        },
      ],
      textModifiers: [],
    },
  } as CompilationContextType;

  const form = createForm({
    data: [
      {
        _template: "$Grid",
        Component: [],
      },
      {
        _template: "$Grid",
        Component: [
          {
            _template: "$GridCard",
            Cards: [],
          },
        ],
      },
      {
        _template: "$Grid",
        Component: [
          {
            _template: "$GridCard",
            Cards: [
              {
                _template: "$ProductCard",
              },
              {
                _template: "$BannerCard",
              },
            ],
          },
        ],
      },
      {
        _template: "$Grid",
        Component: [
          {
            _template: "$ComponentWithoutDefintion",
            Component: [],
          },
        ],
      },
      {
        _template: "$ComponentA",
        ComponentB: [
          {
            _template: "$ComponentB",
            ComponentC: [
              {
                _template: "$ComponentC",
              },
            ],
          },
        ],
      },
      {
        _template: "$ComponentCollectionA",
        ComponentCollectionB: [
          {
            _template: "$ComponentCollectionB",
            ComponentCollectionC: [
              {
                _template: "$ComponentC",
              },
              {
                _template: "$ComponentC",
              },
              {
                _template: "$ComponentC",
              },
            ],
          },
        ],
      },
    ],
    _template: "$RootSections",
  });

  it.each`
    path                 | expectedPaths
    ${"data.0"}          | ${["data.0", "data.0.Component.0"]}
    ${"data.1"}          | ${["data.1", "data.1.Component.0", "data.1.Component.0.Cards.0"]}
    ${"data.2"}          | ${["data.2", "data.2.Component.0", "data.2.Component.0.Cards.2", "data.2.Component.0.Cards.1"]}
    ${"data.wrong.path"} | ${[]}
    ${"data.3"}          | ${["data.3"]}
    ${"data.4"}          | ${["data.4", "data.4.ComponentB.0", "data.4.ComponentB.0.ComponentC.0"]}
    ${"data.5"}          | ${["data.5", "data.5.ComponentCollectionB.1", "data.5.ComponentCollectionB.0.ComponentCollectionC.3", "data.5.ComponentCollectionB.0.ComponentCollectionC.2", "data.5.ComponentCollectionB.0.ComponentCollectionC.1"]}
  `(
    "Should resolve path $path according to pasteSlots",
    ({ path, expectedPaths }) => {
      const resolve = destinationResolver({
        context,
        form,
      });

      const destinations = resolve(path);

      expect(destinations.map((x) => `${x.name}.${x.index}`)).toEqual(
        expectedPaths
      );
    }
  );
});

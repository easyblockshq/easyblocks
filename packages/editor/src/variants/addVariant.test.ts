import { ConfigComponent } from "@easyblocks/core";
import type { CompilationContextType } from "@easyblocks/app-utils";
import * as uniqueIdModule from "@easyblocks/utils/src/uniqueId";
import { dotNotationGet } from "@easyblocks/utils";
import { createForm } from "../utils/tests";
import { addVariant } from "./addVariant";

function createConfig(init: Partial<ConfigComponent> = {}): ConfigComponent {
  return { _template: "tmpl", traceId: expect.any(String), ...init };
}

const testCompilationContext: CompilationContextType = {
  devices: [],
  theme: {
    space: {},
    fonts: {},
    aspectRatios: {},
    colors: {},
    icons: {},
    numberOfItemsInRow: {},
    containerWidths: {},
  },
  contextParams: {
    locale: "en",
  },
  image: {
    resourceType: "",
    transform: jest.fn(),
  },
  mainBreakpointIndex: "",
  text: {
    fetch: jest.fn(),
  },
  resourceTypes: {},
  video: {
    resourceType: "",
    transform: jest.fn(),
  },
  definitions: {
    links: [],
    actions: [],
    components: [
      {
        id: "tmpl",
        schema: [],
        tags: [],
      },
    ],
    textModifiers: [],
  },
};

describe("addVariant", () => {
  it.each`
    groupId     | audience              | path                  | expectedVariant
    ${"groupA"} | ${"Family $ Friends"} | ${"data.0"}           | ${createConfig({ _id: expect.any(String), _variantGroupId: "groupA", _audience: "Family $ Friends" })}
    ${"groupB"} | ${"Women"}            | ${"data.component.0"} | ${createConfig({ _id: expect.any(String), _variantGroupId: "groupB", _audience: "Women" })}
  `(
    "Should add variant to $groupId under $audience audience",
    ({ groupId, audience, path, expectedVariant }) => {
      const form = createForm();

      const baseVariant = createConfig({ _variantGroupId: groupId });

      const expectedGroup = [expectedVariant];

      addVariant({
        form,
        context: testCompilationContext,
        audience,
        path,
        variant: baseVariant,
      });

      expect(form.values?._variants?.[groupId]).toEqual(expectedGroup);
      expect(dotNotationGet(form.values, path)).toEqual(expectedVariant);
    }
  );

  it.each`
    newGroupId     | audience      | path                  | expectedVariant
    ${"newGroupA"} | ${"Kids"}     | ${"data.0"}           | ${createConfig({ _id: "1", _variantGroupId: "newGroupA", _audience: "Kids" })}
    ${"newGroupB"} | ${"Toddlers"} | ${"data.component.0"} | ${createConfig({ _id: "2", _variantGroupId: "newGroupB", _audience: "Toddlers" })}
  `(
    "Should add variant to new group $newGroupId under $audience audience",
    ({ newGroupId, audience, path, expectedVariant }) => {
      const form = createForm();

      const baseVariant = createConfig({});

      const expectedGroup = [expectedVariant];

      jest
        .spyOn(uniqueIdModule, "uniqueId")
        .mockReturnValueOnce(expectedVariant._id)
        .mockReturnValueOnce("randomPartOfTraceId")
        .mockReturnValueOnce(newGroupId);

      addVariant({
        form,
        context: testCompilationContext,
        audience,
        path,
        variant: baseVariant,
      });

      expect(form.values?._variants?.[newGroupId]).toEqual(expectedGroup);
      expect(dotNotationGet(form.values, path)).toEqual(expectedVariant);
    }
  );
});

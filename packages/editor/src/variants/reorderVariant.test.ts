import { ConfigComponent } from "@easyblocks/core";
import { createForm } from "../utils/tests";
import { reorderVariant } from "./reorderVariant";

function createConfig(init: Partial<ConfigComponent> = {}): ConfigComponent {
  return { _template: "tmpl", ...init };
}

describe("reorderVariant", () => {
  it.each`
    groupId     | sourceIndex  | destinationIndex | expectedOrder
    ${"groupA"} | ${undefined} | ${0}             | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${0}         | ${undefined}     | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${0}         | ${0}             | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${1}         | ${1}             | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${2}         | ${2}             | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${3}         | ${3}             | ${["id_0", "id_1", "id_2", "id_3"]}
    ${"groupA"} | ${0}         | ${1}             | ${["id_1", "id_0", "id_2", "id_3"]}
    ${"groupA"} | ${0}         | ${2}             | ${["id_1", "id_2", "id_0", "id_3"]}
    ${"groupA"} | ${0}         | ${3}             | ${["id_1", "id_2", "id_3", "id_0"]}
    ${"groupA"} | ${1}         | ${0}             | ${["id_1", "id_0", "id_2", "id_3"]}
    ${"groupA"} | ${1}         | ${2}             | ${["id_0", "id_2", "id_1", "id_3"]}
    ${"groupA"} | ${1}         | ${3}             | ${["id_0", "id_2", "id_3", "id_1"]}
    ${"groupA"} | ${1}         | ${3}             | ${["id_0", "id_2", "id_3", "id_1"]}
    ${"groupA"} | ${0}         | ${-1}            | ${["id_1", "id_2", "id_0", "id_3"]}
    ${"groupA"} | ${-1}        | ${0}             | ${["id_3", "id_0", "id_1", "id_2"]}
  `(
    "reorderVariant $sourceIndex -> $destinationIndex results in $expectedOrder",
    ({ groupId, sourceIndex, destinationIndex, expectedOrder }) => {
      const repository = {
        [groupId]: [
          createConfig({ _id: "id_0" }),
          createConfig({ _id: "id_1" }),
          createConfig({ _id: "id_2" }),
          createConfig({ _id: "id_3" }),
        ],
      };

      const form = createForm({ _variants: repository });

      reorderVariant(form, groupId, sourceIndex, destinationIndex);

      expect(
        (form.values?._variants?.[groupId] ?? []).map((x: any) => x._id)
      ).toEqual(expectedOrder);
    }
  );
});

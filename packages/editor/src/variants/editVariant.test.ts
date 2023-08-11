import { editVariant } from "./editVariant";
import { createForm, createConfig } from "../utils/tests";
import { dotNotationGet } from "@easyblocks/utils";

describe("editVariant", () => {
  const variant1 = createConfig({
    _id: "config-id-1",
    _variantGroupId: "group-id-1",
    _audience: "Adults",
  });
  const variant2 = createConfig({
    _id: "config-id-2",
    _variantGroupId: "group-id-2",
    _audience: "Family and Friends",
  });
  const variant3 = createConfig({
    _id: "config-id-3",
    _variantGroupId: "group-id-2",
    _audience: "Kids",
  });

  const repository = {
    ["group-id-1"]: [variant1],
    ["group-id-2"]: [variant2, variant3],
  };

  it.each`
    groupId         | id               | newAudience             | current     | index | expectedAudience        | expectedCurrentVariant
    ${"group-id-1"} | ${"config-id-1"} | ${"New Audience 1"}     | ${variant1} | ${0}  | ${"New Audience 1"}     | ${"config-id-1"}
    ${"group-id-2"} | ${"config-id-2"} | ${"New Audience 2"}     | ${variant2} | ${0}  | ${"New Audience 2"}     | ${"config-id-2"}
    ${"group-id-2"} | ${"config-id-3"} | ${"New Audience 3"}     | ${variant3} | ${1}  | ${"New Audience 3"}     | ${"config-id-3"}
    ${"group-id-2"} | ${"config-id-3"} | ${"Family and Friends"} | ${variant2} | ${1}  | ${"Family and Friends"} | ${"config-id-2"}
    ${"group-id-2"} | ${"config-id-2"} | ${"Kids"}               | ${variant3} | ${0}  | ${"Kids"}               | ${"config-id-2"}
  `(
    "editVariant",
    ({
      id,
      groupId,
      newAudience,
      current,
      index,
      expectedAudience,
      expectedCurrentVariant,
    }) => {
      const path = "data.0.component.0";

      const form = createForm({
        data: [{ component: [current] }],
        _variants: repository,
      });

      editVariant({ form, groupId, id, path, newAudience });

      expect(form.values?._variants?.[groupId][index]._audience).toEqual(
        expectedAudience
      );

      expect(dotNotationGet(form.values, path)._id).toEqual(
        expectedCurrentVariant
      );
    }
  );
});

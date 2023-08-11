import { selectVariant } from "./selectVariant";
import { createForm, createConfig } from "../utils/tests";
import { dotNotationGet } from "@easyblocks/utils";

describe("selectVariant", () => {
  it("selectVariant", () => {
    const id = "config-id-1";
    const groupId = "group-id-1";
    const path = "data.0.component.0";

    const currentConfig = createConfig({
      _id: "config-id-2",
      _variantGroupId: groupId,
      _audience: "Family and Friends",
    });

    const variantToReplace = createConfig({
      _id: id,
      _variantGroupId: groupId,
      _audience: "Kids",
    });

    const repository = {
      [groupId]: [variantToReplace],
    };

    const form = createForm({
      data: [
        {
          component: [currentConfig],
        },
      ],
      _variants: repository,
    });

    selectVariant({
      form,
      id,
      path,
    });

    expect(dotNotationGet(form.values, path)).toEqual(variantToReplace);
    expect(form.values?._variants).toEqual({
      [groupId]: [variantToReplace, currentConfig],
    });
  });
});

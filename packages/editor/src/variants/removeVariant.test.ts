import { dotNotationGet } from "@easyblocks/utils";
import { createConfig, createForm } from "../utils/tests";
import { removeVariant } from "./removeVariant";

describe("removeVariant", () => {
  const groupId = "group-id-1";

  const var1 = createConfig({
    _id: "config-id-1",
    _variantGroupId: groupId,
  });

  const var2 = createConfig({
    _id: "config-id-2",
    _variantGroupId: groupId,
  });

  const var3 = createConfig({
    _id: "config-id-3",
    _variantGroupId: groupId,
  });

  it.each`
    idToRemove  | repository                           | expectedRepository
    ${var1._id} | ${{ [groupId]: [var1, var2, var3] }} | ${[var2, var3]}
    ${var2._id} | ${{ [groupId]: [var1, var2, var3] }} | ${[var1, var3]}
    ${var3._id} | ${{ [groupId]: [var1, var2, var3] }} | ${[var1, var2]}
  `(
    "Should remove variant",
    ({ idToRemove, repository, expectedRepository }) => {
      const form = createForm({
        _variants: repository,
      });

      removeVariant({
        form,
        groupId,
        id: idToRemove,
        path: "",
      });

      expect(form.values?._variants?.[groupId]).toEqual(expectedRepository);
    }
  );

  it.each`
    idToRemove  | repository               | expectedRepository
    ${var1._id} | ${{ [groupId]: [var1] }} | ${undefined}
    ${var2._id} | ${{ [groupId]: [var2] }} | ${undefined}
    ${var3._id} | ${{ [groupId]: [var3] }} | ${undefined}
  `(
    "Should remove group when last variant gets removed",
    ({ idToRemove, repository, expectedRepository }) => {
      const form = createForm({
        _variants: repository,
      });

      removeVariant({
        form,
        groupId,
        id: idToRemove,
        path: "",
      });

      expect(form.values?._variants?.[groupId]).toEqual(expectedRepository);
    }
  );

  it.each`
    variantToRemove | repository                           | expectedVariant
    ${var1}         | ${{ [groupId]: [var1, var2] }}       | ${var2}
    ${var2}         | ${{ [groupId]: [var1, var2, var3] }} | ${var1}
    ${var3}         | ${{ [groupId]: [var1, var2, var3] }} | ${var2}
    ${var1}         | ${{ [groupId]: [var1] }}             | ${var1}
  `(
    "Should replace current variant with first from the repository When removing current variant",
    ({ variantToRemove, repository, expectedVariant }) => {
      const path = "data.0.component.0";

      const form = createForm({
        data: [{ component: [variantToRemove] }],
        _variants: repository,
      });

      removeVariant({
        form,
        groupId,
        id: variantToRemove._id,
        path,
      });

      expect(dotNotationGet(form.values, path)).toEqual(expectedVariant);
    }
  );
});

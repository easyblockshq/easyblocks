import * as compilerModule from "@easyblocks/compiler";
import { CompilationContextType } from "@easyblocks/app-utils";
import { reconcile } from "./reconcile";

jest.mock("@easyblocks/compiler", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@easyblocks/compiler"),
  };
});

describe("reconscile", () => {
  it.each`
    itemProps                                    | parentTemplateId | parentFieldName | expectedItem
    ${{ $stack: { Items: { width: "100px" } } }} | ${"$stack"}      | ${"BanerCard"}  | ${{ _template: "child", id: "newChild", _itemProps: { $stack: { Items: {} } } }}
    ${{ $stack: { Grid: { align: "center" } } }} | ${"$grid"}       | ${"Card"}       | ${{ _template: "child", id: "newChild", _itemProps: { $grid: { Card: {} } } }}
  `(
    "Should reconscile items _itemProps with destination",
    ({ itemProps, parentTemplateId, parentFieldName, expectedItem }) => {
      jest.spyOn(compilerModule, "normalize").mockReturnValue(expectedItem);

      const item = {
        _template: "child",
        id: "newChild",
        _itemProps: itemProps,
      };

      const result = reconcile({
        context: {} as CompilationContextType,
        fieldName: parentFieldName,
        templateId: parentTemplateId,
      })(item);

      expect(result).toEqual(expectedItem);
    }
  );
  it.each`
    itemProps                                    | parentTemplateId | parentFieldName
    ${{ $stack: { Items: { width: "100px" } } }} | ${"$stack"}      | ${"Items"}
    ${{ $grid: { Card: { align: "left" } } }}    | ${"$grid"}       | ${"Card"}
  `(
    "Should keep items original _itemProps if destination context is compatible",
    ({ itemProps, parentTemplateId, parentFieldName }) => {
      const item = {
        _template: "child",
        id: "newChild",
        _itemProps: itemProps,
      };
      const result = reconcile({
        context: {} as CompilationContextType,
        fieldName: parentFieldName,
        templateId: parentTemplateId,
      })(item);

      expect(result).toEqual(item);
    }
  );
});

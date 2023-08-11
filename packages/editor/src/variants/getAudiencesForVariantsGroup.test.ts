import { getAudiencesForVariantsGroup } from "./getAudiencesForVariantsGroup";
import { ConfigComponent } from "@easyblocks/core";

describe("getAudiencesForVariantsGroup", () => {
  const allAudiences = [
    {
      id: "111",
      name: "Main",
      description: "Main audience",
    },
    {
      id: "222",
      name: "Another audience",
      description: "This describes the audience",
    },
  ];

  const repository = {
    groupId_1: [],
    groupId_2: [createConfigComponent({ _audience: "111", _id: "id-123" })],
    groupId_3: [
      createConfigComponent({ _audience: "111", _id: "id-345" }),
      createConfigComponent({ _audience: "222", _id: "id-456" }),
    ],
    groupId_4: [createConfigComponent({ _audience: "notInTheAudiences" })],
  };

  it.each`
    variantGroupId                  | audiences       | expectedResult
    ${"groupId_1"}                  | ${allAudiences} | ${[]}
    ${"groupId_2"}                  | ${allAudiences} | ${[{ audienceId: "111", name: "Main", description: "Main audience", variantId: "id-123" }]}
    ${"groupId_3"}                  | ${allAudiences} | ${[{ audienceId: "111", name: "Main", description: "Main audience", variantId: "id-345" }, { audienceId: "222", name: "Another audience", description: "This describes the audience", variantId: "id-456" }]}
    ${"groupId_4"}                  | ${allAudiences} | ${[]}
    ${"groupId_NotInTheRepository"} | ${allAudiences} | ${[]}
    ${"groupId_1"}                  | ${[]}           | ${[]}
  `(
    "getAudiencesForVariantsGroup",
    ({ variantGroupId, audiences, expectedResult }) => {
      const result = getAudiencesForVariantsGroup(
        repository,
        audiences,
        variantGroupId
      );
      expect(result).toEqual(expectedResult);
    }
  );
});

function createConfigComponent(
  init: Partial<ConfigComponent> = {}
): ConfigComponent {
  return {
    _template: "",
    ...init,
  };
}

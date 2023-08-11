import { createConfig } from "../utils/tests";
import { getVariantsGroup } from "./getVariantsGroup";

describe("getVariantsGroup", () => {
  const groupIdA = "groupIdA";
  const groupIdB = "groupIdB";
  const groupIdC = "groupIdC";

  const groupA = [createConfig(), createConfig(), createConfig()];
  const groupB = [createConfig(), createConfig()];
  const groupC = [createConfig()];

  const repository = {
    [groupIdA]: groupA,
    [groupIdB]: groupB,
    [groupIdC]: groupC,
  };

  it.each`
    groupId     | expected
    ${groupIdA} | ${groupA}
    ${groupIdB} | ${groupB}
    ${groupIdC} | ${groupC}
  `("getVariantsGroup $groupId", ({ groupId, expected }) => {
    const actual = getVariantsGroup(repository, groupId);
    expect(actual).toEqual(expected);
  });
});

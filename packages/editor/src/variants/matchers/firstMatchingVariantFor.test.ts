import { createConfig } from "../../utils/tests";
import { firstMatchingVariantFor } from "./firstMatchingVariantFor";

test.each`
  audiences                         | configAudience          | expectedResult
  ${["Main", "Family and Friends"]} | ${"Main"}               | ${true}
  ${["Main", "Family and Friends"]} | ${"Family and Friends"} | ${true}
  ${["Main", "Family and Friends"]} | ${"Kids"}               | ${false}
`(
  "Should return $expectedResult when audiences=$audiences and configAudience=$configAudience ",
  ({ audiences, configAudience, expectedResult }) => {
    expect(
      firstMatchingVariantFor(audiences)(
        createConfig({ _audience: configAudience })
      )
    ).toBe(expectedResult);
  }
);

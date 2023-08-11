import { Audience } from "@easyblocks/core";
import { VariantsRepository } from "../types";
import { getVariantsGroup } from "./getVariantsGroup";

interface ResolvedAudience {
  audienceId: string;
  variantId: string;
  name: string;
  description: string;
}

function getAudiencesForVariantsGroup(
  repository: VariantsRepository,
  audiences: Audience[],
  groupId: string
) {
  const variantsGroup = getVariantsGroup(repository, groupId);

  const audienceIdToAudience = new Map(
    audiences.map(({ id, ...rest }) => [id, { audienceId: id, ...rest }])
  );

  const mappedAudiences = variantsGroup
    .filter((v) => v._audience)
    .map((v) => {
      if (audienceIdToAudience.has(v._audience)) {
        return {
          ...audienceIdToAudience.get(v._audience),
          variantId: v._id,
        };
      }
    })
    .filter((a): a is ResolvedAudience => !!a);

  return mappedAudiences;
}

export { getAudiencesForVariantsGroup };

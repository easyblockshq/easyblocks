import {
  SectionProps,
  SectionWrapper,
} from "@/app/easyblocks/components/utils/sectionWrapper/SectionWrapper";
import { BannerCard } from "@/app/easyblocks/components/BannerCard/BannerCard";

export function BannerSection(
  props: { _id: string } & Record<string, any> & SectionProps
) {
  const { SectionRoot } = props;

  return (
    <SectionWrapper {...props}>
      <SectionRoot.type {...SectionRoot.props}>
        <BannerCard {...props} />
      </SectionRoot.type>
    </SectionWrapper>
  );
}

import { BannerCard } from "@/app/easyblocks/components/BannerCard/BannerCard";
import {
  SectionProps,
  SectionWrapper,
} from "@/app/easyblocks/components/utils/sectionWrapper/SectionWrapper";
import { NoCodeComponentProps } from "@easyblocks/core";

export function BannerSection(
  props: NoCodeComponentProps & Record<string, any> & SectionProps
) {
  const {
    __easyblocks,
    // Section styled components
    Background__,
    BackgroundContainer__,
    Container__,
    ContentContainer__,
    HeaderSecondaryStack,
    HeaderStack,
    HeaderStackContainer__,
    Root__,
    SectionRoot,
    SubheaderStackContainer__,
    headerMode,
    // BannerSection styled components
    Container,
    Root,
    Stack,
    StackContainer,
    StackInnerContainer,
    CoverContainer,
    CoverCard,
  } = props;

  return (
    <SectionWrapper
      _id={__easyblocks.id}
      Background__={Background__}
      BackgroundContainer__={BackgroundContainer__}
      Container__={Container__}
      ContentContainer__={ContentContainer__}
      HeaderSecondaryStack={HeaderSecondaryStack}
      HeaderStack={HeaderStack}
      HeaderStackContainer__={HeaderStackContainer__}
      Root__={Root__}
      SubheaderStackContainer__={SubheaderStackContainer__}
      headerMode={headerMode}
    >
      <SectionRoot.type {...SectionRoot.props}>
        <BannerCard
          Container={Container}
          Root={Root}
          Stack={Stack}
          StackContainer={StackContainer}
          StackInnerContainer={StackInnerContainer}
          CoverContainer={CoverContainer}
          CoverCard={CoverCard}
        />
      </SectionRoot.type>
    </SectionWrapper>
  );
}

import {
  SectionProps,
  SectionWrapper,
} from "@/app/easyblocks/components/utils/sectionWrapper/SectionWrapper";
import { NoCodeComponentProps } from "@easyblocks/core";

function TwoCards(
  props: NoCodeComponentProps & Record<string, any> & SectionProps
) {
  const {
    // TwoCards styled components
    Card1,
    Card2,
    Card1Container,
    Card2Container,
    Root,
    // Section styled components
    Background__,
    BackgroundContainer__,
    Container__,
    ContentContainer__,
    HeaderSecondaryStack,
    HeaderStack,
    HeaderStackContainer__,
    Root__,
    SubheaderStackContainer__,
    headerMode,
    __easyblocks,
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
      <Root.type {...Root.props}>
        <Card1Container.type {...Card1Container.props}>
          <Card1.type {...Card1.props} />
        </Card1Container.type>

        <Card2Container.type {...Card2Container.props}>
          <Card2.type {...Card2.props} />
        </Card2Container.type>
      </Root.type>
    </SectionWrapper>
  );
}

export { TwoCards };

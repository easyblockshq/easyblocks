import { NoCodeComponentProps } from "@easyblocks/core";
import React, { ReactElement } from "react";
import {
  SectionProps,
  SectionWrapper,
} from "../utils/sectionWrapper/SectionWrapper";

export function Grid(
  props: {
    Container: ReactElement;
    InnerContainer: ReactElement;
    SpacerLeft: ReactElement;
    SpacerRight: ReactElement;
    Cards: Array<ReactElement>;
    LeftArrowWrapper: ReactElement;
    LeftArrowInnerWrapper: ReactElement;
    LeftArrow: ReactElement;
    RightArrowWrapper: ReactElement;
    RightArrowInnerWrapper: ReactElement;
    RightArrow: ReactElement;
    Root: ReactElement;
    itemContainers: Array<ReactElement>;
    itemInnerContainers: Array<ReactElement>;
  } & SectionProps &
    NoCodeComponentProps
) {
  const {
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
    // Grid styled components
    Container,
    InnerContainer,
    SpacerLeft,
    SpacerRight,
    Cards,
    LeftArrowWrapper,
    LeftArrowInnerWrapper,
    LeftArrow,
    RightArrowWrapper,
    RightArrowInnerWrapper,
    RightArrow,
    Root,
    itemContainers,
    itemInnerContainers,
    __easyblocks,
  } = props;

  const spacerRef = React.useRef(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const innerContainerRef = React.useRef<HTMLElement | null>(null);

  const leftArrowWrapperRef = React.useRef<HTMLElement | null>(null);
  const rightArrowWrapperRef = React.useRef<HTMLElement | null>(null);

  function getNextPos(
    scrollableContainer: HTMLElement,
    spacer: HTMLElement,
    items: Array<HTMLElement>,
    direction = 1
  ) {
    if (items.length === 0) {
      return 0;
    }

    const spacerWidth = spacer.getBoundingClientRect().width;

    const containerRect = scrollableContainer.getBoundingClientRect();
    const containerWidth = containerRect.width - spacerWidth * 2;

    let closestItem: HTMLElement;
    let closestDiff = 999999;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const left = item.getBoundingClientRect().left - containerRect.left;
      const diff = Math.abs(left + containerWidth * direction - spacerWidth);

      if (diff < closestDiff) {
        closestItem = item;
        closestDiff = diff;
      }
    }

    let pos =
      scrollableContainer.scrollLeft +
      (closestItem!.getBoundingClientRect().left -
        containerRect.left -
        spacerWidth);

    // snap to boundaries (1px problem)
    pos = Math.ceil(pos);

    if (Math.abs(pos) < 3) {
      pos = 0;
    }

    return pos;
  }

  const clickHandler = (directionRight: boolean) => {
    const itemNodes = Array.from(
      innerContainerRef.current!.querySelectorAll<HTMLElement>("[data-item]")
    );

    const newPos = getNextPos(
      containerRef.current!,
      spacerRef.current!,
      itemNodes,
      directionRight ? -1 : 1
    );

    containerRef.current!.scrollTo({ left: newPos, behavior: "smooth" });
  };

  React.useEffect(() => {
    function updateArrowsVisibility() {
      if (!containerRef.current) {
        return;
      }

      const isAtBeginning = containerRef.current.scrollLeft < 3;

      const scrollableWidth = containerRef.current.scrollWidth;
      const maxScrollLeftValue =
        scrollableWidth - containerRef.current.getBoundingClientRect().width;

      const isAtEnd =
        Math.abs(containerRef.current.scrollLeft - maxScrollLeftValue) < 3;

      leftArrowWrapperRef.current!.style.opacity = "1";
      rightArrowWrapperRef.current!.style.opacity = "1";

      const inactiveOpacity = __easyblocks.isEditing ? 1 : 0;

      if (isAtBeginning) {
        leftArrowWrapperRef.current!.style.opacity = inactiveOpacity.toString();
      }
      if (isAtEnd) {
        rightArrowWrapperRef.current!.style.opacity =
          inactiveOpacity.toString();
      }
    }

    containerRef.current!.addEventListener("scroll", updateArrowsVisibility);

    updateArrowsVisibility();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "scroll",
          updateArrowsVisibility
        );
      }
    };
  }, [__easyblocks.isEditing]);

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
        <Container.type
          {...Container.props}
          ref={containerRef}
          data-easyblocks-scrollable-root
        >
          <InnerContainer.type
            {...InnerContainer.props}
            ref={innerContainerRef}
          >
            <SpacerLeft.type {...SpacerLeft.props} ref={spacerRef} />
            {Cards.map((Card, index) => {
              const ItemContainer = itemContainers[index];
              const ItemInnerContainer = itemInnerContainers[index];

              return (
                <ItemContainer.type
                  {...ItemContainer.props}
                  data-item
                  key={index}
                >
                  <ItemInnerContainer.type {...ItemInnerContainer.props}>
                    <Card.type {...Card.props} />
                  </ItemInnerContainer.type>
                </ItemContainer.type>
              );
            })}
            <SpacerRight.type {...SpacerRight.props} ref={spacerRef} />
          </InnerContainer.type>
        </Container.type>

        <LeftArrowWrapper.type
          {...LeftArrowWrapper.props}
          ref={leftArrowWrapperRef}
        >
          <LeftArrowInnerWrapper.type {...LeftArrowInnerWrapper.props}>
            <LeftArrow.type
              {...LeftArrow.props}
              onClick={() => {
                clickHandler(false);
              }}
            />
          </LeftArrowInnerWrapper.type>
        </LeftArrowWrapper.type>

        <RightArrowWrapper.type
          {...RightArrowWrapper.props}
          ref={rightArrowWrapperRef}
        >
          <RightArrowInnerWrapper.type {...RightArrowInnerWrapper.props}>
            <RightArrow.type
              {...RightArrow.props}
              onClick={() => {
                clickHandler(true);
              }}
            />
          </RightArrowInnerWrapper.type>
        </RightArrowWrapper.type>
      </Root.type>
    </SectionWrapper>
  );
}

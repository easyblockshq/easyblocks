import React from "react";

export default function Grid(props: any) {
  const {
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
    horizontalLines,
    verticalLines,
    itemInnerContainers,
    isEditing,
  } = props;

  const spacerRef = React.useRef(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const innerContainerRef = React.useRef<HTMLElement | null>(null);

  const leftArrowWrapperRef = React.useRef<HTMLElement | null>(null);
  const rightArrowWrapperRef = React.useRef<HTMLElement | null>(null);

  // TODO: move this method to lazy-loaded payload!!!
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

      const inactiveOpacity = isEditing ? 1 : 0;

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
  }, []);

  return (
    <Root.type {...Root.props}>
      <Container.type
        {...Container.props}
        ref={containerRef}
        data-shopstory-scrollable-root
      >
        <InnerContainer.type {...InnerContainer.props} ref={innerContainerRef}>
          <SpacerLeft.type {...SpacerLeft.props} ref={spacerRef} />
          {Cards.map((Card: any, index: number) => {
            const ItemContainer = itemContainers[index];
            const ItemInnerContainer = itemInnerContainers[index];
            const HorizontalLine = horizontalLines[index];
            const VerticalLine = verticalLines[index];

            return (
              <ItemContainer.type
                {...ItemContainer.props}
                data-item
                key={index}
              >
                <HorizontalLine.type {...HorizontalLine.props} />
                <VerticalLine.type {...VerticalLine.props} />
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
  );
}

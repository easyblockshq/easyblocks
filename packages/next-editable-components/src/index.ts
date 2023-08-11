import dynamic from "next/dynamic";

const noCodeComponents = Object.freeze({
  $backgroundColor: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/BackgroundColor/BackgroundColor.client"
      )
  ),
  "$image.client": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Image/Image.client")
  ),
  "$image.editor": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Image/Image.editor")
  ),
  "$richText.client": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/RichText/RichText.client")
  ),
  "$richText.editor": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/RichText/RichText.editor")
  ),
  "$text.client": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Text/Text.client")
  ),
  "$text.editor": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Text/Text.editor")
  ),
  "$video.client": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Video/Video.client")
  ),
  "$video.editor": dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Video/Video.editor")
  ),
  $BannerCard: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/BannerCard/BannerCard.client")
  ),
  $BannerCard2: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/BannerCard2/BannerCard2.client")
  ),
  $BannerSection: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/BannerSection/BannerSection.client"
      )
  ),
  $BannerSection2: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/BannerSection2/BannerSection2.client"
      )
  ),
  $BasicCard: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/BasicCard/BasicCard.client")
  ),
  $BasicCardBackground: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/BasicCardBackground/BasicCardBackground.client"
      )
  ),
  $buttons: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Buttons/Buttons.client")
  ),
  $CardPlaceholder: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/CardPlaceholder/CardPlaceholder.client"
      )
  ),
  $ComponentContainer: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/ComponentContainer/ComponentContainer.client"
      )
  ),
  $Grid: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Grid/Grid.client")
  ),
  $GridCard: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/GridCard/GridCard.client")
  ),
  $icon: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Icon/Icon.client")
  ),
  $IconButton: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/IconButton/v1/IconButton.client")
  ),
  $IconButton2: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/IconButton/v2/IconButton.client")
  ),
  $Placeholder: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/Placeholder/Placeholder.client")
  ),
  $Playground: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Playground/Playground.client")
  ),
  $richTextBlockElement: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/RichText/RichTextBlockElement.client"
      )
  ),
  $richTextInlineWrapperElement: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/RichText/RichTextInlineWrapperElement.client"
      )
  ),
  $richTextLineElement: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/RichText/RichTextLineElement.client"
      )
  ),
  $richTextPart: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/RichText/RichTextPart.client")
  ),
  $RootGrid: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/RootGrid/RootGrid.client")
  ),
  // $RootSections: RootSections,
  $RootSections: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/RootSections/RootSections.client")
  ),
  $separator: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Separator/Separator.client")
  ),
  $stack: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Stack/Stack.client")
  ),
  $StandardButton: dynamic(
    // @ts-expect-error
    () =>
      import(
        "@easyblocks/editable-components/StandardButton/StandardButton.client"
      )
  ),
  $TokenButton: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/TokenButton/TokenButton.client")
  ),
  $TokenColor: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/TokenColor/TokenColor.client")
  ),
  $TokenFont: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/TokenFont/TokenFont.client")
  ),
  $TwoCards: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/TwoCards/TwoCards.client")
  ),
  $TwoCardsCard: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/TwoCardsCard/TwoCardsCard.client")
  ),
  $twoItems: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/TwoItems/TwoItems.client")
  ),
  $vimeoPlayer: dynamic(
    // @ts-expect-error
    () =>
      import("@easyblocks/editable-components/VimeoPlayer/VimeoPlayer.client")
  ),
  $Zone: dynamic(
    // @ts-expect-error
    () => import("@easyblocks/editable-components/Zone/Zone.client")
  ),
});

export { noCodeComponents };

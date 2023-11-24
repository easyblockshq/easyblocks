import BackgroundColor from "./$backgroundColor/$backgroundColor.client";
import Buttons from "./$buttons/$buttons.client";
import Icon from "./$icon/$icon.client";
import ImageClient from "./$image/$image.client";
import ImageEditor from "./$image/$image.editor";
import RichTextClient from "./$richText/$richText.client";
import RichTextEditor from "./$richText/$richText.editor";
import RichTextBlockElement from "./$richText/$richTextBlockElement/$richTextBlockElement.client";
import RichTextLineElement from "./$richText/$richTextLineElement/$richTextLineElement.client";
import RichTextInlineWrapperElement from "./$richText/$richTextInlineWrapperElement/$richTextInlineWrapperElement.client";
import RichTextPart from "./$richText/$richTextPart/$richTextPart.client";
import RootGrid from "./$RootGrid/$RootGrid.client";
import RootSections from "./$RootSections/$RootSections.client";
import Stack from "./$stack/$stack";
import TextClient from "./$text/$text.client";
import TextEditor from "./$text/$text.editor";
import TwoItems from "./$twoItems/$twoItems";
import VideoClient from "./$video/$video.client";
import VideoEditor from "./$video/$video.editor";
import BannerCard_v2 from "./BannerCard2/BannerCard2";
import BasicCard from "./BasicCard/BasicCard.client";
import CardPlaceholder from "./CardPlaceholder/CardPlaceholder.client";
import ComponentContainer from "./ComponentContainer/ComponentContainer.client";
import Grid from "./Grid/Grid";
import IconButton_v1 from "./IconButton/v1/IconButton";
import IconButton_v2 from "./IconButton/v2/IconButton";
import Placeholder from "./Placeholder/Placeholder";
import Playground from "./Playground/Playground.client";
import Separator from "./Separator/Separator";
import StandardButton from "./StandardButton/StandardButton.client";
import Token from "./Token/Token";
import TokenColor from "./TokenColor/TokenColor";
import TokenFont from "./TokenFont/TokenFont";
import TwoCards from "./TwoCards/TwoCards";
import VimeoPlayer from "./vimeoPlayer/vimeoPlayer.client";
import Zone from "./Zone/Zone.client";
import SectionWrapper from "./SectionWrapper/SectionWrapper";

const defaultEditableComponents = Object.freeze({
  "$image.client": ImageClient,
  "$image.editor": ImageEditor,
  "@easyblocks/rich-text.client": RichTextClient,
  "@easyblocks/rich-text.editor": RichTextEditor,
  "@easyblocks/text.client": TextClient,
  "@easyblocks/text.editor": TextEditor,
  "$video.client": VideoClient,
  "$video.editor": VideoEditor,
  $backgroundColor: BackgroundColor,
  // $BannerCard: BannerCard_v1,
  $BannerCard2: BannerCard_v2,
  // $BannerSection: SectionWrapper,
  $BannerSection2: SectionWrapper,
  $BasicCard: BasicCard,
  $BasicCardBackground: BasicCard,
  $buttons: Buttons,
  $CardPlaceholder: CardPlaceholder,
  $ComponentContainer: ComponentContainer,
  $Grid: SectionWrapper,
  $GridCard: Grid,
  $icon: Icon,
  $IconButton: IconButton_v1,
  $IconButton2: IconButton_v2,
  $Placeholder: Placeholder,
  $Playground: Playground,
  "@easyblocks/rich-text-block-element": RichTextBlockElement,
  "@easyblocks/rich-text-inline-wrapper-element": RichTextInlineWrapperElement,
  "@easyblocks/rich-text-line-element": RichTextLineElement,
  "@easyblocks/rich-text-part": RichTextPart,
  $RootGrid: RootGrid,
  $RootSections: RootSections,
  $separator: Separator,
  $stack: Stack,
  $StandardButton: StandardButton,
  $TokenButton: Token,
  $TokenColor: TokenColor,
  $TokenFont: TokenFont,
  $TwoCards: SectionWrapper,
  $TwoCardsCard: TwoCards,
  $twoItems: TwoItems,
  $vimeoPlayer: VimeoPlayer,
  $Zone: Zone,
});

function builtinEditableComponents(
  componentsOverrides: Partial<typeof defaultEditableComponents> = {}
) {
  return {
    ...defaultEditableComponents,
    ...componentsOverrides,
  };
}

const defaultBuiltinClientOnlyEditableComponents = Object.freeze({
  "$image.client": ImageClient,
  "@easyblocks/rich-text.client": RichTextClient,
  "@easyblocks/text.client": TextClient,
  "$video.client": VideoClient,
  $backgroundColor: BackgroundColor,
  // $BannerCard: BannerCard_v1,
  $BannerCard2: BannerCard_v2,
  // $BannerSection: SectionWrapper,
  $BannerSection2: SectionWrapper,
  $BasicCard: BasicCard,
  $BasicCardBackground: BasicCard,
  $buttons: Buttons,
  $CardPlaceholder: CardPlaceholder,
  $ComponentContainer: ComponentContainer,
  $Grid: SectionWrapper,
  $GridCard: Grid,
  $icon: Icon,
  $IconButton: IconButton_v1,
  $IconButton2: IconButton_v2,
  $Playground: Playground,
  "@easyblocks/rich-text-block-element": RichTextBlockElement,
  "@easyblocks/rich-text-inline-wrapper-element": RichTextInlineWrapperElement,
  "@easyblocks/rich-text-line-element": RichTextLineElement,
  "@easyblocks/rich-text-part": RichTextPart,
  $RootGrid: RootGrid,
  $RootSections: RootSections,
  $separator: Separator,
  $stack: Stack,
  $StandardButton: StandardButton,
  $TokenButton: Token,
  $TokenColor: TokenColor,
  $TokenFont: TokenFont,
  $TwoCards: SectionWrapper,
  $TwoCardsCard: TwoCards,
  $twoItems: TwoItems,
  $vimeoPlayer: VimeoPlayer,
  $Zone: Zone,
});

function builtinClientOnlyEditableComponents(
  componentsOverrides: Partial<
    typeof defaultBuiltinClientOnlyEditableComponents
  > = {}
) {
  return {
    ...defaultBuiltinClientOnlyEditableComponents,
    ...componentsOverrides,
  };
}

export { builtinEditableComponents, builtinClientOnlyEditableComponents };

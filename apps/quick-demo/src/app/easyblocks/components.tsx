"use client";
import { AlertAction } from "@/app/easyblocks/components/AlertAction/AlertAction";
import { BannerCard } from "@/app/easyblocks/components/BannerCard/BannerCard";
import { BannerSection } from "@/app/easyblocks/components/BannerSection/BannerSection";
import { Link } from "@/app/easyblocks/components/Link/Link";
import { ProductCard } from "@/app/easyblocks/components/ProductCard/ProductCard";
import { VimeoPlayer } from "@/app/easyblocks/components/VimeoPlayer/VimeoPlayer";
import { CoverCard } from "./components/BannerCard/CoverCard/CoverCard";
import { Button } from "./components/Button/Button";
import { ButtonGroup } from "./components/ButtonGroup/ButtonGroup";
import { Grid } from "./components/Grid/Grid";
import { Image } from "./components/Image/Image";
import { RootSectionStack } from "./components/RootSectionStack/RootSectionStack";
import { SolidColor } from "./components/SolidColor/SolidColor";
import { Stack } from "./components/Stack/Stack";
import { TwoCards } from "./components/TwoCards/TwoCards";
import { Video } from "./components/Video/Video";

const components = {
  ProductCard,
  Link,
  AlertAction,
  ProductPage: RootSectionStack,
  StandardPage: RootSectionStack,
  ButtonGroup,
  Button,
  Image,
  Video,
  Stack,
  Grid,
  TwoCards,
  SolidColor,
  CoverCard,
  BannerCard,
  BannerSection,
  VimeoPlayer,
};

export { components };

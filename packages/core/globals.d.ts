type ShopstoryFeatureStatus = "enabled" | "disabled";

type BooleanString = "true" | "false";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SHOPSTORY_FEATURE_RICH_TEXT_TEXT_MODIFIERS?: ShopstoryFeatureStatus;
    readonly NEXT_PUBLIC_SHOPSTORY_INTERNAL_COMPILATION_DEBUG?: BooleanString;
  }
}

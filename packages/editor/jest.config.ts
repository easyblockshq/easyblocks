import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  transform: {
    "\\.[jt]sx?$": ["babel-jest", { rootMode: "upward" }],
  },
  moduleNameMapper: {
    /**
     *  Currently used jest version doesn't accept "exports" in package.json of @easyblocks/core. That's why we remap _internals to dist/cjs/_internals directly.
     *  It seems that new updates in jest support this so when jest is upgraded, we can think of removing this.
     **/
    "@easyblocks/core/_internals": "@easyblocks/core/dist/cjs/_internals",
  },
};

export default config;

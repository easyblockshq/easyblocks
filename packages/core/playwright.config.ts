import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: [
    // {
    //   command: "npm run next -- -p 4001",
    //   url: "http://localhost:4001",
    // },
    // {
    //   port: 3001,
    //   reuseExistingServer: true,
    //   command: "npm run api",
    // },
    // {
    //   port: 54321,
    //   reuseExistingServer: true,
    //   command: "npm run supabase-start",
    // },
  ],
  use: {
    // video: "on",
    // screenshot: "on",
    baseURL: "http://localhost:3000/nocms/render-config",
  },
};

export default config;

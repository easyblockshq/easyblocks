import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  webServer: [
    // {
    //   port: 3010,
    //   reuseExistingServer: true,
    //   command: "npm run dev -- -p 3010",
    // },
    // {
    //   port: 54321,
    //   reuseExistingServer: true,
    //   command: "npm run supabase-start",
    // },
  ],
};
export default config;

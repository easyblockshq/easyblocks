/**
 *
 * The purpose of this function is to always find a correct URL of Shopstory backend app (mainly /api):
 * 1. Locally binds to localhost:3100 (it's our convention)
 * 2. If Vercel and building app project -> we just take VERCEL_URL. It allows editor.js to know how to find correct api endpoint.
 * 3. If Vercel is building demo project it should always know how to find linked backend from a monorepo
 */
export function getAppUrlRoot() {
  const isVercel = process.env.VERCEL === "1";

  /**
   * This condition is true for 2 use cases:
   * 1. Local development - localhost:3100. Local production build also uses localhost:3100.
   * 2. Publish. Before publishing package we should build `core` with explicitly set EASYBLOCKS_API_URL to production Vercel URL. It will go to npm.
   */
  if (!isVercel) {
    // For production we force EASYBLOCKS_API_URL to be set
    if (process.env.NODE_ENV === "production") {
      if (!process.env.EASYBLOCKS_API_URL) {
        throw new Error(
          "environment variable EASYBLOCKS_API_URL must be defined"
        );
      }
    }

    return process.env.EASYBLOCKS_API_URL ?? "http://localhost:3100";
  }

  // Vercel -> app build

  // const isVercelPreview = process.env.VERCEL_ENV === "preview";
  // const isVercelProduction = process.env.VERCEL_ENV === "production";

  // is project being build a backend
  const isApi = process.env.VERCEL_URL!.startsWith("api-");

  // building backend project, in this case backend URL is just VERCEL_URL
  if (isApi) {
    return "https://" + process.env.VERCEL_URL!;
  }
  // building some other project from a monorepo, we use Vercel naming convention here to connect to correct api/ url
  else {
    const normalizedBranchName = process.env.VERCEL_GIT_COMMIT_REF?.replaceAll(
      "/",
      "-"
    );

    return `https://api-git-${normalizedBranchName}-shopstoryapp.vercel.app`;
  }
}

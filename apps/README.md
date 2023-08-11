## Apps and internal packages

We use internal packages within our monorepo to share common code and to have nicely separated portions of code. This works
great until we start to consume 3rd party packages within those internal packages. PNPM creates isolated `node_modules` directory
for each project within the workspace which messes up the node resolution algorithm ex. app `app-1` consumes `internal-package-1`,
both of them uses the same version of `react`, but each package owns its own copy. These can lead to bugs with resolving correct
dispatcher, correct context etc. We want our apps to treat our internal packages as real NPM packages and treat all of its 3rd party
dependencies as peer dependencies. To make our apps work this way we modify our apps Webpack configs by putting apps `node_modules` directory
to be first directory to look for external modules ex.

```js
const nextConfig = {
  webpack: (config) => {
    // This will tell Webpack to first look for modules within the `node_modules` directory of an app
    config.resolve.modules.unshift(path.resolve(__dirname, "node_modules"));

    return config;
  },
};
```

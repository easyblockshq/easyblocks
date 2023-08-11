import { getAppUrlRoot } from "@easyblocks/utils";

function getScriptUrl(scriptName: string) {
  return `${getAppUrlRoot()}/${scriptName}`;
}

export async function loadScript(scriptName: string) {
  const scriptUrl = getScriptUrl(scriptName);

  console.debug(
    `[Shopstory] Loading script ${scriptName} from the endpoint: ${scriptUrl}`
  );

  try {
    const scriptBundle = await import(
      /* webpackIgnore: true */
      scriptUrl
    );

    return scriptBundle;
  } catch (error) {
    const errorMessage = `[Shopstory] Can't access script ${scriptName} on the endpoint: ${scriptUrl}`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

export async function loadCompilerScript(): Promise<any> {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    return loadScript("compiler.js");
  } else {
    const url = getScriptUrl("compiler.cjs.js");
    const compilerScriptSource = await (
      await fetch(
        url,
        process.env.NODE_ENV === "development"
          ? { cache: "no-store" }
          : undefined
      )
    ).text();

    const vm = await import("vm");
    const script = new vm.Script(compilerScriptSource);
    const loadedModule = { exports: {} };
    // `exports` and `module` are required because Webpack's UMD loader checks for existence of both of them.
    const context = vm.createContext({
      exports: {},
      module: loadedModule,
    });
    script.runInContext(context);
    return loadedModule.exports;
  }
}

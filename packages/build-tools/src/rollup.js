/**
 * Rollup output plugin that converts content of chunk to module exporting chunk's content as a string.
 * @return {import('rollup').Plugin}
 */
function rawPlugin() {
  return {
    name: "raw",
    renderChunk(code) {
      return {
        code: `const code = ${JSON.stringify(code)}; export default code;`,
        map: { mappings: "" },
      };
    },
    generateBundle(bundle) {
      if (!bundle.file) {
        return null;
      }

      const componentIdentifierMatch = bundle.file.match(
        /(([$a-zA-z0-9]+)(\.(client|editor))?)\.js$/
      );

      if (!componentIdentifierMatch) {
        throw new Error("Missing identifier");
      }

      this.emitFile({
        type: "asset",
        fileName: `${componentIdentifierMatch[1]}.d.ts`,
        source: "declare const code: string;\nexport default code\n",
      });
    },
  };
}

function reactGlobals() {
  return {
    react: "__SHOPSTORY_REACT_SCOPE__.React",
    "react-dom": "__SHOPSTORY_REACT_SCOPE__.ReactDOM",
  };
}

module.exports = {
  rawPlugin,
  reactGlobals,
};

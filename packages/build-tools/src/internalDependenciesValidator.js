/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
/**
 *
 * @param {string} packageName
 */
function internalDependenciesValidator() {
  const packageJson = require(`${process.cwd()}/package.json`);

  const { dependencies, devDependencies } = packageJson;

  const internalDependencies = Object.keys(devDependencies).filter(
    (name) =>
      name.startsWith("@easyblocks/") &&
      name.indexOf("build-tools") === -1 &&
      name !== "@easyblocks/editable-components"
  );

  const packageDependencies = new Set(Object.keys(dependencies));
  const missingDependencies = new Set();

  for (const internalDependency of internalDependencies) {
    const internalDependencyPackageJsonPath = path.resolve(
      process.cwd(),
      "..",
      internalDependency.split("/")[1],
      "./package.json"
    );

    const internalDependencyPackageJson = require(internalDependencyPackageJsonPath);
    const internalDependencyDependencies = Object.keys(
      internalDependencyPackageJson.dependencies ?? {}
    );

    for (const internalDependencyDependency of internalDependencyDependencies) {
      if (
        !internalDependencyDependency.startsWith("@easyblocks/") &&
        !internalDependencyDependency.startsWith("@types") &&
        !packageDependencies.has(internalDependencyDependency) &&
        !missingDependencies.has(internalDependencyDependency)
      ) {
        missingDependencies.add(internalDependencyDependency);
      }
    }
  }

  if (missingDependencies.size > 0) {
    const error = `Package ${
      packageJson.name
    } is missing below dependencies:\n${Array.from(missingDependencies)
      .map((dependency) => `- ${dependency}\n`)
      .join("")}`;

    if (false && process.env.NODE_ENV === "production") {
      throw new Error(error);
    } else {
      console.error(error);
    }
  }
}

module.exports = {
  internalDependenciesValidator,
};

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
/**
 *
 * @param {string} packageName
 */
function internalDependenciesValidator() {
  const packageJson = require(`${process.cwd()}/package.json`);

  const internalDependencies = Object.keys(packageJson.devDependencies).filter(
    (name) =>
      name.startsWith("@easyblocks/") && name.indexOf("build-tools") === -1
  );

  const packageDependencies = new Set(Object.keys(packageJson.dependencies));
  const packagePeerDependencies = new Set(
    Object.keys(packageJson.peerDependencies ?? [])
  );
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
        !packagePeerDependencies.has(internalDependencyDependency) &&
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

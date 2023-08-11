// @ts-check
import { spawnSync } from "node:child_process";
import { exit } from "node:process";

const nodeVersionOutput = spawnSync("node", ["-v"]);

if (!/^v16\.*/.test(nodeVersionOutput.stdout.toString())) {
  console.error("Please use Node.js 16.x");
  exit(1);
}

const npmVersionOutput = spawnSync("npm", ["-v"]);

if (!/^8\.*/.test(npmVersionOutput.stdout.toString())) {
  console.error("Please use NPM 8.x");
  exit(1);
}

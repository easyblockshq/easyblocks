// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
const path = require("node:path");

const NODE_ENV =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isProduction = NODE_ENV === "production";
const isDevelopment = NODE_ENV === "development";

const { parsed } = dotenv.config({
  path: path.join(__dirname, `../../../.env.${NODE_ENV}`),
});

/** @type {Record<string, string | undefined>} */
const envs = {
  ...process.env,
  NODE_ENV,
  ...parsed,
  EASYBLOCKS_API_URL: process.env.EASYBLOCKS_API_URL ?? "http://localhost:3100",
  VERCEL: process.env.VERCEL ?? "0",
};

function getFullySpecifiedEnvs() {
  const fullySpecifiedEnvs = Object.fromEntries(
    Object.entries(envs).map(([envName, envValue]) => {
      return [`process.env.${envName}`, JSON.stringify(envValue)];
    })
  );

  return fullySpecifiedEnvs;
}

module.exports = {
  isProduction,
  isDevelopment,
  getFullySpecifiedEnvs,
};

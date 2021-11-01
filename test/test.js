"use strict";

// Require Node.js Dependencies
const { join } = require("path");
const { spawnSync } = require("child_process");

// Require Third-party Dependencies
const japa = require("japa");
const is = require("@slimio/is");

// Require Internal Dependencies
const { outdated } = require("../");

// CONSTANTS
const EXEC_SUFFIX = process.platform === "win32";

japa("exported must be a function", (assert) => {
  assert.isTrue(is.asyncFunction(outdated), "outdated must be a Asynchronous Function");
});

japa("get members of current project", async(assert) => {
  const cwd = join(__dirname, "..");
  const { stdout } = spawnSync(`npm${EXEC_SUFFIX ? ".cmd" : ""}`, ["outdated", "--json"], {
    cwd
  });
  const str = stdout.toString().trim();
  const json = str.length === 0 ? {} : JSON.parse(str);

  const deps = await outdated(cwd, { devDependencies: true });
  assert.isTrue(is.plainObject(deps), "deps must be plainObject");
  assert.deepEqual(deps, json, "npm outdated and deps must be equal!");
}).timeout(10000);

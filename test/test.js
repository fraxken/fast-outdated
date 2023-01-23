"use strict";

// Require Node.js Dependencies
const { join } = require("path");
const { spawnSync } = require("child_process");
const { describe, it } = require("node:test");
const assert = require("assert/strict");

// Require Third-party Dependencies
const is = require("@slimio/is");

// Require Internal Dependencies
const { outdated } = require("../");

// CONSTANTS
const EXEC_SUFFIX = process.platform === "win32";

describe("outdated", () => {
  it("should export an asynchronous function", () => {
    assert.ok(
      is.asyncFunction(outdated),
      "outdated must be a Asynchronous Function"
    );
  });

  it("it should fetch outdated dependencies of current project", async() => {
    const cwd = join(__dirname, "..");
    const { stdout } = spawnSync(`npm${EXEC_SUFFIX ? ".cmd" : ""}`, ["outdated", "--json"], {
      cwd
    });
    const str = stdout.toString().trim();
    const json = str.length === 0 ? {} : JSON.parse(str);

    const deps = await outdated(cwd, { devDependencies: true });

    assert.ok(is.plainObject(deps), "deps must be plainObject");
    assert.deepEqual(deps, json, "npm outdated and deps must be equal!");
  });
});

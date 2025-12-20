// Import Node.js Dependencies
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import Third-party Dependencies
import is from "@slimio/is";

// Import Internal Dependencies
import { outdated } from "../src/index.ts";

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
    const cwd = join(import.meta.dirname, "..");
    const { stdout } = spawnSync([
      `npm${EXEC_SUFFIX ? ".cmd" : ""}`,
      "outdated",
      "--json"
    ].join(" "), {
      cwd,
      shell: true
    });
    const str = stdout.toString().trim();
    const json = str.length === 0 ? {} : JSON.parse(str);

    const deps = await outdated(cwd, { devDependencies: true });

    assert.ok(is.plainObject(deps), "deps must be plainObject");
    assert.deepEqual(deps, json, "npm outdated and deps must be equal!");
  });
});

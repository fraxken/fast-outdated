// Require Node.js Dependencies
const { join } = require("path");

// Require Third-party Dependencies
const japa = require("japa");
const is = require("@slimio/is");

// Require Internal Dependencies
const outdated = require("../");

japa("exported must be a function", (assert) => {
    assert.isTrue(is.asyncFunction(outdated), "outdated must be a Asynchronous Function");
});

japa("get members of current project", async(assert) => {
    const deps = await outdated(join(__dirname, ".."));
    assert.isTrue(is.plainObject(deps));
});

"use strict";

/**
 * @namespace Utils
 */

/**
 * @function cleanRange
 * @description Clean up range (as possible).
 * @memberof Utils#
 * @param {!string} version version
 * @returns {string}
 *
 * @example
 * const assert = require("assert").strict;
 *
 * const ret = cleanRange("^1.0.0");
 * assert.equal(ret, "1.0.0");
 *
 * @see https://github.com/npm/node-semver#ranges
 */
function cleanRange(version) {
    const firstChar = version.charAt(0);
    if (firstChar === "^" || firstChar === "<" || firstChar === ">" || firstChar === "=") {
        return version.slice(version.charAt(1) === "=" ? 2 : 1);
    }

    return version;
}

module.exports = { cleanRange };

// Require Node.js Dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");

// Require Third-party Dependencies
const pacote = require("pacote");
const semver = require("semver");

/**
 * @func cleanRange
 * @desc Clean up range (as possible).
 * @param {!String} version version
 * @returns {String}
 */
function cleanRange(version) {
    const firstChar = version.charAt(0);
    if (firstChar === "^" || firstChar === "<" || firstChar === ">" || firstChar === "=") {
        return version.slice(version.charAt(1) === "=" ? 2 : 1);
    }

    return version;
}

/**
 * @async
 * @func fetch
 * @desc Fetch package metadata with pacote and return all versions information
 * @param {!String} name package name
 * @param {!String} current package version (range).
 * @returns {Promise<any>}
 */
async function fetch(name, current) {
    const { versions, "dist-tags": { latest } } = await pacote.packument(name);
    const cleanCurrent = cleanRange(current);
    if (semver.satisfies(latest, current) && !current.includes("||") && semver.eq(latest, cleanCurrent)) {
        return {};
    }

    const satisfies = Object.keys(versions).filter((ver) => semver.satisfies(ver, current));
    const location = join("node_modules", ...name.split("/"));

    let wanted = satisfies.length === 0 ? latest : satisfies.pop();
    if (semver.eq(cleanCurrent, wanted)) {
        wanted = latest;
    }

    return { [name]: { current, latest, wanted, location } };
}

/**
 * @async
 * @func outdated
 * @desc Fast Programmaticaly alternative to npm outdated
 * @param {String} [cwd] working dir where we will search for packages
 * @param {Object=} options options
 * @param {Boolean} [options.devDependencies=false] search for devDependencies
 * @returns {Promise<any>}
 */
async function outdated(cwd = process.cwd(), options = {}) {
    const { devDependencies: allowDev = false } = options;

    const str = await readFile(join(cwd, "package.json"), "utf-8");
    const { dependencies = {}, devDependencies = {} } = JSON.parse(str);
    const deps = Object.assign(dependencies, allowDev ? devDependencies : {});

    const packagesToUpdate = await Promise.all(
        Object.entries(deps).map(([name, current]) => fetch(name, current))
    );

    return { ...packagesToUpdate };
}

module.exports = outdated;

// Require Node.js Dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");

// Require Third-party Dependencies
const pacote = require("pacote");
const semver = require("semver");

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

    const satisfies = Object.keys(versions).filter((ver) => semver.satisfies(ver, current));
    const wanted = satisfies.length === 0 ? latest : satisfies.pop();
    const location = join("node_modules", ...name.split("/"));

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
    const { devDependencies = false } = options;

    // Read and parse package.json
    const str = await readFile(join(cwd, "package.json"), "utf-8");
    const pkg = JSON.parse(str);

    const deps = Object.assign(pkg.dependencies || {}, devDependencies ? pkg.devDependencies || {} : {});
    const results = await Promise.all(
        Object.entries(deps).map(([name, current]) => fetch(name, current))
    );

    return Object.assign(...results);
}

module.exports = outdated;

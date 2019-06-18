// Require Node.js Dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");

// Require Third-party Dependencies
const pacote = require("pacote");
const semver = require("semver");

// Require Internal Dependencies
const { cleanRange } = require("./src/utils");

/**
 * @async
 * @func fetch
 * @desc Fetch package metadata with pacote and return all versions information
 * @param {!String} name package name
 * @param {!String} current package version (range).
 * @param {String=} token npm token
 * @returns {Promise<any>}
 */
async function fetch(name, current, token) {
    const options = typeof token === "string" ? { token } : {};
    const { versions, "dist-tags": { latest } } = await pacote.packument(name, options);
    const cleanCurrent = cleanRange(current);

    if (semver.satisfies(latest, current) && !current.includes("||") && semver.eq(latest, cleanCurrent)) {
        return {};
    }
    const wanted = Object.keys(versions).reverse().find((ver) => semver.satisfies(ver, current)) || latest;

    return {
        [name]: {
            current, latest,
            wanted: semver.eq(cleanCurrent, wanted) ? latest : wanted,
            location: join("node_modules", ...name.split("/"))
        }
    };
}

/**
 * @async
 * @func outdated
 * @desc Fast Programmaticaly alternative to npm outdated
 * @param {String} [cwd] working dir where we will search for packages
 * @param {Object=} options options
 * @param {Boolean} [options.devDependencies=false] search for devDependencies
 * @param {String} [options.token] npm token
 * @returns {Promise<any>}
 */
async function outdated(cwd = process.cwd(), options = {}) {
    const { devDependencies: allowDev = false, token } = options;

    const str = await readFile(join(cwd, "package.json"), "utf-8");
    const { dependencies = {}, devDependencies = {} } = JSON.parse(str);
    const deps = Object.assign(dependencies, allowDev ? devDependencies : {});

    const rejected = [];
    const packagesToUpdate = await Promise.all(
        Object.entries(deps).map(([name, current]) => fetch(name, current, token).catch(() => rejected.push(name)))
    );
    rejected.forEach((name) => console.error(`Unable to fetch metadata for package ${name}`));

    return Object.assign(...packagesToUpdate);
}

module.exports = outdated;

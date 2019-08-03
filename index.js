"use strict";

// Require Node.js Dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");

// Require Third-party Dependencies
const pacote = require("pacote");
const semver = require("semver");

/**
 * @async
 * @function fetch
 * @description Fetch package metadata with pacote and return all versions information
 * @param {!string} name package name
 * @param {!string} range package version (range).
 * @param {object} [options] options
 * @param {string} [options.cwd]
 * @param {string} [options.token]
 * @returns {Promise<any>}
 */
async function fetch(name, range, { cwd, token }) {
    const options = typeof token === "string" ? { token } : {};

    try {
        const { versions, "dist-tags": { latest } } = await pacote.packument(name, options);
        const location = join("node_modules", ...name.split("/"));

        // NOTE: can we fetch the right current version without fs ?
        const rawPkg = await readFile(join(cwd, location, "package.json"), "utf-8");
        const { version: current } = JSON.parse(rawPkg);

        if (semver.eq(latest, current)) {
            return {};
        }
        const wanted = semver.maxSatisfying(Object.keys(versions), range) || latest;

        return {
            [name]: { current, latest, wanted, location }
        };
    }
    catch (error) {
        return {};
    }
}

/**
 * @async
 * @function outdated
 * @description Fast Programmaticaly alternative to npm outdated
 * @param {string} [cwd] working dir where we will search for packages
 * @param {object} [options] options
 * @param {boolean} [options.devDependencies=false] search for devDependencies
 * @param {string} [options.token] npm token
 * @returns {Promise<any>}
 */
async function outdated(cwd = process.cwd(), options = {}) {
    const { devDependencies: allowDev = false, token } = options;

    const str = await readFile(join(cwd, "package.json"), "utf-8");
    const { dependencies = {}, devDependencies = {} } = JSON.parse(str);
    const deps = Object.assign(dependencies, allowDev ? devDependencies : {});

    const rejected = [];
    const packagesToUpdate = await Promise.all(
        Object.entries(deps).map(([name, current]) => fetch(name, current, { cwd, token }).catch(() => rejected.push(name)))
    );
    rejected.forEach((name) => console.error(`Unable to fetch metadata for package ${name}`));

    return Object.assign(...packagesToUpdate);
}

/**
 * @function clearCache
 * @description Clear memoized pacote cache
 * @returns {any}
 */
function clearCache() {
    return pacote.clearMemoized();
}

module.exports = { outdated, clearCache };

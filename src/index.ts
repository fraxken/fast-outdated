// Import Node.js Dependencies
import fs from "node:fs/promises";
import path from "node:path";

// Import Third-party Dependencies
import pacote from "pacote";
import semver from "semver";

export interface PackageUpdate {
  wanted: string;
  current: string;
  latest: string;
  location: string;
}

export interface OutdatedOptions {
  devDependencies?: boolean;
  token?: string;
}

/**
 * @description Fetch package metadata with pacote and return all versions information
 */
async function fetch(
  name: string,
  range: string,
  { cwd, token }: { cwd: string; token?: string }
): Promise<Record<string, PackageUpdate>> {
  const options = typeof token === "string" ? { token } : {};

  try {
    const { versions, "dist-tags": { latest } } = await pacote.packument(name, options);
    const location = path.join("node_modules", ...name.split("/"));

    // NOTE: can we fetch the right current version without fs ?
    const rawPkg = await fs.readFile(
      path.join(cwd, location, "package.json"),
      "utf-8"
    );
    const { version: current } = JSON.parse(rawPkg);

    if (semver.eq(latest, current)) {
      return {};
    }
    const wanted = semver.maxSatisfying(Object.keys(versions), range) || latest;

    return {
      [name]: { current, latest, wanted, location }
    };
  }
  catch {
    return {};
  }
}

/**
 * @description Fast Programmaticaly alternative to npm outdated
 */
export async function outdated(
  cwd = process.cwd(),
  options: OutdatedOptions = {}
): Promise<Record<string, PackageUpdate>> {
  const {
    devDependencies: includeDevDependencies = false,
    token
  } = options;

  const str = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
  const { dependencies = {}, devDependencies = {} } = JSON.parse(str);
  const deps = Object.assign(
    dependencies,
    includeDevDependencies ? devDependencies : {}
  );

  const packagesToUpdate = (await Promise.allSettled(
    Object.entries(deps).map(([name, current]) => fetch(name, current as string, { cwd, token }))
  ))
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return Object.assign({}, ...packagesToUpdate);
}

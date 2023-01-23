# Fast-outdated
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/fraxken/fast-outdated/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![size](https://img.shields.io/bundlephobia/min/fast-outdated.svg)
[![Known Vulnerabilities](https://snyk.io//test/github/fraxken/fast-outdated/badge.svg?targetFile=package.json)](https://snyk.io//test/github/fraxken/fast-outdated?targetFile=package.json)

Fast and Programmatically `npm outdated --json` implementation that use [pacote](https://github.com/zkat/pacote#options) to achieve similar result.

## Requirements
- [Node.js](https://nodejs.org/en/) v16 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i fast-outdated
# or
$ yarn add fast-outdated
```

## Usage example
```js
const { outdated, clearCache } = require("fast-outdated");

async function main() {
    clearCache();
    const data = await outdated(void 0, { devDependencies: true });
    console.log(JSON.stringify(data, null, 4));
}
main().catch(console.error);
```

## API

```ts
declare namespace Outdated {
    interface Packages {
        [packageName: string]: {
            wanted: string;
            current: string;
            latest: string;
            location: string;
        }
    }

    interface Options {
        devDependencies?: boolean;
        token?: string;
    }

    export function outdated(cwd?: string, options?: Options): Promise<Packages>;
    export function clearCache(): any;
}

export as namespace Outdated;
export = Outdated;
```

### outdated(cwd?: string, options?: Outdated.Options): Promise< Outdated.Packages >
Will give you equivalent result that the command `npm outdated --json`. The default cwd value will be equal to `process.cwd()`.

Options:

| name | default value | description |
| --- | --- | --- |
| devDependencies | false | Include devDependencies |
| token | undefined | npm token for private packages |

### clearCache()
Call `pacote.clearMemoized`.

## Roadmap
- Improve test suite

## License
MIT

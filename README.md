# Fast-outdated
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/fraxken/fast-outdated/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![size](https://img.shields.io/bundlephobia/min/fast-outdated.svg)
[![Known Vulnerabilities](https://snyk.io//test/github/fraxken/fast-outdated/badge.svg?targetFile=package.json)](https://snyk.io//test/github/fraxken/fast-outdated?targetFile=package.json)

Fast and Programmatically `npm outdated --json` implementation that use [pacote](https://github.com/zkat/pacote#options) to achieve similar result.

## Requirements
- [Node.js](https://nodejs.org/en/) v24 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i fast-outdated
# or
$ yarn add fast-outdated
```

## Usage example

```js
import { outdated } from "fast-outdated";

await outdated(void 0, { devDependencies: true })
```

## API

```ts
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
```

### outdated(cwd?: string, options?: OutdatedOptions): Promise< Record< string, PackageUpdate > >
Will give you equivalent result that the command `npm outdated --json`. The default cwd value will be equal to `process.cwd()`.

Options:

| name | default value | description |
| --- | --- | --- |
| devDependencies | false | Include devDependencies |
| token | undefined | npm token for private packages |

## License
MIT

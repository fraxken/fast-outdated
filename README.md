# Fast-outdated
![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Fast and Programmatically `npm outdated --json` implementation that use [pacote](https://github.com/zkat/pacote#options) to achieve similar result.

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i fast-outdated
# or
$ yarn add fast-outdated
```

## Usage example
```js
const outdated = require("fast-outdated");

async function main() {
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
    }
}

declare function Outdated(cwd?: string, options?: Outdated.Options): Promise<Outdated.Packages>;
```

### Outdated(cwd?: string, options?: Outdated.Options): Promise< Outdated.Packages >
Will give you equivalent result that the command `npm outdated --json`. The default cwd value will be equal to `process.cwd()`.

Options:

| name | default value | description |
| --- | --- | --- |
| devDependencies | false | Include devDependencies |

## Roadmap
- Look to improve if wanted is equal to current (but not equal to latest). In this case we have to cleanup ranges..

## License
MIT

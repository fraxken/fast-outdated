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

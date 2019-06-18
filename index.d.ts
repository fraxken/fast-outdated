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
}

declare function Outdated(cwd?: string, options?: Outdated.Options): Promise<Outdated.Packages>;

export as namespace Outdated;
export = Outdated;

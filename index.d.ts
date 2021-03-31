declare namespace Outdated {
    interface PackageUpdate {
        wanted: string;
        current: string;
        latest: string;
        location: string;
    }
    type Packages = Record<string, PackageUpdate>;

    interface Options {
        devDependencies?: boolean;
        token?: string;
    }

    export function outdated(cwd?: string, options?: Options): Promise<Packages>;
}

export as namespace Outdated;
export = Outdated;

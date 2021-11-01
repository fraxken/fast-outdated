declare namespace Outdated {
  export interface PackageUpdate {
    wanted: string;
    current: string;
    latest: string;
    location: string;
  }
  export type Packages = Record<string, PackageUpdate>;

  export interface OutdatedOptions {
    devDependencies?: boolean;
    token?: string;
  }

  export function outdated(cwd?: string, options?: OutdatedOptions): Promise<Packages>;
}

export as namespace Outdated;
export = Outdated;

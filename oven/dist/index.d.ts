import { BunPlugin } from 'bun';
import { RollupOptions, OutputOptions } from 'rollup';

type _minify = {
    identifiers?: boolean;
    whitespace?: boolean;
    syntax?: boolean;
};
type ovenOptions = {
    files: string[];
    target?: "browser" | "bun";
    define?: Record<string, any>;
    hashAsset?: boolean;
    external?: string[];
    drop?: string[];
    plugins?: BunPlugin[];
    out?: string;
    dir?: string;
    base?: string;
    minify?: _minify;
    successFN?: () => Promise<void>;
};
declare class Oven {
    dir: string;
    out: string;
    minify: _minify;
    hashAsset: boolean;
    drop: any;
    files: string[];
    external: string[];
    plugins: BunPlugin[];
    exclude: string[];
    target: string;
    define: Record<string, any>;
    private clearing?;
    protected successFN?: (() => Promise<void>) | undefined;
    constructor({ files, target, dir, out, base, define, external, drop, plugins, hashAsset, minify, successFN, }: ovenOptions);
    set onsuccess(fn: () => Promise<void>);
    build(): Promise<this>;
    watch(condition?: (filename: string) => boolean): Promise<void>;
    clear(c?: {
        exclude?: string[];
        all?: boolean;
    }): Promise<this>;
}

/**
 * const RP = new Roll({input: "./types/index.d.ts"});

await RP.output({
  file: "./dist/index.d.ts",
  format: "es",
});
 */
declare class Roll {
    log: boolean;
    options: Omit<RollupOptions, "output">;
    constructor(options: Omit<RollupOptions, "output"> & {
        log?: boolean;
    });
    output(out: OutputOptions): Promise<void>;
}

declare function Cmd(cmd: string, log?: boolean): Promise<void>;

export { Cmd, Oven, Roll };

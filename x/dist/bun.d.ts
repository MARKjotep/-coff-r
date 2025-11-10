import { BunFile } from 'bun';

declare class Envy {
    private path;
    private envPath?;
    constructor(path: string, envPath?: string | undefined);
    init(): Promise<this>;
    secret(): string;
    tls(): Record<string, BunFile>;
}

declare const isPath: (path: string) => Promise<boolean>;
declare const isFile: (path: string, data?: string) => Promise<boolean>;
declare const isDir: (path: string) => Promise<boolean>;

interface fs {
    [key: string]: string | undefined | boolean | number;
}
declare class JSONCacher<T extends fs> {
    fs: string;
    f_timed: number;
    data: Map<any, T>;
    key: string;
    dir: string;
    constructor({ dir, fs, key }: {
        dir: string;
        fs: string;
        key: string;
    });
    init(): Promise<void>;
    get(val: string | undefined): Promise<T | null>;
    queue(): Promise<void>;
    set(data: T): Promise<boolean>;
    delete(key: string): Promise<void>;
    json(): Promise<any>;
}

declare const Digest: (secret: string, ...salt: string[]) => Buffer<ArrayBufferLike>;

export { Digest, Envy, JSONCacher, isDir, isFile, isPath };

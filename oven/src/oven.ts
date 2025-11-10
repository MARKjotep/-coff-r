import type { BunPlugin } from "bun";
import { isDir, logDate } from "./@";
import { watch } from "node:fs";
import { readdir, rm, stat, unlink } from "node:fs/promises";
import path from "node:path";

// ---  ---------------------------------------------------------------

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

// ---  ---------------------------------------------------------------

export class Oven {
  dir: string;
  out: string;
  minify: _minify;
  hashAsset: boolean;
  drop: any;
  files: string[];
  external: string[];
  plugins: BunPlugin[];
  exclude: string[] = [];
  target: string;
  define: Record<string, any> = {};
  private clearing?: boolean = false;
  protected successFN?: (() => Promise<void>) | undefined;
  constructor({
    //
    files,
    target = "bun",
    dir = "./src",
    out,
    base = "",
    // ---  ---------------------------------------------------------------
    define = {},
    external = [],
    drop = [],
    plugins = [],
    hashAsset,
    minify = {},
    successFN,
  }: ovenOptions) {
    //
    this.target = target;
    this.dir = dir + base;
    this.out =
      (out ? out : target === "browser" ? "./client" : "./dist") + base;
    this.files = files.map((m) => (this.dir + "/" + m).replaceAll("//", "/"));

    isDir(this.out);
    // ---  ---------------------------------------------------------------

    this.hashAsset = hashAsset === undefined ? false : hashAsset;
    this.minify = { identifiers: true, whitespace: true, syntax: true };

    // ---  ---------------------------------------------------------------
    this.external = external;
    this.drop = drop;
    this.plugins = plugins;

    this.successFN = successFN;
    Object.assign(this.minify, minify);
    Object.assign(this.define, define);
  }
  set onsuccess(fn: () => Promise<void>) {
    this.successFN = fn;
  }
  async build() {
    const asset = `[dir]/[name]${this.hashAsset ? "-[hash]" : ""}.[ext]`;

    if (this.files.length) {
      try {
        const Build = await Bun.build({
          entrypoints: this.files,
          outdir: this.out,
          splitting: true,
          minify: this.minify,
          target: (this.target as "browser") ?? "browser",
          naming: {
            chunk: "[dir]/[name]-[hash].[ext]",
            entry: "[dir]/[name].[ext]",
            asset,
          },
          define: {
            ...ProcessDefine(this.define),
          },
          loader: {
            ".css": "file",
          },
          external: this.external,
          drop: this.drop,
          plugins: this.plugins,
        });

        if (Build.success) {
          // run fn here
          try {
            await this.successFN?.();
            logDate("builder");
            //
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log(Build.logs);
        }
      } catch (e) {
        console.log(e);
      }
    }

    return this;
  }
  async watch(condition: (filename: string) => boolean = () => true) {
    const watcher = watch(
      this.dir,
      { recursive: true },
      async (event, filename) => {
        if (filename && condition(filename)) {
          this.clearing && this.clear();
          try {
            await this.build();
          } catch (e) {
            console.error(e);
          }
        }
      },
    );

    process.on("SIGINT", () => {
      console.log("\nwatcher closed...");
      watcher.close();
      process.exit(0);
    });
  }
  async clear(
    c: { exclude?: string[]; all?: boolean } = { exclude: [], all: false },
  ) {
    //
    c.exclude && c.exclude.length && this.exclude.push(...c.exclude);

    this.clearing = true;

    const recurse = async (_PATH: string) => {
      const dirs = await readdir(_PATH);
      if (dirs.length == 0) {
        await rm(_PATH, { recursive: true });
        return;
      }
      for (const ff of dirs) {
        if (
          ff.startsWith(".") ||
          (!c.all && (ff.endsWith(".html") || this.exclude.includes(ff)))
        ) {
          return;
        }
        const _path = path.join(_PATH, ff);
        if ((await stat(_path)).isDirectory()) {
          await recurse(_path);
        } else {
          await unlink(_path);
        }
      }
    };

    await recurse(this.out);

    return this;
  }
}

const ProcessDefine = (define: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(define).map(([k, v]) => {
      let lv = v;
      if (typeof v === "function") {
        lv = v();
      }
      return [k, JSON.stringify(lv)];
    }),
  );
};

// ---  ---------------------------------------------------------------

import type { RollupOptions, OutputOptions } from "rollup";
import { rollup } from "rollup";
import { dts } from "rollup-plugin-dts";
import { Cmd } from "./cmd";
import { logDate } from "./@";

/**
 * const RP = new Roll({input: "./types/index.d.ts"});

await RP.output({
  file: "./dist/index.d.ts",
  format: "es",
});
 */
export class Roll {
  log: boolean;
  options: Omit<RollupOptions, "output">;
  constructor(options: Omit<RollupOptions, "output"> & { log?: boolean }) {
    options.plugins = options.plugins
      ? Array.isArray(options.plugins)
        ? [...options.plugins, dts()]
        : [options.plugins, dts()]
      : [dts()];

    const { log, ...opts } = options;
    this.options = opts;
    this.log = Boolean(log);

    delete options.log;
  }
  async output(out: OutputOptions) {
    try {
      const rp = await rollup(this.options);
      await rp.write(out);
      await rp.close();
      this.log && logDate("rollup");
    } catch (error) {
      console.error("Build failed:", error);
    }
  }
}

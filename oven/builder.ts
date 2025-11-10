import { Oven, Roll, Cmd } from "./src";

const OV = new Oven({
  files: ["."],
  external: ["rollup", "rollup-plugin-dts"],
});

const RP = new Roll({
  input: "./types/index.d.ts",
});

OV.onsuccess = async () => {
  await Cmd("tsc");
  await RP.output({ file: "./dist/index.d.ts", format: "es" });
};

await OV.build();

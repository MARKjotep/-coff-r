import { Oven, Roll, Cmd } from "@coff-r/oven";

const RP = new Roll({
  input: "./types/index.d.ts",
});
const BN = new Roll({
  input: "./types/bun.d.ts",
});

const OV = new Oven({
  files: [".", "./bun"],
  external: ["dotenv"],
});
// ---  ---------------------------------------------------------------

OV.onsuccess = async () => {
  await Cmd("tsc -p tsconfig.build.json");

  await RP.output({
    file: "./dist/index.d.ts",
    format: "es",
  });

  await BN.output({
    file: "./dist/bun.d.ts",
    format: "es",
  });
};

await OV.clear();
await OV.build();

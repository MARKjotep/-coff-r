import { describe, expect, test, mock } from "bun:test";
import { Envy, isDir } from "../../src/bun";
import { log } from "../../src";

describe(".env", () => {
  const NV = new Envy(__dirname + "/.private");

  test("un initialized", async () => {
    expect(() => NV.secret()).toThrowError(
      "'SECRET_KEY' not found in .env file",
    );
  });

  test("initialized", async () => {
    await NV.init();
    expect(await isDir(NV.path)).toBe(true);
  });

  test("contains secret and tls", async () => {
    expect(process.env).toContainKeys(["TLS_KEY", "TLS_CERT"]);
    expect(NV.secret()).toBeString();
  });
});

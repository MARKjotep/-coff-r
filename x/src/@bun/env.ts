import { file, type BunFile } from "bun";
import { oItems } from "../@/obj";
import { makeID } from "../@/str";
import { isDir, isFile } from "./is";
import { config } from "dotenv";

export class Envy {
  constructor(public path: string) {}
  async init() {
    await isDir(this.path);

    const epath = this.path + "/.env";
    await isFile(epath, `SECRET_KEY="${makeID(20)}"\nTLS_KEY=""\nTLS_CERT=""`);

    config({
      path: epath,
    });

    return this;
  }
  secret() {
    const sk = process.env.SECRET_KEY;
    if (!sk) throw new Error("'SECRET_KEY' not found in .env file");
    return sk;
  }
  tls() {
    return oItems(process.env)
      .filter(([key]) => typeof key === "string" && key.startsWith("TLS_"))
      .reduce<Record<string, BunFile>>((acc, [key, value]) => {
        if (!value || typeof key !== "string") return acc;
        const certKey = key.replace("TLS_", "").toLowerCase();
        acc[certKey] = file(value);
        return acc;
      }, {});
  }
}

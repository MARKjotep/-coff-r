import { file, type BunFile } from "bun";
import { oItems } from "../@/obj";
import { makeID } from "../@/str";
import { isDir, isFile } from "./is";

export class Envy {
  constructor(
    private path: string,
    private envPath?: string,
  ) {}
  async init() {
    if (!this.envPath) {
      await isDir(this.path);
      await isFile(
        this.path + "/.env",
        `SECRET_KEY="${makeID(20)}"\nTLS_KEY=""\nTLS_CERT=""`,
      );
    }
    return this;
  }
  secret() {
    const sk = process.env.SECRET_KEY;
    if (!sk) throw new Error("'SECRET_KEY' not found in .env file");
    return sk;
  }
  tls() {
    return oItems(process.env)
      .filter(([key]) => key.startsWith("TLS_"))
      .reduce<Record<string, BunFile>>((acc, [key, value]) => {
        if (value) {
          const certKey = key.replace("TLS_", "").toLowerCase();
          acc[certKey] = file(value);
        }
        return acc;
      }, {});
  }
}

import { file, write } from "bun";
import { isDir, isFile } from "./is";
import { oItems } from "../@/obj";

interface fs {
  [key: string]: string | undefined | boolean | number;
}

export class JSONCacher<T extends fs> {
  fs: string;
  f_timed: number;
  data: Map<any, T>;
  key: string;
  dir: string;
  constructor({ dir, fs, key }: { dir: string; fs: string; key: string }) {
    this.dir = dir + "/ffs";
    this.key = key;
    this.f_timed = Date.now();
    this.data = new Map();
    this.fs = this.dir + `/${fs}.json`;
  }
  async init() {
    if ((await isDir(this.dir)) && (await isFile(this.fs, "{}"))) {
      file(this.fs)
        .text()
        .then((e) => {
          const FJSON = JSON.parse(e);
          this.data = new Map(oItems(FJSON));
        })
        .catch((e) => {
          e;
        });
    }
  }
  async get(val: string | undefined): Promise<T | null> {
    const hdat = this.data.get(val);
    if (hdat) return hdat;
    return null;
  }
  async queue() {}
  async set(data: T) {
    if (this.key in data) {
      const frr = await file(this.fs).text();
      if (frr) {
        const FJSON = JSON.parse(frr);
        const dtk = data[this.key] as string;
        FJSON[dtk] = data;
        await write(this.fs, JSON.stringify(FJSON));
      }
      this.data.set(data[this.key], data);
    }
    return false;
  }
  async delete(key: string) {
    if (await this.get(key)) {
      const frr = await file(this.fs).text();
      if (frr) {
        const FJSON = JSON.parse(frr.toString());
        if (key in FJSON) {
          delete FJSON[key];
          await write(this.fs, JSON.stringify(FJSON));
        }
        this.data.delete(key);
      }
    }
  }
  async json() {
    const fraw = await file(this.fs).text();
    return JSON.parse(fraw);
  }
}

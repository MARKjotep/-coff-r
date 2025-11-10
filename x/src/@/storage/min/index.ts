import { readOnly } from "../../obj";
import { parsePath } from "../../path";

export class MinStorage {
  readonly path: string = "";
  readonly parsed: string[] = [];
  readonly args: string[] = [];
  constructor(path: string) {
    readOnly(this as any, { path, ...parsePath(path) });
  }
}

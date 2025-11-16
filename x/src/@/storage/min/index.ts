import { oDefine, oItems } from "../../obj";
import { parsePath } from "../../str/path";

export class MinStorage {
  readonly path: string = "";
  readonly parsed: string[] = [];
  readonly args: string[] = [];
  constructor(path: string) {
    readOnly(this as any, { path, ...parsePath(path) });
  }
}

export function readOnly<T extends any>(instance: T, OD: Record<string, any>) {
  oItems(OD).forEach(([k, v]) => {
    oDefine(instance, k, {
      value: v,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  });
}

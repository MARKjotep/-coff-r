import { Mapper } from "../../obj";
import { parsePath, pathType } from "../../str/path";
import { ngify, sparse } from "../../str";
import type { obj } from "../../types";
import { Cacher } from "../cache";
import { MinStorage } from "../min";

export const PATH_ARGS = ["int", "float", "file", "uuid", "string"];

export const matchPath = (path: string, route: string) => {
  const args: obj<any> = {};
  const _args: string[] = [];

  const { parsed } = parsePath(path);
  const { parsed: pr, args: ar } = parsePath(route);

  if (parsed.length === pr.length) {
    pr.map((seg, i) => {
      const PT = pathType(parsed[i]!, parsed.length - 1 === i);
      if (seg === PT[0]) return PT[0];
      if (PATH_ARGS.includes(PT[1])) {
        _args.push(PT[0]);
        return PT[1];
      }
      return seg;
    });

    ar.forEach((ra, i) => {
      args[ra] = _args[i];
    });
  }

  return args;
};

/** --------------------
 * string | int | float | file | uuid
 * - /path/\<string:hell>
 */
export class Storage<T extends MinStorage> {
  private _storage: Mapper<string, T>;
  private CC: Cacher<{
    parsed: string[];
    args: string[];
  }>;
  constructor() {
    this._storage = new Mapper();
    this.CC = new Cacher();
  }
  set(min: T) {
    const { parsed, path } = min;
    //
    const storageKey = ngify(parsed);
    const existingKey = this._storage.get(storageKey);
    if (!existingKey) {
      this._storage.set(storageKey, min);
    } else {
      throw `path: ${path} already used.`;
    }
  }
  get(path: string): [T | undefined, Record<string, string>] {
    const { parsed } = this.CC.cache(path, () => parsePath(path));
    const args: obj<any> = {};
    let route = this._storage.get(ngify(parsed));

    if (!route && path !== "/") {
      for (const routeKey of this._storage.keys()) {
        const _args: string[] = [];
        const segments = sparse(routeKey) as string[];
        if (parsed.length === segments.length) {
          const matches: string[] = segments.map((seg, i) => {
            const PT = pathType(parsed[i]!, parsed.length - 1 === i);
            if (seg === PT[0]) return PT[0];
            if (PATH_ARGS.includes(PT[1])) {
              _args.push(PT[0]);
              return PT[1];
            }
            return seg;
          });

          const _match = ngify(matches);
          const isroute = this._storage.has(_match);
          if (isroute) {
            route = this._storage.get(_match);
            route?.args.forEach((ra, i) => {
              args[ra] = _args[i];
            });
            break;
          }
        }
      }
    }
    return [route, args];
  }
  keys() {
    return this._storage.keys();
  }
}

export class SymStorage<T extends MinStorage> {
  [k: symbol]: Storage<T>;
  constructor(...sym: symbol[]) {
    sym.forEach((sm) => {
      if (!this[sm]) {
        this[sm] = new Storage<T>();
      }
    });
  }
  get(sym: symbol): Storage<T> {
    return this[sym]!;
  }
}

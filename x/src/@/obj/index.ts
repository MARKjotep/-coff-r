import { isArray, isNull, isObject } from "../is";
import { ngify } from "../str";

/**
 * A custom Map implementation that provides additional utility methods for working with objects and maps.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 */
export class Mapper<K, V> extends Map<K, V> {
  obj(obj?: object | null) {
    obj && oItems(obj).forEach(([k, v]) => this.set(k as K, v));
  }
  map(map: Mapper<K, V>) {
    map.forEach((v, k) => {
      if (v instanceof Mapper) {
        this.set(k, v);
      } else if (isArray(v)) {
        if (this.lacks(k)) {
          this.set(k, [] as any);
        }
        (this.get(k) as any[]).push(...v);
      } else if (isObject(v)) {
        this.ass(k, v);
      } else {
        this.set(k, v);
      }
    });
  }
  ass<T>(key: K, obj: T) {
    if (!this.has(key)) this.set(key, {} as any);
    oAss(this.get(key)!, obj);
  }
  lacks(key: K) {
    return !this.has(key);
  }
  init(key: K, val: V): V {
    return this.has(key) ? this.get(key)! : this.set(key, val).get(key)!;
  }
}

export const keyInMap = <T>(key: string, map: Mapper<string, any>) => {
  if (!map.has(key)) map.set(key, new Mapper());
  return map.get(key)! as T;
};

export const keyInMapArray = <T>(key: string, map: Mapper<string, any>) => {
  if (!map.has(key)) map.set(key, []);
  return map.get(key)! as T;
};

/*
-------------------------
// Canonical re‑exports of Object utilities
-------------------------
*/
export const oVals: <T>(obj: T) => Array<T[keyof T]> = Object.values;
export const oKeys: <T extends object>(obj: T) => Array<keyof T> =
  Object.keys as any;
export const oItems: <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]> = Object.entries as any;

export const oFItems: <K extends PropertyKey, V>(
  entries: Iterable<readonly [K, V]>,
) => { [P in K]: V } = Object.fromEntries as any;

export const oFreeze: <T>(obj: T) => Readonly<T> = Object.freeze;
export const oDefine = Object.defineProperty;
export const oAss: <T, U>(target: T, source: U) => T & U = Object.assign as any;

export const oHas = (o: object, v: PropertyKey): boolean => Object.hasOwn(o, v);
export const oLen = (ob: object): number => Object.keys(ob).length;

/*
-------------------------

-------------------------
*/

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type Changes = {
  added: Record<string, unknown>;
  removed: Record<string, unknown>;
  modified: Record<string, { old: unknown; new: unknown }>;
};

export const compareObjects = <T extends object>(
  oldObj: T,
  newObj: T,
): Changes => {
  const changes: Changes = { added: {}, removed: {}, modified: {} };

  const oldKeys = oKeys(oldObj as Record<string, unknown>);
  const newKeys = oKeys(newObj as Record<string, unknown>);

  // Added + modified
  for (const key of newKeys) {
    const oldValue = (oldObj as Record<string, unknown>)[key];
    const newValue = (newObj as Record<string, unknown>)[key];

    // Newly added
    if (!(key in oldObj)) {
      changes.added[key] = newValue;
      continue;
    }

    // Arrays: compare via your ngify helper
    if (isArray(oldValue) && isArray(newValue)) {
      if (ngify(oldValue) !== ngify(newValue)) {
        changes.modified[key] = { old: oldValue, new: newValue };
      }
      continue;
    }

    // Non-null objects: recurse
    if (
      isObject(oldValue) &&
      isObject(newValue) &&
      !isNull(oldValue) &&
      !isNull(newValue)
    ) {
      const nested = compareObjects(
        oldValue as Record<string, unknown>,
        newValue as Record<string, unknown>,
      );

      if (oLen(nested.added) || oLen(nested.removed) || oLen(nested.modified)) {
        changes.modified[key] = { old: oldValue, new: newValue };
      }
      continue;
    }

    // Primitives or mismatched types
    if (oldValue !== newValue) {
      changes.modified[key] = { old: oldValue, new: newValue };
    }
  }

  // Removed
  for (const key of oldKeys) {
    if (!(key in newObj)) {
      changes.removed[key] = (oldObj as Record<string, unknown>)[key];
    }
  }

  return changes;
};

export const objectUpdated = (changes: Changes): boolean =>
  Object.values(changes).some((bucket) => oLen(bucket));

export function areSetsEqual<T>(set1: Set<T>, set2: Set<T>) {
  if (set1.size !== set2.size) return true;
  for (const v of set1) if (!set2.has(v)) return true;
  return false;
}

import { isArr, isNull, isObj } from "../is";
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
      } else if (isArr(v)) {
        if (this.lacks(k)) {
          this.set(k, [] as any);
        }
        (this.get(k) as any[]).push(...v);
      } else if (isObj(v)) {
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

export const oVals = Object.values,
  oKeys = Object.keys,
  oItems = Object.entries,
  oFItems = Object.fromEntries,
  oFreeze = Object.freeze,
  oDefine = Object.defineProperty,
  oAss = Object.assign,
  oHas = (o: object, v: PropertyKey) => Object.hasOwn(o, v),
  oLen = (ob: object) => {
    return Object.keys(ob).length;
  };

export const keyInMap = <T>(id: string, map: Mapper<string, any>) => {
  if (!map.has(id)) map.set(id, new Mapper());
  return map.get(id)! as T;
};

export const keyInMapArray = <T>(id: string, map: Mapper<string, any>) => {
  if (!map.has(id)) map.set(id, []);
  return map.get(id)! as T;
};

type Changes = {
  added: Record<string, any>;
  removed: Record<string, any>;
  modified: Record<string, { old: any; new: any }>;
};

export const compareObjects = <T extends object>(
  oldObj: T,
  newObj: T | any,
): Changes => {
  const changes: Changes = { added: {}, removed: {}, modified: {} };

  const oldKeys = oKeys(oldObj as Record<string, any>);
  const newKeys = oKeys(newObj as Record<string, any>);

  // Check for added and modified keys
  for (const key of newKeys) {
    const oldValue = (oldObj as any)[key];
    const newValue = (newObj as any)[key];

    if (!(key in oldObj)) {
      changes.added[key] = newValue;
    } else if (isArr(oldValue) && isArr(newValue)) {
      if (ngify(oldValue) !== ngify(newValue)) {
        changes.modified[key] = { old: oldValue, new: newValue };
      }
    } else if (
      isObj(oldValue) &&
      isObj(newValue) &&
      !isNull(oldValue) &&
      !isNull(newValue)
    ) {
      const nestedChanges = compareObjects(oldValue, newValue);
      if (
        oLen(nestedChanges.added) ||
        oLen(nestedChanges.removed) ||
        oLen(nestedChanges.modified)
      ) {
        changes.modified[key] = { old: oldValue, new: newValue };
      }
    } else if (oldValue !== newValue) {
      changes.modified[key] = { old: oldValue, new: newValue };
    }
  }

  // Check for removed keys
  for (const key of oldKeys) {
    if (!(key in newObj)) {
      changes.removed[key] = (oldObj as any)[key];
    }
  }

  return changes;
};

export function areSetsEqual<T>(set1: Set<T>, set2: Set<T>) {
  if (set1.size !== set2.size) return true;
  for (const v of set1) if (!set2.has(v)) return true;
  return false;
}

export const objectUdpated = (changes: Changes) => {
  return oVals(changes).some((vv) => {
    return oLen(vv);
  });
};

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

import { isFunction } from "../is";
import type { Class } from "../types";

/**
 * A decorator function that creates a singleton class from the provided constructor.
 * The singleton instance is cached and returned on subsequent calls to the constructor.
 * @param constructor - The constructor function of the class to be made a singleton.
 * @returns A new class that extends the provided constructor and implements the singleton pattern.
 */
export const Singleton = <T extends Class>(constructor: T) => {
  let instance: T;
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  };
};

/**
 * A decorator function that creates a cached class from the provided constructor.
 * The class instance is cached and returned on subsequent calls to the constructor.
 * This can be useful for expensive object creation or initialization.
 * @param constructor - The constructor function of the class to be cached.
 * @returns A new class that extends the provided constructor and implements caching.
 */
export const Cached = <T extends Class>(constructor: T) => {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      const cache: Map<string, any> = new Map();
      return new Proxy(this, {
        get(target, property: any) {
          const cacheKey = `__${property}`;
          if (!cache.has(cacheKey)) {
            let fn = target[property];
            if (isFunction(fn)) {
              fn = function (...args: any[]) {
                const methodCacheKey = `${cacheKey}_${JSON.stringify(args)}`;
                if (!cache.has(methodCacheKey)) {
                  const result = target[property].apply(target, args);
                  cache.set(methodCacheKey, result);
                }
                return cache.get(methodCacheKey);
              };
            }
            cache.set(cacheKey, fn);
          }
          return cache.get(cacheKey);
        },
        set(target, property: string, value) {
          const cacheKey = `__${property}`;
          cache.set(cacheKey, value);
          return true;
        },
      });
    }
  };
};

/**
 * Method decorator. Bind this to method when destructured.
 */
export const bind = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      if (this === target.constructor.prototype) {
        return originalMethod;
      }
      const bound = originalMethod.bind(this);

      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: true,
        writable: true,
      });
      return bound;
    },
  };
};

// Great for expensive calculations.
export const memoize = (
  _t: any,
  _k: string,
  desc: PropertyDescriptor,
): PropertyDescriptor => {
  const fn = desc.value;
  const cache = new Map<string, any>();
  desc.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
  return desc;
};

// Warns at runtime if someone calls the method.
export const deprecated = (message: string) => {
  return function (
    _t: any,
    key: string,
    desc: PropertyDescriptor,
  ): PropertyDescriptor {
    const fn = desc.value;
    desc.value = function (...args: any[]) {
      console.warn(`⚠️ [${key}] is deprecated: ${message}`);
      return fn.apply(this, args);
    };
    return desc;
  };
};

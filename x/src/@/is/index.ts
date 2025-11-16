/*
-------------------------
Core primitive checks
-------------------------
*/

export const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";

export const isString = (v: unknown): v is string => typeof v === "string";

export const isNumber = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v);

export const isBigInt = (v: unknown): v is bigint => typeof v === "bigint";

export const isSymbol = (v: unknown): v is symbol => typeof v === "symbol";

export const isFunction = (v: unknown): v is (...args: any[]) => any =>
  typeof v === "function";

export const isNumberLike = (value: unknown): boolean => {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return !Number.isNaN(n) && Number.isFinite(n);
};

/*
-------------------------
Array
-------------------------
*/
export const isArray = <T = unknown>(v: unknown): v is T[] => Array.isArray(v);

export const isReadonlyArray = <T = unknown>(v: unknown): v is readonly T[] =>
  Array.isArray(v);

// Is a raw ArrayBuffer
export const isArrayBuffer = (v: unknown): v is ArrayBuffer =>
  v instanceof ArrayBuffer;

// Is any ArrayBuffer view (TypedArray or DataView)
export const isArrayBufferView = (v: unknown): v is ArrayBufferView =>
  typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(v as any);

// Is a Uint8Array specifically (common for binary data)
export const isUint8Array = (v: unknown): v is Uint8Array =>
  v instanceof Uint8Array;

export const isBinaryLike = (
  v: unknown,
): v is Uint8Array | ArrayBuffer | string =>
  v instanceof Uint8Array || v instanceof ArrayBuffer || typeof v === "string";

/*
-------------------------
Object  / plain object
-------------------------
*/
export const isObject = (v: unknown): v is object =>
  isNotNull(v) && typeof v === "object";

// export const isPlainObject = (v: unknown): v is Record<PropertyKey, unknown> =>
//   isObject(v) && Object.getPrototypeOf(v) === Object.prototype && !isArray(v);

export const isPlainObject = (v: unknown): v is Record<PropertyKey, unknown> =>
  isNotNull(v) &&
  isObject(v) &&
  (Object.getPrototypeOf(v) === Object.prototype ||
    Object.getPrototypeOf(v) === null);

export const isNonEmptyObject = (
  v: unknown,
): v is Record<PropertyKey, unknown> =>
  isPlainObject(v) && Object.keys(v).length > 0;

export const isRecord = <K extends PropertyKey = string, V = unknown>(
  v: unknown,
): v is Record<K, V> => isPlainObject(v);

export const isIterable = <T = unknown>(v: unknown): v is Iterable<T> =>
  v != null && typeof (v as any)[Symbol.iterator] === "function";

export const isAsyncIterable = <T = unknown>(
  v: unknown,
): v is AsyncIterable<T> =>
  v != null && typeof (v as any)[Symbol.asyncIterator] === "function";

export const isMap = <K = unknown, V = unknown>(v: unknown): v is Map<K, V> =>
  v instanceof Map;

export const isSet = <T = unknown>(v: unknown): v is Set<T> => v instanceof Set;

export const isWeakMap = (v: unknown): v is WeakMap<object, unknown> =>
  v instanceof WeakMap;

export const isWeakSet = (v: unknown): v is WeakSet<object> =>
  v instanceof WeakSet;

export const isObjectLike = (v: unknown): v is object =>
  v !== null && (typeof v === "object" || typeof v === "function");

export const isNonFunctionObject = (v: unknown): v is object =>
  v !== null && typeof v === "object";

/*
-------------------------
Null / defined / undefined / nullish
-------------------------
*/

export const isNull = (v: unknown): v is null => v === null;

export const isUndefined = (v: unknown): v is undefined => v === undefined;

export const isDefined = <T>(v: T): v is Exclude<T, undefined> =>
  !isUndefined(v);

export const isNullish = (v: unknown): v is null | undefined => v == null; // true for null or undefined

export const isNotNull = <T>(v: T): v is Exclude<T, null> => v !== null;

export const isNotNullish = <T>(v: T): v is Exclude<T, null | undefined> =>
  v != null;

/*
-------------------------
String checks
-------------------------
*/

export const isEmptyString = (v: unknown): v is "" =>
  typeof v === "string" && v.length === 0;

export const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

export const isWhitespace = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0 && v.trim().length === 0;

/*
-------------------------
Number‑ish checks
-------------------------
*/

export const isInteger = (v: unknown): v is number =>
  isNumber(v) && Number.isInteger(v);

export const isFiniteNumber = (v: unknown): v is number =>
  isNumber(v) && Number.isFinite(v);

export const isPositiveNumber = (v: unknown): v is number =>
  isNumber(v) && Number.isFinite(v) && v > 0;

export const isNonNegativeNumber = (v: unknown): v is number =>
  isNumber(v) && Number.isFinite(v) && v >= 0;

/*
-------------------------
Common built‑ins
-------------------------
*/
export const isDate = (v: unknown): v is Date =>
  v instanceof Date && !Number.isNaN(v.getTime());

export const isRegExp = (v: unknown): v is RegExp => v instanceof RegExp;

export const isError = (v: unknown): v is Error => v instanceof Error;

export const isPromise = <T = unknown>(v: unknown): v is Promise<T> =>
  !!v && typeof (v as any).then === "function";

/*
-------------------------
Structural / collection‑style checks
-------------------------
*/

export const isEmpty = (v: unknown): boolean =>
  v == null ||
  (typeof v === "string" && v.length === 0) ||
  (Array.isArray(v) && v.length === 0) ||
  ((v instanceof Map || v instanceof Set) && v.size === 0) ||
  (isPlainObject(v) && Object.keys(v).length === 0);

export const isPrimitive = (
  v: unknown,
): v is string | number | boolean | bigint | symbol | null | undefined =>
  v === null || (typeof v !== "object" && typeof v !== "function");

/*
-------------------------
Module‑like values
-------------------------
*/
export type ModuleLike = {
  [Symbol.toStringTag]: "Module";
  default?: unknown;
  [key: string]: unknown;
};

export const isModule = (value: unknown): value is ModuleLike =>
  isNotNull(value) &&
  isObject(value) &&
  (value as { [Symbol.toStringTag]?: unknown })[Symbol.toStringTag] ===
    "Module";

/*
-------------------------
Environment / browser checks
-------------------------
*/
export const isBrowser = (): boolean => typeof window !== "undefined";
export const isNotBrowser = (): boolean => typeof window === "undefined";

// ---  ---------------------------------------------------------------

/*
-------------------------
Async and class/function checks
-------------------------
*/

// Narrow to Function, but keep the name very explicit.
export const isAsyncFunction = (
  fn: unknown,
): fn is (...args: any[]) => Promise<unknown> =>
  isFunction(fn) &&
  isNotNull(fn.constructor) &&
  fn.constructor.name === "AsyncFunction";

// Heuristic: is a class (ES2015+) declaration/expression
export const isClass = (value: unknown): value is Function =>
  typeof value === "function" &&
  /^class\s/.test(Function.prototype.toString.call(value));

// Generic, typed wrapper around instanceof
export const isInstanceOf = <T>(
  value: unknown,
  ctor: new (...args: any[]) => T,
): value is T => value instanceof ctor;

// Is testClass in the prototype chain of baseClass (i.e. extends)

export const isSubclassOf = (
  baseClass: Function,
  testClass: Function,
): boolean =>
  typeof baseClass === "function" &&
  typeof testClass === "function" &&
  baseClass.prototype.isPrototypeOf(testClass.prototype);

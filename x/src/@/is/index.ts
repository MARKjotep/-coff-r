export type ModuleLike = {
  [Symbol.toStringTag]: "Module";
  default?: unknown;
  [key: string]: unknown;
};

export const isFN = (v: any): v is Function => typeof v === "function",
  /*
  -------------------------
  -------------------------
  */
  isAsync = (v: any): v is Function => v.constructor.name === "AsyncFunction",
  isPromise = (v: any): v is Function => !!v && typeof v.then === "function",
  isNumber = (value: any) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  /*
  -------------------------
  
  -------------------------
  */
  isObject = (val: any): val is Record<string, any> => {
    return val && typeof val === "object" && !Array.isArray(val);
  },
  isPlainObject = (value: any) => {
    return (
      typeof value === "object" && // It's an object
      value !== null && // Not null
      Object.getPrototypeOf(value) === Object.prototype && // Prototype is Object.
      !Array.isArray(value)
    );
  },
  isModule = (obj: any): obj is ModuleLike => {
    return (
      obj && typeof obj === "object" && obj[Symbol.toStringTag] === "Module"
    );
  },
  /*
  -------------------------
  -------------------------
  */
  isArraybuff = (val: any) => {
    return (
      val instanceof Uint8Array ||
      val instanceof ArrayBuffer ||
      typeof val === "string"
    );
  },
  /*
  -------------------------
  -------------------------
  */
  isClassOrId = (k: string): boolean => {
    return k.startsWith(".") || k.startsWith("#");
  },
  /*
  -------------------------
  -------------------------
  */
  isBool = (v: any) => typeof v === "boolean",
  /*
  -------------------------
  -------------------------
  */
  isStr = (v: any) => typeof v === "string",
  /*
  -------------------------
  -------------------------
  */
  isArr = (v: any) => Array.isArray(v),
  /*
  -------------------------
  -------------------------
  */
  isObj = (v: any): v is object => typeof v === "object",
  /*
  -------------------------
  -------------------------
  */
  isNum = (v: any): v is number => typeof v === "number",
  /*
  -------------------------
  -------------------------
  */
  isNull = (v: any): v is null => v === null,
  isNotNull = <T>(v: T): v is Exclude<T, null> => v === null,
  /*
  -------------------------
  -------------------------
  */
  isUndefined = (v: any): v is undefined => typeof v === "undefined",
  isDefined = <T>(v: T): v is Exclude<T, undefined> => typeof v !== "undefined",
  /*
  -------------------------
  -------------------------
  */ /*
  -------------------------
  -------------------------
  */
  isInt = (str: string): boolean => {
    return Number.isInteger(Number(str));
  };

export const isWindow = typeof window !== "undefined";
export const isNotWindow = typeof window === "undefined";

// ---  ---------------------------------------------------------------

export function isClass(value: any) {
  return typeof value === "function" && /^class\s/.test(value.toString());
}

export function isClassTypeOf(
  baseClass: Function,
  testClass: Function,
): boolean {
  return baseClass.prototype.isPrototypeOf(testClass.prototype);
}

import { describe, expect, test, mock } from "bun:test";
import {
  isBoolean,
  isString,
  isNumber,
  isBigInt,
  isSymbol,
  isFunction,
  //
  isArray,
  isArrayBuffer,
  isArrayBufferView,
  isUint8Array,
  isBinaryLike,
  //
  isObject,
  isObjectLike,
  isPlainObject,
  isNonEmptyObject,
  isRecord,
  isIterable,
  isAsyncIterable,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
  log,
  // ---  ---------------------------------------------------------------
  isNull,
  isUndefined,
  isDefined,
  isNullish,
  isNotNull,
  isNotNullish,

  // ---  ---------------------------------------------------------------
  isEmptyString,
  isNonEmptyString,
  isWhitespace,
  isInteger,
  isFiniteNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  isDate,
  isRegExp,
  isError,
  isPromise,
  isPrimitive,
  isEmpty,
  isAsyncFunction,
  isClass,
  isInstanceOf,
  isSubclassOf,
} from "../../src";

describe("Core primitive", () => {
  const vals = [
    true,
    "hello",
    1,
    9007199254740991n,
    Symbol("^"),
    () => "hello",
  ];

  const Loop = (fn: Function, index: number) => {
    return () => {
      vals.forEach((v, int) => {
        expect(fn(v)).toBe(int === index ? true : false);
      });
    };
  };

  test("isBoolean", Loop(isBoolean, 0));
  test("isString", Loop(isString, 1));
  test("isNumber", Loop(isNumber, 2));
  test("isBigInt", Loop(isBigInt, 3));
  test("isSymbol", Loop(isSymbol, 4));
  test("isFunction", Loop(isFunction, 5));
});

// ---  ---------------------------------------------------------------

describe("Generic value predicates", () => {
  test("isEmpty", () => {
    // assuming semantics: nullish, empty string, empty array, empty Map/Set, empty plain object
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty({})).toBe(true);

    // non-empty variants
    expect(isEmpty(" ")).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty(new Map([["k", "v"]]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);

    // other types
    expect(isEmpty(0 as any)).toBe(false);
    expect(isEmpty(false as any)).toBe(false);
    expect(isEmpty(() => {})).toBe(false);
  });

  test("isPrimitive", () => {
    expect(isPrimitive("foo")).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(3.14)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(BigInt(10))).toBe(true);
    expect(isPrimitive(Symbol("x"))).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);

    expect(isPrimitive({} as any)).toBe(false);
    expect(isPrimitive([] as any)).toBe(false);
    expect(isPrimitive(new Date() as any)).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
  });

  test("isPrimitive type narrowing", () => {
    const value: string | number | { a: number } = 1;

    if (isPrimitive(value)) {
      // here: value is string | number (because object branch is eliminated)
      expect(typeof value === "string" || typeof value === "number").toBe(true);
    } else {
      // here: value is { a: number }
      expect("a" in value).toBe(true);
    }
  });
});

// ---  ---------------------------------------------------------------

describe("isArray", () => {
  test("returns true for plain arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(["a", "b"])).toBe(true);
  });

  test("narrows type for arrays", () => {
    const value: unknown = [1, 2, 3];

    if (isArray<number>(value)) {
      // Inside this block, `value` is `number[]`
      const sum = value.reduce((a, b) => a + b, 0);
      expect(sum).toBe(6);
    } else {
      // Should not reach here
      expect(true).toBe(false);
    }
  });

  test("returns false for non-array values", () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray("foo")).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray(() => {})).toBe(false);
  });

  test("returns false for typed arrays and array-like objects", () => {
    expect(isArray(new Uint8Array(4))).toBe(false);
    expect(isArray({ length: 2, 0: "a", 1: "b" })).toBe(false);
  });

  // --- isArrayBuffer ---------------------------------------------------------------
  test("returns true for ArrayBuffer instances", () => {
    const buf = new ArrayBuffer(8);
    expect(isArrayBuffer(buf)).toBe(true);
  });

  test("returns false for non-ArrayBuffer values", () => {
    expect(isArrayBuffer(new Uint8Array(8))).toBe(false);
    expect(isArrayBuffer("foo")).toBe(false);
    expect(isArrayBuffer([])).toBe(false);
    expect(isArrayBuffer({})).toBe(false);
    expect(isArrayBuffer(null)).toBe(false);
    expect(isArrayBuffer(undefined)).toBe(false);
  });

  // --- isArrayBufferView ---------------------------------------------------------------
  test("returns true for typed arrays and DataView", () => {
    const buf = new ArrayBuffer(8);
    const u8 = new Uint8Array(buf);
    const i32 = new Int32Array(buf);
    const view = new DataView(buf);

    expect(isArrayBufferView(u8)).toBe(true);
    expect(isArrayBufferView(i32)).toBe(true);
    expect(isArrayBufferView(view)).toBe(true);
  });

  test("returns false for non-views", () => {
    const buf = new ArrayBuffer(8);
    expect(isArrayBufferView(buf)).toBe(false);
    expect(isArrayBufferView("foo")).toBe(false);
    expect(isArrayBufferView([])).toBe(false);
    expect(isArrayBufferView({})).toBe(false);
    expect(isArrayBufferView(null)).toBe(false);
    expect(isArrayBufferView(undefined)).toBe(false);
  });

  // --- isUint8Array ---------------------------------------------------------------
  test("returns true for Uint8Array", () => {
    const u8 = new Uint8Array(4);
    expect(isUint8Array(u8)).toBe(true);
  });

  test("returns false for other typed arrays and values", () => {
    const buf = new ArrayBuffer(4);
    const i16 = new Int16Array(buf);

    expect(isUint8Array(buf)).toBe(false);
    expect(isUint8Array(i16)).toBe(false);
    expect(isUint8Array("foo")).toBe(false);
    expect(isUint8Array([])).toBe(false);
    expect(isUint8Array(null)).toBe(false);
    expect(isUint8Array(undefined)).toBe(false);
  });

  // --- isBinaryLike ---------------------------------------------------------------
  test("returns true for Uint8Array, ArrayBuffer and string", () => {
    const buf = new ArrayBuffer(8);
    const u8 = new Uint8Array(buf);

    expect(isBinaryLike(buf)).toBe(true);
    expect(isBinaryLike(u8)).toBe(true);
    expect(isBinaryLike("hello")).toBe(true);
  });

  test("returns false for other types", () => {
    expect(isBinaryLike(123)).toBe(false);
    expect(isBinaryLike([])).toBe(false);
    expect(isBinaryLike({})).toBe(false);
    expect(isBinaryLike(null)).toBe(false);
    expect(isBinaryLike(undefined)).toBe(false);
  });

  test("can be used as a type guard", () => {
    const value: unknown = new Uint8Array(4);

    if (isBinaryLike(value)) {
      // inside this block, value is Uint8Array | ArrayBuffer | string
      expect(typeof value === "string" || value.byteLength >= 0).toBe(true);
    } else {
      // should not hit this branch for this test
      expect(true).toBe(false);
    }
  });
});

// ---  ---------------------------------------------------------------

describe("Object-like", () => {
  test("isObject: true for non-null objects, false otherwise", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Map())).toBe(true);

    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject("foo")).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });

  test("isObjectLike: true for objects and functions", () => {
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike([])).toBe(true);
    expect(isObjectLike(new Map())).toBe(true);
    expect(isObjectLike(() => {})).toBe(true);

    expect(isObjectLike(null)).toBe(false);
    expect(isObjectLike(undefined)).toBe(false);
    expect(isObjectLike(123)).toBe(false);
    expect(isObjectLike("foo")).toBe(false);
  });

  test("isPlainObject: plain literals and Object.create(null)", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);

    const nullProto = Object.create(null);
    nullProto.a = 1;

    expect(isPlainObject(nullProto)).toBe(true);

    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
  });

  test("isNonEmptyObject: only non-empty plain objects", () => {
    expect(isNonEmptyObject({ a: 1 })).toBe(true);

    expect(isNonEmptyObject({})).toBe(false);
    expect(isNonEmptyObject([])).toBe(false);
    expect(isNonEmptyObject(null)).toBe(false);
    expect(isNonEmptyObject(undefined)).toBe(false);
  });

  test("isRecord: acts as type guard for plain Record-like objects", () => {
    const value: unknown = { a: 1, b: 2 };

    if (isRecord<string, number>(value)) {
      // inside here, value is Record<string, number>
      const keys = Object.keys(value);
      expect(keys.sort()).toEqual(["a", "b"]);
    } else {
      expect(true).toBe(false); // should not get here
    }

    expect(isRecord([])).toBe(false);
    expect(isRecord(123)).toBe(false);
  });

  test("isIterable: arrays, strings, maps, sets are iterable", () => {
    expect(isIterable([])).toBe(true);
    expect(isIterable("foo")).toBe(true);
    expect(isIterable(new Map())).toBe(true);
    expect(isIterable(new Set())).toBe(true);
    expect(isIterable(new Uint8Array(4))).toBe(true);

    expect(isIterable(123)).toBe(false);
    expect(isIterable({})).toBe(false);
    expect(isIterable(null)).toBe(false);
    expect(isIterable(undefined)).toBe(false);
  });

  test("isAsyncIterable: async generators are async-iterable", async () => {
    async function* gen() {
      yield 1;
      yield 2;
    }

    const asyncIter = gen();

    expect(isAsyncIterable(asyncIter)).toBe(true);
    expect(isAsyncIterable([])).toBe(false);
    expect(isAsyncIterable("foo")).toBe(false);
    expect(isAsyncIterable(null)).toBe(false);

    if (isAsyncIterable<number>(asyncIter)) {
      const received: number[] = [];
      for await (const v of asyncIter) {
        received.push(v);
      }
      expect(received).toEqual([1, 2]);
    } else {
      expect(true).toBe(false);
    }
  });

  test("isMap / isSet / isWeakMap / isWeakSet", () => {
    const m = new Map();
    const s = new Set();
    const wm = new WeakMap<object, unknown>();
    const ws = new WeakSet<object>();

    expect(isMap(m)).toBe(true);
    expect(isSet(s)).toBe(true);
    expect(isWeakMap(wm)).toBe(true);
    expect(isWeakSet(ws)).toBe(true);

    expect(isMap({})).toBe(false);
    expect(isSet([])).toBe(false);
    expect(isWeakMap(new Map())).toBe(false);
    expect(isWeakSet(new Set())).toBe(false);
  });
});

// ---  ---------------------------------------------------------------

describe("Null / Undefined predicates", () => {
  test("isNull", () => {
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull("")).toBe(false);
    expect(isNull({})).toBe(false);
  });

  test("isUndefined", () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined("")).toBe(false);
    expect(isUndefined({})).toBe(false);
  });

  test("isDefined", () => {
    const a: string | undefined = "hello";
    const b: string | undefined = undefined;

    expect(isDefined(a)).toBe(true);
    expect(isDefined(b)).toBe(false);

    // type‑narrowing check
    let maybe: string | undefined = "foo";
    if (isDefined(maybe)) {
      // here: maybe is string
      expect(maybe.toUpperCase()).toBe("FOO");
    } else {
      // here: maybe is undefined
      expect(maybe).toBeUndefined();
    }
  });

  test("isNullish", () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);

    expect(isNullish(0)).toBe(false);
    expect(isNullish("")).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish({})).toBe(false);
  });

  test("isNotNull", () => {
    const a: string | null = "hi";
    const b: string | null = null;

    expect(isNotNull(a)).toBe(true);
    expect(isNotNull(b)).toBe(false);

    // type‑narrowing check
    let value: number | null = 42;
    if (isNotNull(value)) {
      // here: value is number
      expect(value + 1).toBe(43);
    } else {
      // here: value is null
      expect(value).toBeNull();
    }
  });

  test("isNotNullish", () => {
    const a: string | null | undefined = "hi";
    const b: string | null | undefined = null;
    const c: string | null | undefined = undefined;

    expect(isNotNullish(a)).toBe(true);
    expect(isNotNullish(b)).toBe(false);
    expect(isNotNullish(c)).toBe(false);

    // type‑narrowing check
    let value: string | null | undefined = "x";
    if (isNotNullish(value)) {
      // here: value is string
      expect(value.repeat(2)).toBe("xx");
    } else {
      // here: value is null | undefined
      expect(value === null || value === undefined).toBe(true);
    }
  });
});

// ---  ---------------------------------------------------------------

describe("String predicates", () => {
  test("isEmptyString", () => {
    expect(isEmptyString("")).toBe(true);

    expect(isEmptyString(" ")).toBe(false);
    expect(isEmptyString("foo")).toBe(false);
    expect(isEmptyString("\n")).toBe(false);
    expect(isEmptyString(0 as any)).toBe(false);
    expect(isEmptyString(null as any)).toBe(false);
    expect(isEmptyString(undefined as any)).toBe(false);
  });

  test("isNonEmptyString", () => {
    expect(isNonEmptyString("a")).toBe(true);
    expect(isNonEmptyString(" foo ")).toBe(true);
    expect(isNonEmptyString("0")).toBe(true);

    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString(123 as any)).toBe(false);
    expect(isNonEmptyString(null as any)).toBe(false);
    expect(isNonEmptyString(undefined as any)).toBe(false);
  });

  test("isWhitespace", () => {
    expect(isWhitespace(" ")).toBe(true);
    expect(isWhitespace("\n")).toBe(true);
    expect(isWhitespace("\t")).toBe(true);
    expect(isWhitespace("   ")).toBe(true);
    expect(isWhitespace("")).toBe(false); // empty, not whitespace-only
    expect(isWhitespace(" a ")).toBe(false);
    expect(isWhitespace("foo")).toBe(false);
    expect(isWhitespace(0 as any)).toBe(false);
    expect(isWhitespace(null as any)).toBe(false);
  });

  test("type narrowing examples", () => {
    const v1: unknown = "";
    if (isEmptyString(v1)) {
      // here v1 is type "" (string literal)
      expect(v1.length).toBe(0);
    } else {
      expect(v1 === "").toBe(false);
    }

    const v2: unknown = "bar";
    if (isNonEmptyString(v2)) {
      // here v2 is string
      expect(v2.toUpperCase()).toBe("BAR");
    } else {
      expect(v2).not.toBe("bar");
    }

    const v3: unknown = "   ";
    if (isWhitespace(v3)) {
      // here v3 is string
      expect(v3.trim().length).toBe(0);
    } else {
      expect(v3).not.toBe("   ");
    }
  });
});

// ---  ---------------------------------------------------------------

describe("Number predicates", () => {
  test("isInteger", () => {
    expect(isInteger(0)).toBe(true);
    expect(isInteger(1)).toBe(true);
    expect(isInteger(-1)).toBe(true);
    expect(isInteger(42.0)).toBe(true);

    expect(isInteger(0.1)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
    expect(isInteger("1" as any)).toBe(false);
    expect(isInteger(null as any)).toBe(false);
  });

  test("isFiniteNumber", () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(-1)).toBe(true);
    expect(isFiniteNumber(3.14)).toBe(true);

    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber(-Infinity)).toBe(false);
    expect(isFiniteNumber("1" as any)).toBe(false);
    expect(isFiniteNumber(null as any)).toBe(false);
  });

  test("isPositiveNumber", () => {
    expect(isPositiveNumber(1)).toBe(true);
    expect(isPositiveNumber(3.14)).toBe(true);

    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
    expect(isPositiveNumber(NaN)).toBe(false);
    expect(isPositiveNumber(Infinity)).toBe(false); // depending on your impl, usually false
    expect(isPositiveNumber("1" as any)).toBe(false);
  });

  test("isNonNegativeNumber", () => {
    expect(isNonNegativeNumber(0)).toBe(true);
    expect(isNonNegativeNumber(1)).toBe(true);
    expect(isNonNegativeNumber(3.14)).toBe(true);

    expect(isNonNegativeNumber(-1)).toBe(false);
    expect(isNonNegativeNumber(NaN)).toBe(false);
    expect(isNonNegativeNumber(Infinity)).toBe(false); // same note as above
    expect(isNonNegativeNumber("0" as any)).toBe(false);
  });

  test("number predicate type narrowing", () => {
    const value: number | string | null = 1;

    if (isInteger(value)) {
      // here: value is number
      const squared = value * value;
      expect(squared).toBe(1);
    }

    let maybe: number | undefined = 2;
    if (isFiniteNumber(maybe)) {
      // here: maybe is number
      expect(maybe + 1).toBe(3);
    }
  });
});

// ---  ---------------------------------------------------------------

describe("Built-in object predicates", () => {
  test("isDate", () => {
    expect(isDate(new Date())).toBe(true);

    // Invalid Date still counts as Date instance; adjust if your impl rejects it
    const invalid = new Date("not a date");
    expect(isDate(invalid)).toBe(false);

    expect(isDate(Date.now())).toBe(false);
    expect(isDate("2020-01-01" as any)).toBe(false);
    expect(isDate(null as any)).toBe(false);
    expect(isDate(undefined as any)).toBe(false);
  });

  test("isRegExp", () => {
    expect(isRegExp(/foo/)).toBe(true);
    expect(isRegExp(new RegExp("bar"))).toBe(true);

    expect(isRegExp("foo" as any)).toBe(false);
    expect(isRegExp(null as any)).toBe(false);
    expect(isRegExp({ source: "foo", flags: "g" } as any)).toBe(false);
  });

  test("isError", () => {
    expect(isError(new Error("oops"))).toBe(true);
    expect(isError(new TypeError("bad type"))).toBe(true);

    expect(isError("Error: nope" as any)).toBe(false);
    expect(isError({ message: "oops" } as any)).toBe(false);
    expect(isError(null as any)).toBe(false);
  });

  test("isPromise", async () => {
    const p = Promise.resolve(1);
    const asyncFn = async () => 2;
    const manualPromiseFn = () => Promise.resolve(3);

    expect(isPromise(p)).toBe(true);
    expect(isPromise(asyncFn())).toBe(true);
    expect(isPromise(manualPromiseFn())).toBe(true);

    expect(isPromise(asyncFn)).toBe(false);
    expect(isPromise(manualPromiseFn)).toBe(false);
    expect(isPromise(123 as any)).toBe(false);
    expect(isPromise("foo" as any)).toBe(false);
    expect(isPromise(null as any)).toBe(false);
    expect(isPromise(undefined as any)).toBe(false);

    // type‑narrowing example
    const value: unknown = Promise.resolve("ok");
    if (isPromise<string>(value)) {
      const result = await value;
      expect(result.toUpperCase()).toBe("OK");
    } else {
      expect(true).toBe(false);
    }
  });
});

// ---  ---------------------------------------------------------------

describe("Function / class / selector predicates", () => {
  test("isAsyncFunction", async () => {
    const asyncFn = async () => 42;
    const syncFn = () => 42;
    const returnsPromise = () => Promise.resolve(42);

    expect(isAsyncFunction(asyncFn)).toBe(true);

    expect(isAsyncFunction(syncFn)).toBe(false);
    expect(isAsyncFunction(returnsPromise)).toBe(false);
    expect(isAsyncFunction(123 as any)).toBe(false);
    expect(isAsyncFunction(null as any)).toBe(false);

    if (isAsyncFunction(asyncFn)) {
      const result = await asyncFn();
      expect(result).toBe(42);
    } else {
      expect(true).toBe(false);
    }
  });

  test("isClass", () => {
    class A {}
    function B() {}
    const C = class {};
    const arrow = () => {};

    expect(isClass(A)).toBe(true);
    expect(isClass(C)).toBe(true);

    expect(isClass(B)).toBe(false);
    expect(isClass(arrow)).toBe(false);
    expect(isClass({} as any)).toBe(false);
    expect(isClass(null as any)).toBe(false);
  });

  test("isInstanceOf", () => {
    class Base {}
    class Child extends Base {}
    class Other {}

    const baseInstance = new Base();
    const childInstance = new Child();
    const otherInstance = new Other();

    expect(isInstanceOf(baseInstance, Base)).toBe(true);
    expect(isInstanceOf(childInstance, Base)).toBe(true);
    expect(isInstanceOf(childInstance, Child)).toBe(true);

    expect(isInstanceOf(baseInstance, Child)).toBe(false);
    expect(isInstanceOf(otherInstance, Base)).toBe(false);
    expect(isInstanceOf({}, Base as any)).toBe(false);
    expect(isInstanceOf(null as any, Base as any)).toBe(false);

    // type‑narrowing example
    const value: unknown = new Error("oops");
    if (isInstanceOf(value, Error)) {
      expect(value.message).toBe("oops");
    } else {
      expect(true).toBe(false);
    }
  });

  test("isSubclassOf", () => {
    class A {}
    class B extends A {}
    class C extends B {}
    class Unrelated {}

    expect(isSubclassOf(A, A)).toBe(false);
    expect(isSubclassOf(A, B)).toBe(true);
    expect(isSubclassOf(A, C)).toBe(true);
    expect(isSubclassOf(B, C)).toBe(true);

    expect(isSubclassOf(B, A)).toBe(false);
    expect(isSubclassOf(A, Unrelated)).toBe(false);
    expect(isSubclassOf(Unrelated, A)).toBe(false);

    expect(isSubclassOf(A, {} as any)).toBe(false);
    expect(isSubclassOf({} as any, A)).toBe(false);
  });
});

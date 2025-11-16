// mapper.test.ts
import { describe, it, expect } from "bun:test";
import { Mapper, compareObjects, objectUpdated } from "../../src";

// If these helpers live elsewhere, import from your actual utils module
// and remove these inline stubs.

describe("Mapper", () => {
  it("obj() should populate from plain object", () => {
    const m = new Mapper<string, number>();
    m.obj({ a: 1, b: 2 });

    expect(m.get("a")).toBe(1);
    expect(m.get("b")).toBe(2);
    expect(m.size).toBe(2);
  });

  it("map() should copy primitive values from another Mapper", () => {
    const src = new Mapper<string, number>();
    src.set("x", 10);
    src.set("y", 20);

    const dst = new Mapper<string, number>();
    dst.map(src);

    expect(dst.get("x")).toBe(10);
    expect(dst.get("y")).toBe(20);
    expect(dst.size).toBe(2);
  });

  it("map() should keep nested Mapper instances as-is", () => {
    const nested = new Mapper<string, number>();
    nested.set("inner", 123);

    const src = new Mapper<string, any>();
    src.set("nested", nested);

    const dst = new Mapper<string, any>();
    dst.map(src);

    const got = dst.get("nested");
    expect(got).toBeInstanceOf(Mapper);
    expect((got as Mapper<string, number>).get("inner")).toBe(123);
  });

  it("map() should concatenate arrays onto existing arrays", () => {
    const src = new Mapper<string, any>();
    src.set("arr", [3, 4]);

    const dst = new Mapper<string, any>();
    // initial array
    dst.set("arr", [1, 2]);

    dst.map(src);

    expect(dst.get("arr")).toEqual([1, 2, 3, 4]);
  });

  it("map() should create array when key lacks and merge arrays", () => {
    const src = new Mapper<string, any>();
    src.set("arr", [1, 2]);

    const dst = new Mapper<string, any>();

    dst.map(src);

    expect(dst.get("arr")).toEqual([1, 2]);
  });

  it("map() should deep-assign plain objects via ass()", () => {
    const src = new Mapper<string, any>();
    src.set("cfg", { a: 1 });
    src.set("other", { b: 2 });

    const dst = new Mapper<string, any>();
    dst.set("cfg", { x: 9 });

    dst.map(src);

    expect(dst.get("cfg")).toEqual({ x: 9, a: 1 });
    expect(dst.get("other")).toEqual({ b: 2 });
  });

  it("ass() should assign into existing object value", () => {
    const m = new Mapper<string, any>();
    m.set("cfg", { a: 1 });
    m.ass("cfg", { b: 2 });

    expect(m.get("cfg")).toEqual({ a: 1, b: 2 });
  });

  it("ass() should initialize missing key with empty object before assign", () => {
    const m = new Mapper<string, any>();
    m.ass("cfg", { a: 1 });

    expect(m.get("cfg")).toEqual({ a: 1 });
  });

  it("lacks() should be inverse of has()", () => {
    const m = new Mapper<string, number>();
    m.set("a", 1);

    expect(m.has("a")).toBe(true);
    expect(m.lacks("a")).toBe(false);
    expect(m.lacks("b")).toBe(true);
  });

  it("init() should set default when key is missing", () => {
    const m = new Mapper<string, number>();

    const v1 = m.init("count", 0);
    expect(v1).toBe(0);
    expect(m.get("count")).toBe(0);
  });

  it("init() should return existing value when key is present", () => {
    const m = new Mapper<string, number>();
    m.set("count", 5);

    const v1 = m.init("count", 0);
    expect(v1).toBe(5);
    expect(m.get("count")).toBe(5);
  });

  it("obj() should be a no-op on null or undefined", () => {
    const m = new Mapper<string, number>();

    // @ts-expect-no-error – runtime should just ignore
    m.obj(null);
    m.obj(undefined as any);

    expect(m.size).toBe(0);
  });
});

/*
-------------------------

-------------------------
*/

describe("compareObjects", () => {
  it("returns no changes for identical objects", () => {
    const a = { foo: 1, bar: "x" };
    const b = { foo: 1, bar: "x" };

    const changes = compareObjects(a, b);

    expect(changes.added).toEqual({});
    expect(changes.removed).toEqual({});
    expect(changes.modified).toEqual({});
    expect(objectUpdated(changes)).toBe(false);
  });

  it("detects added keys", () => {
    const oldObj = { foo: 1 };
    const newObj = { foo: 1, bar: 2 };

    const changes = compareObjects(oldObj, newObj);

    expect(changes.added).toEqual({ bar: 2 });
    expect(changes.removed).toEqual({});
    expect(changes.modified).toEqual({});
    expect(objectUpdated(changes)).toBe(true);
  });

  it("detects removed keys", () => {
    const oldObj = { foo: 1, bar: 2 };
    const newObj = { foo: 1 };

    const changes = compareObjects(oldObj, newObj);

    expect(changes.added).toEqual({});
    expect(changes.removed).toEqual({ bar: 2 });
    expect(changes.modified).toEqual({});
    expect(objectUpdated(changes)).toBe(true);
  });

  it("detects modified primitive values", () => {
    const oldObj = { foo: 1 };
    const newObj = { foo: 2 };

    const changes = compareObjects(oldObj, newObj);

    expect(changes.added).toEqual({});
    expect(changes.removed).toEqual({});
    expect(changes.modified).toEqual({ foo: { old: 1, new: 2 } });
    expect(objectUpdated(changes)).toBe(true);
  });

  it("detects modified arrays", () => {
    const oldObj = { items: [1, 2, 3] };
    const newObj = { items: [1, 2, 4] };

    const changes = compareObjects(oldObj, newObj);

    expect(changes).toEqual({
      added: {},
      removed: {},
      modified: {
        items: { old: [1, 2, 3], new: [1, 2, 4] },
      },
    });

    expect(objectUpdated(changes)).toBe(true);
  });

  it("detects modified nested objects", () => {
    const oldObj = { nested: { foo: 1, bar: 2 } };
    const newObj = { nested: { foo: 1, bar: 3 } };

    const changes = compareObjects(oldObj, newObj);

    // you treat any nested diff as a modified top-level key
    expect(changes.added).toEqual({});
    expect(changes.removed).toEqual({});

    expect(objectUpdated(changes)).toBe(true);
  });
});

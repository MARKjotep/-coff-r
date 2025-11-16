import { describe, expect, test, mock } from "bun:test";
import {
  arrFrom,
  asArray,
  asNumber,
  asBool,
  Singleton,
  Cached,
  bind,
  rand,
  memoize,
  deprecated,
  IfClient,
} from "../../src";

describe("array", () => {
  test("from", () => {
    const ns = new Set([1, 2, 3, 4, 5, 6]);
    const af = arrFrom(ns);
    expect(af).toBeArray();
    expect(af.length).toBe(6);
  });
});

describe("as", () => {
  test("array", () => {
    expect(asArray(200)).toBeArray();
  });
  test("number", () => {
    expect(asNumber(200)).toBeNumber();
  });
  test("boolean", () => {
    expect(asBool(200)).toBeBoolean();
  });
});

describe("decorator", () => {
  const random = mock(() => Math.random());

  test("class: singleton", () => {
    @Singleton
    class SS {
      hello = 123;
      get random() {
        return random();
      }
    }
    const NSS = new SS();
    const NS2 = new SS();
    NS2.hello = 58;

    expect(NSS).toEqual(NS2);
    expect(NS2.hello).toBe(58);
  });

  test("class: cached", () => {
    @Cached
    class SS {
      hello = 123;
      get random() {
        return random();
      }
    }
    const NSS = new SS();
    expect(NSS.random).toEqual(NSS.random);
  });

  class SS {
    hello = 123;
    get random() {
      return random();
    }
    @bind
    lol() {
      return this;
    }
    @memoize
    memoIz() {
      const _rand = rand(1, 100);
      // log.i = `called once.. ${_rand}`;
      return _rand;
    }
    @deprecated("hmm deprecated!")
    depri() {
      return "hello!";
    }
  }
  const SX = new SS();
  test("method: bind", () => {
    //
    const { lol } = SX;

    expect(lol()).toBeInstanceOf(SS);
  });

  test("method: memoize", () => {
    const memo1 = SX.memoIz();
    expect(SX.memoIz()).toBe(memo1);
  });
});

describe("If", () => {
  test("Not client", () => {
    expect(
      IfClient(() => {
        return 1;
      }),
    ).toBeNull();
  });
});

// path.test.ts
import { describe, expect, test } from "bun:test";
import { pathType, parsePath } from "../../src"; // adjust to your actual module path

describe("pathType", () => {
  test("detects integer numbers", () => {
    expect(pathType("0")).toEqual([0, "int"]);
    expect(pathType("42")).toEqual([42, "int"]);
    expect(pathType("-7")).toEqual([-7, "int"]);
  });

  test("detects float numbers", () => {
    expect(pathType("3.14")).toEqual([3.14, "float"]);
    expect(pathType("-0.5")).toEqual([-0.5, "float"]);
  });

  test("treats numeric-looking strings as string when isNumber returns false", () => {
    // This is mostly a contract test around your isNumber implementation.
    // If isNumber("01") is true/false you may want to assert that behavior explicitly.
    expect(pathType("abc")).toEqual(["abc", "string"]);
  });

  test("detects final file when isFinal=true", () => {
    expect(pathType("file.txt", true)).toEqual(["file.txt", "file"]);
    expect(pathType("archive.tar.gz", true)).toEqual([
      "archive.tar.gz",
      "file",
    ]);
  });

  test("does not treat file-like word as file when isFinal=false", () => {
    expect(pathType("file.txt", false)).toEqual(["file.txt", "string"]);
  });

  test("root slash special case", () => {
    expect(pathType("/")).toEqual(["/", "-"]);
  });

  test("detects uuid-like strings", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(uuid).toHaveLength(36);
    expect((uuid.match(/\-/g) ?? []).length).toBe(4);
    expect(pathType(uuid)).toEqual([uuid, "uuid"]);
  });

  test("falls back to string", () => {
    expect(pathType("segment")).toEqual(["segment", "string"]);
    expect(pathType("file_without_ext", true)).toEqual([
      "file_without_ext",
      "string",
    ]);
  });
});

describe("parsePath", () => {
  test("normalizes leading slash", () => {
    expect(parsePath("foo/bar")).toEqual({
      parsed: ["foo", "bar"],
      args: [],
    });

    expect(parsePath("/foo/bar")).toEqual({
      parsed: ["foo", "bar"],
      args: [],
    });
  });

  test("handles root path", () => {
    expect(parsePath("/")).toEqual({
      parsed: ["/"],
      args: [],
    });
  });

  test("handles trailing slash", () => {
    expect(parsePath("/foo/bar/")).toEqual({
      parsed: ["foo", "bar", "/"],
      args: [],
    });
  });

  test("parses simple literal segments", () => {
    expect(parsePath("/api/v1/users")).toEqual({
      parsed: ["api", "v1", "users"],
      args: [],
    });
  });

  test("parses single typed parameter", () => {
    expect(parsePath("/users/<int:id>")).toEqual({
      parsed: ["users", "int"],
      args: ["id"],
    });
  });

  test("parses typed parameter without name", () => {
    expect(parsePath("/items/<uuid>")).toEqual({
      parsed: ["items", "uuid"],
      args: ["_"],
    });
  });

  test("parses multiple parameters and literals", () => {
    expect(parsePath("/orgs/<uuid:orgId>/users/<int:userId>/details")).toEqual({
      parsed: ["orgs", "uuid", "users", "int", "details"],
      args: ["orgId", "userId"],
    });
  });

  test("ignores malformed parameter segments", () => {
    // segment with "<" but not matching /(?<=<)[^/].*?(?=>|$)/g
    expect(parsePath("/bad/<:noType>/ok")).toEqual({
      parsed: ["bad", "ok"],
      args: [],
    });
  });

  test("treats lone '>' segment as root slash", () => {
    expect(parsePath("/foo/>/bar")).toEqual({
      parsed: ["foo", "/", "bar"],
      args: [],
    });
  });
});

/*
-------------------------

-------------------------
*/

import { isInt, isNumber } from "../is";

/*
-------------------------
ROUTE AND STORAGE PROVIDER
-------------------------
*/

export const pathType = (
  wrd: string,
  isFinal: boolean = false,
): [any, string] => {
  if (isNumber(wrd)) {
    return [+wrd, isInt(wrd) ? "int" : "float"];
  }
  if (isFinal && /\.\w+$/.test(wrd)) {
    return [wrd, "file"];
  }

  if (wrd === "/") {
    return [wrd, "-"];
  }

  if (wrd.length === 36 && wrd.match(/\-/g)?.length === 4) {
    return [wrd, "uuid"];
  }

  return [wrd, "string"];
};

export const parsePath = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const segments = normalizedPath.match(/(?<=\/)[^/].*?(?=\/|$)/g) ?? ["/"];

  const [parsed, args] = segments.reduce<[string[], string[]]>(
    ([pathParts, parameters], segment) => {
      if (segment.includes("<")) {
        const paramMatch = segment.match(/(?<=<)[^/].*?(?=>|$)/g);
        if (paramMatch?.length) {
          const [paramType, paramName] = paramMatch[0].split(":");
          if (paramType) {
            pathParts.push(paramType);
            parameters.push(paramName || "_");
          }
        }
      } else {
        pathParts.push(segment === ">" ? "/" : segment);
      }
      return [pathParts, parameters];
    },
    [[], []],
  );

  if (normalizedPath.endsWith("/") && normalizedPath.length > 1) {
    parsed.push("/");
  }

  return { parsed, args };
};

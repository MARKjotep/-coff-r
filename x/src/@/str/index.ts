/*
-------------------------
CONST
-------------------------
*/

// export const RBYTES = new RegExp(/(\d+)(\d*)/, "m");
export const numSequence = (length: number) =>
  Array.from({ length }, (_, ind) => ind);

const charU = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  charL = "abcdefghijklmnopqrstuvwxyz";

// STRINGS ------------------------------------

export const strip = (str: string, charToStrip: string): string => {
    if (!str || !charToStrip) return str;
    return str.replace(
      new RegExp(`^${charToStrip}+|${charToStrip}+$`, "g"),
      "",
    );
  },
  stripOnce = (char: string, tostrip: string) =>
    char.replace(new RegExp(`^${tostrip}|${tostrip}$`, "g"), ""),
  /*
  -------------------------
  -------------------------
  */
  buffed = (str: string): Buffer => {
    return Buffer.from(str);
  },
  /*
  -------------------------
  -------------------------
  */

  /*
  -------------------------
  JSON
  -------------------------
  */
  ngify = (str: object) => JSON.stringify(str),
  sparse = (str: string) => {
    return JSON.parse(str);
  },
  /*
  -------------------------
  -------------------------
  */
  camel = (str: string) => {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  },
  reCamel = (_case: string) => {
    if (_case.startsWith("webkit")) {
      _case = "-" + _case;
    }
    return _case.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };

export const makeID = (length: number) => {
  const _chars = charU + charL;
  const nums = numSequence(10).join("");
  return Array.from({ length }, (_, i) => _chars + (i ? nums : "")).reduce(
    (acc, char) => {
      return (acc += char.charAt(Math.floor(Math.random() * char.length)));
    },
    "",
  );
};

export const rand = (min = 6, max?: number) => {
  if (!max) return Math.floor(Math.random() * min);
  return Math.round(Math.random() * (max - min) + min);
};

export const randomAZ = () => {
  const cr = [...charU, ...charL];
  const rnd = rand(0, cr.length);
  return cr[rnd];
};

export const strDecode = (str: any) => {
  return new TextDecoder().decode(str);
};

export const addBASE = (base: string, str: string) => {
  const isSLASH = str === "/" ? "" : str;
  if (str.startsWith("#")) {
    //
    return base + str;
  }

  return str.startsWith("/") ? base + isSLASH : str;
};

/*
-------------------------
CONST
-------------------------
*/

// export const RBYTES = new RegExp(/(\d+)(\d*)/, "m");
export const numSequence = (length: number) =>
  Array.from({ length }, (_, ind) => ind);

/*
  -------------------------
  JSON
  -------------------------
  */
export const ngify = (str: object) => JSON.stringify(str);
export const sparse = (str: string) => {
  return JSON.parse(str);
};

/*
-------------------------

-------------------------
*/

export const camel = (str: string) => {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
};

export const reCamel = (_case: string) => {
  if (_case.startsWith("webkit")) {
    _case = "-" + _case;
  }
  return _case.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

export const rand = (min = 6, max?: number) => {
  if (!max) return Math.floor(Math.random() * min);
  return Math.round(Math.random() * (max - min) + min);
};

const charU = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const charL = "abcdefghijklmnopqrstuvwxyz";

export const randomAZ = () => {
  const cr = [...charU, ...charL];
  const rnd = rand(0, cr.length);
  return cr[rnd];
};

// STRINGS ------------------------------------

export const strip = (str: string, charToStrip: string): string => {
  if (!str || !charToStrip) return str;
  return str.replace(new RegExp(`^${charToStrip}+|${charToStrip}+$`, "g"), "");
};
export const stripOnce = (char: string, tostrip: string) =>
  char.replace(new RegExp(`^${tostrip}|${tostrip}$`, "g"), "");

export const buffed = (str: string): Buffer => {
  return Buffer.from(str);
};

export const strDecode = (str: any) => {
  return new TextDecoder().decode(str);
};

// ---  ---------------------------------------------------------------

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

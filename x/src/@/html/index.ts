import type { obj, Partially, V } from "../types";
import { isArr, isBool, isNotWindow, isNumber, isStr, isWindow } from "../is";
import { Mapper, oAss, oItems, oVals } from "../obj";
import { Meta } from "./meta";
import { makeID, reCamel } from "../str";

/*
-------------------------
HTML head provider
-------------------------
*/
type meta<T> = {
  charset?: T;
  content?: T;
  "http-equiv"?: T;
  name?: T;
  property?: T;
  media?: T;
  url?: T;
};
type link<T> = {
  href?: T;
  hreflang?: T;
  media?: T;
  referrerpolicy?: T;
  rel?: "stylesheet" | "icon" | "manifest" | T;
  sizes?: T;
  title?: T;
  type?: T;
  as?: T;
  crossorigin?: T;
};
type impmap = {
  imports?: obj<string>;
  scopes?: obj<string>;
  integrity?: obj<string>;
};
type script<T> = {
  async?: T;
  crossorigin?: T;
  defer?: T;
  integrity?: T;
  nomodule?: T;
  referrerpolicy?: T;
  src?: T;
  type?: "text/javascript" | T;
  id?: T;
  importmap?: impmap;
  body?: T;
};
type base<T> = {
  href?: T;
  target?: "_blank" | "_parent" | "_self" | "_top";
};

export interface headAttr {
  title?: string;
  base?: base<string>[];
  meta?: meta<string>[] | Meta;
  link?: link<string>[];
  script?: script<string | boolean>[];
  css?: string[] | string;
  js?: string[] | string;
  description?: string;
}

export abstract class head implements headAttr {
  declare title?: string;
  declare description?: string;
  declare css?: string[] | string;
  declare js?: string[] | string;
  declare meta?: meta<string>[] | Meta;
  declare link?: link<string>[];
  declare script?: script<string | boolean>[];
}
//

export type CSSinT = {
  [P in keyof CSSStyleDeclaration]?: V;
} & {
  [key: string]: V;
};

export type headType = Mapper<keyof headAttr, any>;

const GID = ["charset", "name", "property", "http-equiv"];
const processMeta = (
  head: obj<obj<string>>,
  _meta: meta<string>[],
  mark: boolean = false,
  push: obj<any> = {},
) => {
  _meta.forEach((me) => {
    for (const g of GID) {
      if (g in me) {
        const mmg = me[g as keyof meta<string>];
        if (mark) {
          oAss(me, { x: true });
        } else if (!("x" in me)) {
          oAss(me, push);
        }
        head[`${g}_${g === "charset" ? "" : mmg}`] = me;
      }
    }
  });
};

const processLink = (
  head: obj<obj<string>>,
  _link: link<string>[],
  mark: boolean = false,
  push: obj<any> = {},
) => {
  _link.forEach((me) => {
    if ("href" in me) {
      const mmg = me["href"];
      if (mark) {
        oAss(me, { x: true });
      } else if (!("x" in me)) {
        oAss(me, push);
      }
      head[`${mmg}`] = me;
    }
  });
};

interface hHeadCFG {
  initial?: headType;
  mark?: boolean;
  push?: obj<any>;
}

export class _htmlHead {
  private _head: headType;
  idm?: idm;
  mark: boolean;
  push: obj<any>;
  constructor({ initial, mark, push }: Partially<hHeadCFG> = {}) {
    this._head = new Mapper(initial);
    this.mark = mark || false;
    this.push = push || {};
  }
  set head(heads: headAttr) {
    oItems(heads).forEach(([k, v]) => {
      if (k === "title" || k === "base") {
        if (v !== undefined) {
          if (k == "base") {
            if (this.mark) {
              oAss(v[0] || {}, { x: true });
            } else if (!("x" in v[0] || {})) {
              oAss(v[0] || {}, this.push);
            }
          }

          this._head.set(k, v);
        }
        return;
      }

      if (v instanceof Meta) {
        return processMeta(
          this._head.init("meta", {}),
          v.metas,
          this.mark,
          this.push,
        );
      }

      if (!isArr(v)) return;

      switch (k) {
        case "meta":
          return processMeta(
            this._head.init("meta", {}),
            v,
            this.mark,
            this.push,
          );
        case "link":
          return processLink(
            this._head.init("link", {}),
            v,
            this.mark,
            this.push,
          );
        case "script":
          if (v.length) {
            this._head.init(k, []);
            const mp = v.map((vm) => {
              if (!vm.yid && this.idm) {
                vm.yid = "sc" + this.idm.mid;
              }
              if (this.mark) {
                oAss(vm, { x: true });
              } else if (!("x" in vm)) {
                oAss(vm, this.push);
              }
              return vm;
            });
            (this._head.get(k) as obj<string>[]).push(...mp);
          }
          return;
      }
    });
  }
  get head(): headType {
    return this._head;
  }
  set id(id: string) {
    this.idm = new idm(id);
  }
}

export const getAttr = (attr: obj<V>) => {
  return oItems(attr ?? {})
    .reduce<string[]>(
      (acc, [k, v]) => {
        acc.push(isBool(v) && v ? k : `${k}="${v}"`);
        return acc;
      },
      [""],
    )
    .join(" ");
};

export const getHead = (v: headType) => {
  let baseMod = new Set();

  if (!v) return "";
  const GH = [...v].reduce<Set<string>>((acc, [kk, vv]) => {
    if (kk === "meta" || kk === "link") {
      vv = oVals(vv);
    }

    if (isStr(vv)) {
      if (kk === "title") {
        baseMod.add(`<${kk}>${vv}</${kk}>`);
      } else {
        acc.add(`<${kk}>${vv}</${kk}>`);
      }
      return acc;
    }
    if (!isArr(vv)) return acc;

    if (kk === "base") {
      const sr = vv.slice(-1);
      if (sr) {
        baseMod.add(`<${kk}${getAttr(sr[0])}>`);
        return acc;
      }
    }

    const elements = vv.map((vl) => {
      if (kk === "script") {
        const attrs = { ...vl };

        let content = "";
        if ("importmap" in attrs) {
          attrs.type = "importmap";
          content = JSON.stringify(attrs.importmap);
          delete attrs.importmap;
        } else if ("body" in attrs) {
          content = attrs.body;
          delete attrs.body;
        }

        return `<${kk}${getAttr(attrs)}>${content}</${kk}>`;
      }
      return `<${kk}${getAttr(vl)}>`;
    });

    elements.forEach((el) => {
      if (el.includes('type="module"')) {
        baseMod.add(el);
      } else if (el.includes("<meta")) {
        baseMod.add(el);
      } else {
        acc.add(el);
      }
    });
    return acc;
  }, new Set());

  return [...baseMod, ...GH].join("");
};

type CJS = { css?: string | string[]; js?: string | string[] };

export class htmlHead {
  lang: string = "en";
  htmlHead: headType;
  head: (heads?: Omit<headAttr, "base">) => void;
  constructor({ mark, push }: hHeadCFG = {}) {
    this.htmlHead = new Mapper();
    this.head = (heads: Omit<headAttr, "base"> = {}) => {
      const NHT = new _htmlHead({ initial: this.htmlHead, mark, push });
      const { link, script, meta, title, description, css, js } = heads;

      if (description) {
        NHT.head = {
          meta: [
            {
              name: "description",
              content: description,
            },
          ],
        };
      }

      CSSJSHead(NHT, { css, js });

      if ("base" in heads) {
        NHT.head = { base: heads.base } as any;
      }

      NHT.head = { script, title, meta, link } as any;

      this.htmlHead = NHT.head;
    };
  }
}

export const CSSJSHead = (_hhead: _htmlHead, head: Partially<headAttr>) => {
  const { css, js } = head;
  if (css) {
    const isc = isArr(css) ? css : [css];
    const mp = isc.map((mm) => ({
      rel: `preload stylesheet`,
      href: mm,
      as: "style",
    }));

    _hhead.head = {
      link: [...mp],
    };
  }

  if (js) {
    const isc = isArr(js) ? js : [js];
    const mp = isc.map((mm) => ({
      src: mm,
    }));

    _hhead.head = {
      script: [...mp],
    };
  }
};

interface cookieSet {
  maxAge?: Date | number;
  expires?: Date | string | number;
  path?: string | null;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string | null;
  sync_expires?: boolean;
  max_size?: number;
}

export const setCookie = (
  key: string,
  value: string = "",
  { maxAge, expires, path, domain, secure, httpOnly, sameSite }: cookieSet,
) => {
  if (maxAge instanceof Date) {
    maxAge = maxAge.getSeconds();
  }

  if (expires instanceof Date) {
    expires = expires.toUTCString();
  } else if (expires === 0) {
    expires = new Date().toUTCString();
  }

  const cprops = [
    ["Domain", domain],
    ["Expires", expires],
    ["Max-Age", maxAge],
    ["Secure", secure],
    ["HttpOnly", httpOnly],
    ["Path", path],
    ["SameSite", sameSite],
  ];

  return cprops
    .reduce<string[]>(
      (acc, [kk, v]) => {
        if (v !== undefined) acc.push(`${kk}=${v}`);
        return acc;
      },
      [`${key}=${value}`],
    )
    .join("; ");
};

export const cssLoader = async (
  vv: link<string>,
): Promise<HTMLLinkElement | undefined> => {
  if (isNotWindow) return;
  return new Promise((resolve, reject) => {
    //
    const link = document.createElement("link");
    if (vv.rel !== "stylesheet") {
      vv.rel = "stylesheet";
      vv.as = "style";
    }
    oItems(vv).forEach(([k, v]) => {
      link.setAttribute(k, v);
    });

    link.onload = () => resolve(link); // Resolve when loaded
    link.onerror = () => reject(new Error("Failed to load CSS")); // Reject on error
    document.head.appendChild(link);
  });
};

export const metaLoader = async (
  vv: link<string>,
): Promise<HTMLMetaElement | undefined> => {
  if (isNotWindow) return;
  return new Promise((resolve, reject) => {
    //
    const link = document.createElement("meta");

    oItems(vv).forEach(([k, v]) => {
      link.setAttribute(k, v);
    });

    link.onload = () => resolve(link); // Resolve when loaded
    link.onerror = () => reject(new Error("Failed to load CSS")); // Reject on error
    document.head.appendChild(link);
  });
};

export const scrptLoader = (attrs: obj<string>) => {
  if (isNotWindow) return;
  return new Promise((resolve, reject) => {
    const scrpt2 = document.createElement("script");

    let content = "";
    if ("importmap" in attrs) {
      attrs.type = "importmap";
      content = JSON.stringify(attrs.importmap);
      delete attrs.importmap;
    } else if ("body" in attrs) {
      content = attrs.body;
      delete attrs.body;
    }
    if (content) {
      scrpt2.textContent = content;
    }

    oItems(attrs).forEach(([k, v]) => {
      scrpt2.setAttribute(k, v);
    });

    scrpt2.onload = () => resolve(scrpt2); // Resolve when loaded
    scrpt2.onerror = () => reject(new Error("Failed to load Script")); // Reject on error
    document.head.appendChild(scrpt2);
    requestAnimationFrame(() => resolve("Script executed"));
  });
};
/*
-------------------------
Styler
-------------------------
*/
const getOrCreateStyleSheet = () => {
  const id = "d-css";
  const existingSheet = document.querySelector<HTMLStyleElement>(
    `#${id}`,
  )?.sheet;
  if (existingSheet) return existingSheet;

  const style = document.createElement("style");
  style.id = id;
  document.head.appendChild(style);
  return style.sheet;
};

const hasExistingRule = (styleSheet: CSSStyleSheet, selector: string) => {
  for (let i = 0; i < styleSheet.cssRules.length; i++) {
    if ((styleSheet.cssRules[i] as CSSStyleRule).selectorText === selector) {
      // styleSheet.deleteRule(i);
      return true;
    }
  }
  return false;
};

/*
-------------------------

-------------------------
*/
const createRuleString = (rules: CSSinT) =>
  Object.entries(rules)
    .map(([prop, value]) => `${reCamel(prop)}: ${value};`)
    .join(" ");

export function addCSS(selector: string, rules: CSSinT = {}) {
  if (isNotWindow) return;

  const styleSheet = getOrCreateStyleSheet();
  if (!styleSheet) return;

  const hasX = hasExistingRule(styleSheet, selector);

  if (!hasX) {
    styleSheet.insertRule(
      `${selector} { ${createRuleString(rules)} }`,
      styleSheet.cssRules.length,
    );
  }
}

export const reClass = (a: obj<any>, classes: string[]) => {
  const _cl: any[] = classes;
  if (a?.class) {
    _cl.push(...(isArr(a.class) ? a.class : [a.class]));
  }
  a.class = classes;
  return _cl.filter((cf) => cf);
};

export class idm {
  _c = 0;
  _id = "";
  constructor(mid?: string) {
    this._c = 0;
    this._id = mid ?? makeID(5);
    if (mid?.includes("-")) {
      const [prefix, lastPart = "0"] = [
        mid.split("-").slice(0, -1).join("-"),
        mid.split("-").slice(-1)[0],
      ];
      this._id = prefix;
      this._c = isNumber(lastPart) ? parseInt(lastPart) : 0;
    }
  }
  get id() {
    return this._id + "-" + this._c;
  }
  get mid() {
    return this._id + "-" + ++this._c;
  }
}

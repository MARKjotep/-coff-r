import { isArray, isBoolean, isString } from "../is";
import { Mapper, oAss, oItems, oVals } from "../obj";
import type { obj, Partially, V } from "../types";
import { Idm } from "./idm";
import { MetaBuilder } from "./meta";

// Core utility if you don't already have it
type Obj<T> = Record<string, T>;

export type MetaAttrs<Value = string> = {
  charset?: Value;
  content?: Value;
  "http-equiv"?: Value;
  name?: Value;
  property?: Value;
  media?: Value;
  url?: Value;
};

export type LinkAttrs<Value = string> = {
  href?: Value;
  hreflang?: Value;
  media?: Value;
  referrerpolicy?: Value;
  rel?: "stylesheet" | "icon" | "manifest" | Value;
  sizes?: Value;
  title?: Value;
  type?: Value;
  as?: Value;
  crossorigin?: Value;
};

export type ImportMapAttrs<Value = string> = {
  imports?: Obj<Value>;
  scopes?: Obj<Value>;
  integrity?: Obj<Value>;
};

export type ScriptAttrs<Value = string | boolean> = {
  async?: Value;
  crossorigin?: Value;
  defer?: Value;
  integrity?: Value;
  nomodule?: Value;
  referrerpolicy?: Value;
  src?: Value;
  type?: "text/javascript" | Value;
  id?: Value;
  importmap?: ImportMapAttrs<Value>;
  body?: Value;
  yid?: string;
};

export type BaseAttrs<Value = string> = {
  href?: Value;
  target?: "_blank" | "_parent" | "_self" | "_top";
};

// ---  ---------------------------------------------------------------

export interface HeadAttributes<Value = string> {
  title?: string;
  description?: string;
  base?: BaseAttrs<Value>[];
  meta?: MetaAttrs<Value>[] | MetaBuilder;
  link?: LinkAttrs<Value>[];
  script?: ScriptAttrs<Value>[];
  css?: Value[] | Value;
  js?: Value[] | Value;
}

export abstract class Head implements HeadAttributes {
  declare title?: string;
  declare description?: string;
  declare css?: string[] | string;
  declare js?: string[] | string;
  declare meta?: MetaAttrs<string>[] | MetaBuilder;
  declare link?: LinkAttrs<string>[];
  declare script?: ScriptAttrs<string>[];
}

export function createHead(attrs: HeadAttributes = {}): HeadAttributes {
  return {
    title: attrs.title ?? "",
    description: attrs.description ?? "",
    base: attrs.base ?? [],
    meta: attrs.meta ?? [],
    link: attrs.link ?? [],
    script: attrs.script ?? [],
    css: attrs.css ?? [],
    js: attrs.js ?? [],
  };
}

export type HeadNode<Value = string> =
  | { tag: "title"; content: string }
  | { tag: "base"; attrs: BaseAttrs<Value> }
  | { tag: "meta"; attrs: MetaAttrs<Value> }
  | { tag: "link"; attrs: LinkAttrs<Value> }
  | { tag: "script"; attrs: ScriptAttrs<Value> };

/*
-------------------------

-------------------------
*/

export type headType = Mapper<keyof HeadAttributes, any>;

const GID = ["charset", "name", "property", "http-equiv"] as const;

type Markable = { x?: boolean; [k: string]: any };

const markOrPush = (node: Markable, mark: boolean, push: obj<any>) => {
  if (mark) {
    oAss(node, { x: true });
  } else if (!("x" in node)) {
    oAss(node, push);
  }
};

const processMeta = (
  head: obj<obj<string>>,
  metas: MetaAttrs<string>[],
  mark = false,
  push: obj<any> = {},
) => {
  metas.forEach((m) => {
    for (const g of GID) {
      if (!(g in m)) continue;

      const key =
        g === "charset"
          ? "charset_"
          : `${g}_${m[g as keyof MetaAttrs<string>]}`;
      markOrPush(m as Markable, mark, push);
      head[key] = m;
    }
  });
};

const processLink = (
  head: obj<obj<string>>,
  links: LinkAttrs<string>[],
  mark = false,
  push: obj<any> = {},
) => {
  links.forEach((l) => {
    if (!("href" in l)) return;

    markOrPush(l as Markable, mark, push);
    head[l.href as string] = l;
  });
};

interface HeadConfig {
  initial?: headType;
  mark?: boolean;
  push?: obj<any>;
}

export class HeadCtx {
  private _head: headType;
  idm?: Idm;
  mark: boolean;
  push: obj<any>;

  constructor({ initial, mark = false, push = {} }: HeadConfig = {}) {
    this._head = new Mapper(initial);
    this.mark = mark;
    this.push = push;
  }

  private handleTitleBase(k: "title" | "base", v: any) {
    if (v === undefined) return;

    if (k === "base" && Array.isArray(v) && v[0]) {
      const base0 = v[0] as Markable;
      markOrPush(base0, this.mark, this.push);
    }
    this._head.set(k, v);
  }

  private handleMeta(v: MetaAttrs<string>[] | MetaBuilder) {
    const metaStore = this._head.init("meta", {});
    if (v instanceof MetaBuilder) {
      processMeta(metaStore, v.tags, this.mark, this.push);
    } else if (Array.isArray(v)) {
      processMeta(metaStore, v, this.mark, this.push);
    }
  }

  private handleLink(v: LinkAttrs<string>[]) {
    if (!Array.isArray(v)) return;
    processLink(this._head.init("link", {}), v, this.mark, this.push);
  }

  private handleScript(v: ScriptAttrs<string | boolean>[]) {
    if (!Array.isArray(v) || !v.length) return;

    this._head.init("script", []);

    const scripts = v.map((vm) => {
      if (!vm.yid && this.idm) {
        vm.yid = "sc" + this.idm.nextId;
      }
      markOrPush(vm as Markable, this.mark, this.push);
      return vm;
    });

    (this._head.get("script") as ScriptAttrs<string | boolean>[]).push(
      ...scripts,
    );
  }

  set head(heads: HeadAttributes) {
    oItems(heads).forEach(([k, v]) => {
      if (k === "title" || k === "base") {
        this.handleTitleBase(k, v);
        return;
      }

      if (k === "meta") {
        this.handleMeta(v as any);
        return;
      }

      if (k === "link") {
        this.handleLink(v as LinkAttrs<string>[]);
        return;
      }

      if (k === "script") {
        this.handleScript(v as ScriptAttrs<string | boolean>[]);
        return;
      }
    });
  }

  get head(): headType {
    return this._head;
  }

  set id(id: string) {
    this.idm = new Idm(id);
  }
}

// ---  ---------------------------------------------------------------

export const getAttr = (attr: obj<V>): string =>
  oItems(attr ?? {})
    .reduce<string[]>(
      (acc, [k, v]) => {
        acc.push(isBoolean(v) && v ? k : `${k}="${v}"`);
        return acc;
      },
      [""],
    )
    .join(" ");

const renderScript = (raw: any): string => {
  const attrs = { ...raw };
  let content = "";

  if ("importmap" in attrs) {
    attrs.type = "importmap";
    content = JSON.stringify(attrs.importmap);
    delete attrs.importmap;
  } else if ("body" in attrs) {
    content = attrs.body;
    delete attrs.body;
  }

  return `<script${getAttr(attrs)}>${content}</script>`;
};

const renderVoid = (tag: string, attrs: any): string =>
  `<${tag}${getAttr(attrs)}>`;

export const renderHead = (v: headType): string => {
  if (!v) return "";

  const priority = new Set<string>();
  const rest = new Set<string>();

  const entries = [...v] as [string, any][];

  for (const [kk, vvRaw] of entries) {
    let vv = vvRaw;

    if (kk === "meta" || kk === "link") {
      vv = oVals(vv);
    }

    if (isString(vv)) {
      const el = `<${kk}>${vv}</${kk}>`;
      if (kk === "title") priority.add(el);
      else rest.add(el);
      continue;
    }

    if (!isArray(vv)) continue;

    if (kk === "base") {
      const last = vv.at(-1);
      if (last) priority.add(renderVoid("base", last));
      continue;
    }

    const elements = vv.map((vl) => {
      if (kk === "script") return renderScript(vl);
      return renderVoid(kk, vl);
    });

    for (const el of elements) {
      if (el.includes('type="module"') || el.startsWith("<meta")) {
        priority.add(el);
      } else {
        rest.add(el);
      }
    }
  }

  return [...priority, ...rest].join("");
};

// ---  ---------------------------------------------------------------

export class HtmlHead {
  lang = "en";
  htmlHead: headType;
  head: (
    heads?: Omit<HeadAttributes, "base"> & { base?: HeadAttributes["base"] },
  ) => void;

  constructor({ mark = false, push = {} }: HeadConfig = {}) {
    this.htmlHead = new Mapper();

    this.head = (heads = {}) => {
      const NHT = new HeadCtx({ initial: this.htmlHead, mark, push });

      const { link, script, meta, title, description, css, js, base } =
        heads as HeadAttributes;

      if (description) {
        NHT.head = {
          meta: [{ name: "description", content: description }],
        };
      }

      CSSJSHead(NHT, { css, js });

      if (base) {
        NHT.head = { base };
      }

      NHT.head = { script, title, meta, link } as HeadAttributes;

      this.htmlHead = NHT.head;
    };
  }
}

export const CSSJSHead = (_hhead: HeadCtx, head: Partially<HeadAttributes>) => {
  const { css, js } = head;

  const toArray = <T>(v: T | T[] | undefined): T[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const cssList = toArray(css);
  if (cssList.length) {
    const links = cssList.map((href) => ({
      rel: "preload stylesheet",
      href,
      as: "style",
    }));
    _hhead.head = { link: links };
  }

  const jsList = toArray(js);
  if (jsList.length) {
    const scripts = jsList.map((src) => ({ src }));
    _hhead.head = { script: scripts };
  }
};

// ---  ---------------------------------------------------------------

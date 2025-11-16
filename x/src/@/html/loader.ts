import { isNotBrowser } from "../is";
import { oItems } from "../obj";
import type { obj } from "../types";
import type { LinkAttrs, MetaAttrs } from "./head";

const setAttrs = <E extends Element>(el: E, attrs: Record<string, any>): E => {
  oItems(attrs).forEach(([k, v]) => {
    if (v == null) return;
    el.setAttribute(k, String(v));
  });
  return el;
};

export const cssLoader = async (
  attrs: LinkAttrs<string>,
): Promise<HTMLLinkElement | undefined> => {
  if (isNotBrowser()) return;

  return new Promise((resolve, reject) => {
    const el = document.createElement("link");

    // Do not mutate caller’s object
    const next: LinkAttrs<string> = {
      ...attrs,
      rel: "stylesheet",
      as: attrs.as ?? "style",
    };

    setAttrs(el, next);

    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Failed to load CSS"));

    document.head.appendChild(el);
  });
};

export const metaLoader = async (
  attrs: MetaAttrs<string>,
): Promise<HTMLMetaElement | undefined> => {
  if (isNotBrowser()) return;

  const el = document.createElement("meta");
  setAttrs(el, attrs);
  document.head.appendChild(el);

  // No resource load, so resolve immediately
  return el;
};

export const scriptLoader = (
  rawAttrs: obj<any>,
): Promise<HTMLScriptElement | undefined> => {
  if (isNotBrowser()) return Promise.resolve(undefined);

  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    const attrs = { ...rawAttrs };

    let content = "";

    if ("importmap" in attrs) {
      attrs.type = attrs.type ?? "importmap";
      content = JSON.stringify(attrs.importmap);
      delete attrs.importmap;
    } else if ("body" in attrs) {
      content = String(attrs.body);
      delete attrs.body;
    }

    if (content) {
      el.textContent = content;
    }

    setAttrs(el, attrs);

    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Failed to load script"));

    document.head.appendChild(el);
  });
};

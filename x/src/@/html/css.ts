import { isNotBrowser } from "../is";
import { reCamel } from "../str";
import type { V } from "../types";

export type CSSinT = {
  [P in keyof CSSStyleDeclaration]?: V;
} & {
  [key: string]: V;
};

const STYLE_SHEET_ID = "d-css";

export const getOrCreateStyleSheet = (): CSSStyleSheet | undefined => {
  const existing = document.querySelector<HTMLStyleElement>(
    `#${STYLE_SHEET_ID}`,
  )?.sheet as CSSStyleSheet | null;

  if (existing) return existing;

  const style = document.createElement("style");
  style.id = STYLE_SHEET_ID;
  document.head.appendChild(style);

  // `sheet` can be null in some edge cases, so guard it
  return style.sheet ?? undefined;
};

export const hasExistingRule = (
  styleSheet: CSSStyleSheet,
  selector: string,
): boolean => {
  const rules = styleSheet.cssRules;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
      return true;
    }
  }
  return false;
};

export const ensureRule = (
  sheet: CSSStyleSheet,
  selector: string,
  body: string,
) => {
  if (hasExistingRule(sheet, selector)) return;
  sheet.insertRule(`${selector} { ${body} }`, sheet.cssRules.length);
};

const createRuleString = (rules: CSSinT): string =>
  Object.entries(rules)
    .map(([prop, value]) => `${reCamel(prop)}: ${String(value)};`)
    .join(" ");

export function upsertCSS(selector: string, rules: CSSinT = {}): void {
  if (isNotBrowser()) return;

  const styleSheet = getOrCreateStyleSheet();
  if (!styleSheet) return;

  // Find existing rule index (if any)
  let existingIndex: number | undefined;
  const { cssRules } = styleSheet;

  for (let i = 0; i < cssRules.length; i++) {
    const rule = cssRules[i];
    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
      existingIndex = i;
      break;
    }
  }

  // Remove old rule so new one becomes the effective definition
  if (existingIndex !== undefined) {
    styleSheet.deleteRule(existingIndex);
  }

  // Append new rule at the end
  const ruleText = `${selector} { ${createRuleString(rules)} }`;
  styleSheet.insertRule(ruleText, styleSheet.cssRules.length);
}

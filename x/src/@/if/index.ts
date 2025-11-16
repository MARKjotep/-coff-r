import { isNotBrowser } from "../is";

export const IfClient = <T>(fn: () => T) => {
  if (isNotBrowser()) return null;
  return fn();
};

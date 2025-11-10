import { isNotWindow } from "../is";

export const IfClient = <T>(fn: () => T) => {
  if (isNotWindow) return undefined;
  return fn();
};

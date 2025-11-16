/*
-------------------------
HTML is
-------------------------
*/

export const isClassOrId = (selector: string): boolean =>
  selector.startsWith(".") || selector.startsWith("#");

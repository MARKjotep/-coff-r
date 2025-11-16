import type { obj } from "../types";

export const updateClass = (a: obj<any>, classes: string[]): string[] => {
  const existing = a?.class;
  const merged = [
    ...classes,
    ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  ];

  const filtered = Array.from(new Set(merged.filter(Boolean)));

  a.class = filtered;
  return filtered;
};

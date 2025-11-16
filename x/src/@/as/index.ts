import { isArray } from "../is";

export const asArray = <X>(a: X) => (isArray(a) ? a : [a]);

export const asNumber = (a: any) => Number(a);

export const asBool = (a: any) => Boolean(a);

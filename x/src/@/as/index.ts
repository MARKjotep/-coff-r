import { isArr } from "../is";

export const asArray = <X>(a: X) => (isArr(a) ? a : [a]),
  asNumber = (a: any) => Number(a),
  asBool = (a: any) => Boolean(a);

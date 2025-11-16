import { isNumber } from "../is";
import { log } from "../log";
import { makeID } from "../str";

export class Idm {
  private counter: number;
  private readonly baseId: string;

  constructor(rawId?: string) {
    if (rawId && rawId.includes("-")) {
      const parts = rawId.split("-");
      const last = parts.pop() ?? "0";
      const prefix = parts.join("-");

      this.baseId = prefix || makeID(5);
      this.counter = isNumber(last) ? parseInt(last, 10) : 0;
    } else {
      this.baseId = rawId ?? makeID(5);
      this.counter = 0;
    }
  }

  // current id (does not increment)
  get id(): string {
    return `${this.baseId}-${this.counter}`;
  }

  // next id (increments)
  get nextId(): string {
    this.counter += 1;
    return `${this.baseId}-${this.counter}`;
  }
}

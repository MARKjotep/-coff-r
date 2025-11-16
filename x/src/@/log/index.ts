import { isArray, isString } from "../is";
import { asArray } from "../as";

function getCaller(depth = 3): string {
  const stack = new Error().stack?.split("\n") ?? [];
  const line = stack[depth] || "";
  const match = line.match(/at\s+([^(]+)\s*\(/);
  const fn = match ? match[1]!.split(".").pop()?.trim() : "?";
  return fn ?? "?";
}

class Logger {
  constructor(private name: string) {}
  log = (...args: any[]) => {
    const caller = getCaller(3);
    console.log(`[${this.name}.${caller}]`, ...args);
  };
  set i(a: any) {
    const caller = getCaller(3);
    console.log(`[${this.name}.${caller}]`, ...asArray(a));
  }
}

export class log {
  static logger = <T extends abstract new (...args: any) => any>(
    ctx: InstanceType<T> | string,
  ) => {
    return new Logger(isString(ctx) ? ctx : ctx.constructor.name);
  };

  static set f(a: any) {
    const caller = getCaller();
    console.log(`[${caller}]`, ...asArray(a));
  }
  static set i(a: any) {
    console.info(...asArray(a));
  }
  static set e(a: any) {
    console.error(...asArray(a));
  }
  static set w(a: any) {
    console.warn(...asArray(a));
  }
  static set d(a: any) {
    const dt = new Date().toLocaleTimeString();
    console.log(...asArray(a), `@ ${dt}`);
  }
  static get d() {
    const dt = new Date().toLocaleTimeString();
    console.log(`@ ${dt}`);
    return;
  }
}

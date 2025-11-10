import { isArr, isStr } from "../is";

const asARR = (a: any) => {
  return isArr(a) ? a : [a];
};

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
    console.log(`[${this.name}.${caller}]`, ...asARR(a));
  }
}

export class log {
  static logger = <T extends abstract new (...args: any) => any>(
    ctx: InstanceType<T> | string,
  ) => {
    return new Logger(isStr(ctx) ? ctx : ctx.constructor.name);
  };

  static set f(a: any) {
    const caller = getCaller();
    console.log(`[${caller}]`, ...asARR(a));
  }
  static set i(a: any) {
    console.info(...asARR(a));
  }
  static set e(a: any) {
    console.error(...asARR(a));
  }
  static set w(a: any) {
    console.warn(...asARR(a));
  }
  static set d(a: any) {
    const dt = new Date().toLocaleTimeString();
    console.log(...asARR(a), `@ ${dt}`);
  }
  static get d() {
    const dt = new Date().toLocaleTimeString();
    console.log(`@ ${dt}`);
    return;
  }
}

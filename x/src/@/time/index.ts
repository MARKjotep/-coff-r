type DateAdjustments = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;

  quarter?: number;
  week?: number;
  startOfMonth?: boolean;
  endOfMonth?: boolean;
};

declare global {
  interface Date {
    /**
     *
     * * Format a date using tokens.
     *
     * ### Available tokens:
     * - `YYYY, YY` —— Year
     * - `MMMM, MMM, MM, M` —— Month
     * - `dddd, ddd` —— Weekday
     * - `DD, D` —— Day of Month
     * - `HH, H, hh, h` —— Hour
     * - `mm, m` —— Minute
     * - `ss, s` —— Second
     * - `SSS` —— Millisecond
     * - `A, a` —— AM/PM
     * - `Q` —— Quarter
     * - `DoY` —— Day of Year
     * @param pattern - Format string with tokens (default: `"YYYY-MM-DD HH:mm:ss"`)
     * @param locale - Optional locale or array of locales (default: system locale)
     */
    format(pattern?: string, locale?: string | string[]): string;
  }
  interface DateConstructor {
    /**
     * Register or override a custom format token.
     * @param token The token string to replace (e.g. "DoY")
     * @param fn A function that returns a string when formatting
     */
    registerFormat(
      token: string,
      fn: (d: Date, locale?: string | string[]) => string,
    ): void;
    /**
     *
     * * Format a date using tokens.
     *
     * ### Available tokens:
     * - `YYYY, YY` —— Year
     * - `MMMM, MMM, MM, M` —— Month
     * - `dddd, ddd` —— Weekday
     * - `DD, D` —— Day of Month
     * - `HH, H, hh, h` —— Hour
     * - `mm, m` —— Minute
     * - `ss, s` —— Second
     * - `SSS` —— Millisecond
     * - `A, a` —— AM/PM
     * - `Q` —— Quarter
     * - `DoY` —— Day of Year
     * @param pattern - Format string with tokens (default: `"YYYY-MM-DD HH:mm:ss"`)
     * @param locale - Optional locale or array of locales (default: system locale)
     */
    format(pattern?: string, locale?: string | string[]): string;
  }
}

// ---  ---------------------------------------------------------------

type TokenFn = (d: Date, locale?: string | string[]) => string;

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

// Simple memo for Intl.DateTimeFormat by JSON(options)+locale
const intlCache = new Map<string, Intl.DateTimeFormat>();
function getFormatter(
  opts: Intl.DateTimeFormatOptions,
  locale?: string | string[],
) {
  const key = JSON.stringify({ locale, ...opts });
  let fmt = intlCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, opts);
    intlCache.set(key, fmt);
  }
  return fmt;
}

const tokenFns: Record<string, TokenFn> = {
  // Year
  YYYY: (d) => String(d.getFullYear()),
  YY: (d) => pad(d.getFullYear() % 100),

  // Month names/numbers
  MMMM: (d, locale) => getFormatter({ month: "long" }, locale).format(d),
  MMM: (d, locale) => getFormatter({ month: "short" }, locale).format(d),
  MM: (d) => pad(d.getMonth() + 1),
  M: (d) => String(d.getMonth() + 1),

  // Weekday names
  dddd: (d, locale) => getFormatter({ weekday: "long" }, locale).format(d),
  ddd: (d, locale) => getFormatter({ weekday: "short" }, locale).format(d),

  // Day of month
  DD: (d) => pad(d.getDate()),
  D: (d) => String(d.getDate()),

  // Hours/minutes/seconds
  HH: (d) => pad(d.getHours()),
  H: (d) => String(d.getHours()),
  hh: (d) => {
    const h = d.getHours() % 12 || 12;
    return pad(h);
  },
  h: (d) => String(d.getHours() % 12 || 12),

  // AM / PM via locale if available
  A: (d, locale) => {
    const parts = getFormatter(
      { hour: "numeric", hour12: true },
      locale,
    ).formatToParts(d);
    const dp =
      parts.find((p) => p.type === "dayPeriod")?.value ??
      (d.getHours() < 12 ? "AM" : "PM");
    return dp.toUpperCase();
  },
  a: (d, locale) => {
    const parts = getFormatter(
      { hour: "numeric", hour12: true },
      locale,
    ).formatToParts(d);
    const dp =
      parts.find((p) => p.type === "dayPeriod")?.value ??
      (d.getHours() < 12 ? "AM" : "PM");
    return dp.toLowerCase();
  },

  mm: (d) => pad(d.getMinutes()),
  m: (d) => String(d.getMinutes()),
  ss: (d) => pad(d.getSeconds()),
  s: (d) => String(d.getSeconds()),
  SSS: (d) => pad(d.getMilliseconds(), 3),
  // Quarter
  Q: (d) => String(Math.floor(d.getMonth() / 3) + 1),
  // Doy
  DoY: (d) => {
    const start = new Date(d.getFullYear(), 0, 1);
    const diff = Math.floor((+d - +start) / 86400000) + 1;
    return String(diff);
  },
};

/** Register or override a token globally */
export function registerToken(token: string, fn: TokenFn) {
  tokenFns[token] = fn;
  // Rebuild regex if you add tokens dynamically at runtime:
  // (If you rarely register at runtime, you can skip this)
  (globalThis as any).__dateTokenRegex = null;
}

function ensureTokenRegex() {
  // Optional small optimization to avoid rebuilding often
  if ((globalThis as any).__dateTokenRegex)
    return (globalThis as any).__dateTokenRegex as RegExp;
  const re = new RegExp(
    Object.keys(tokenFns)
      .sort((a, b) => b.length - a.length)
      .map((t) => t.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"))
      .join("|"),
    "g",
  );
  (globalThis as any).__dateTokenRegex = re;
  return re;
}

export function formatDate(
  date: number | string | Date,
  pattern = "YYYY-MM-DD HH:mm:ss",
  locale?: string | string[],
): string {
  const d =
    typeof date === "number"
      ? new Date(date)
      : typeof date === "string"
        ? new Date(date)
        : date;

  const re = ensureTokenRegex();

  // Per-call cache so repeated tokens don’t recompute
  const callCache = new Map<string, string>();

  return pattern.replace(re, (tok) => {
    if (callCache.has(tok)) return callCache.get(tok)!;
    const fn = tokenFns[tok];
    const out = fn ? fn(d, locale) : tok;
    callCache.set(tok, out);
    return out;
  });
}

Date.prototype.format = function (
  pattern?: string,
  locale?: string | string[],
) {
  return formatDate(this, pattern, locale);
};

Date.registerFormat = function (token, fn) {
  tokenFns[token] = fn;
  (globalThis as any).__dateTokenRegex = null; // rebuild regex lazily
};
Date.format = function (pattern?: string, locale?: string | string[]) {
  return new Date().format(pattern, locale);
};

// --- Time ---------------------------------------------------------------

export class Time {
  date: Date;
  constructor(dateMS?: number | string | Date) {
    this.date = dateMS ? new Date(dateMS) : new Date();
  }
  timed(
    time: DateAdjustments,
    weekStart: number = 1, // default monday
  ) {
    const timeUnits = [
      ["year", "FullYear"],
      ["month", "Month"],
      ["day", "Date"],
      ["hour", "Hours"],
      ["minute", "Minutes"],
      ["second", "Seconds"],
      ["millisecond", "Milliseconds"],
    ] as const;

    const d = this.date;

    // Derived units
    if (time.quarter) {
      d.setMonth(d.getMonth() + 3 * time.quarter);
    }
    if (time.week) {
      d.setDate(d.getDate() + 7 * time.week);
    }

    for (const [unit, method] of timeUnits) {
      const v = time[unit as keyof typeof time];
      if (v !== undefined && v !== 0) {
        d[`set${method}`]((d[`get${method}`] as any)() + v);
      }
    }

    // ---- start/end of month ----
    if (time.startOfMonth) {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    }

    if (time.endOfMonth) {
      d.setMonth(d.getMonth() + 1, 0); // move to day 0 of next month
      d.setHours(23, 59, 59, 999);
    }

    if (time.week !== undefined && weekStart !== undefined) {
      const currentDay = d.getDay(); // 0 = Sunday, 1 = Monday, ...
      const diff = (currentDay - weekStart + 7) % 7;
      d.setDate(d.getDate() - diff);
    }
    return d;
  }
  static timed(
    time: DateAdjustments,
    weekStart: number = 1, // default monday
  ) {
    return new Time().timed(time, weekStart);
  }
  static local(date: number) {
    return new Date(date).toLocaleString();
  }
  local() {
    return this.date.toLocaleDateString();
  }
  // ---  ---------------------------------------------------------------
  /** @type {FormatDateFn} */
  format(pattern: string = "YYYY-MM-DD HH:mm:ss", locale?: string | string[]) {
    return formatDate(this.date, pattern, locale);
  }
  /**
   * * Format a date using tokens.
   *
   * ### Available tokens:
   * - `YYYY, YY` —— Year
   * - `MMMM, MMM, MM, M` —— Month
   * - `dddd, ddd` —— Weekday
   * - `DD, D` —— Day of Month
   * - `HH, H, hh, h` —— Hour
   * - `mm, m` —— Minute
   * - `ss, s` —— Second
   * - `SSS` —— Millisecond
   * - `A, a` —— AM/PM
   * - `Q` —— Quarter
   * - `DoY` —— Day of Year
   * @param pattern - Format string with tokens (default: `"YYYY-MM-DD HH:mm:ss"`)
   * @param locale - Optional locale or array of locales (default: system locale)
   */
  static format(
    pattern: string = "YYYY-MM-DD HH:mm:ss",
    locale?: string | string[],
  ) {
    const date = new Date();
    const d =
      typeof date === "number"
        ? new Date(date)
        : typeof date === "string"
          ? new Date(date)
          : date;

    const pad = (n: number, w: number = 2) => String(n).padStart(w, "0");
    const H = d.getHours();
    const h12 = H % 12 || 12;
    // Locale-aware names
    const monthLong = new Intl.DateTimeFormat(locale, { month: "long" }).format(
      d,
    );
    const monthShort = new Intl.DateTimeFormat(locale, {
      month: "short",
    }).format(d);
    const weekdayLong = new Intl.DateTimeFormat(locale, {
      weekday: "long",
    }).format(d);
    const weekdayShort = new Intl.DateTimeFormat(locale, {
      weekday: "short",
    }).format(d);
    // AM/PM via locale if available
    const dayPeriodParts = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: true,
    }).formatToParts(d);
    const dayPeriod =
      dayPeriodParts.find((p) => p.type === "dayPeriod")?.value ||
      (H < 12 ? "AM" : "PM");
    const tokens: Record<string, string> = {
      YYYY: String(d.getFullYear()),
      YY: pad(d.getFullYear() % 100),
      MMMM: monthLong,
      MMM: monthShort,
      MM: pad(d.getMonth() + 1),
      M: String(d.getMonth() + 1),
      dddd: weekdayLong,
      ddd: weekdayShort,
      DD: pad(d.getDate()),
      D: String(d.getDate()),
      HH: pad(H),
      H: String(H),
      hh: pad(h12),
      h: String(h12),
      A: dayPeriod.toUpperCase(),
      a: dayPeriod.toLowerCase(),
      mm: pad(d.getMinutes()),
      m: String(d.getMinutes()),
      ss: pad(d.getSeconds()),
      s: String(d.getSeconds()),
      SSS: pad(d.getMilliseconds(), 3),
      Q: String(Math.floor(d.getMonth() / 3) + 1),
    };

    return pattern.replace(
      /YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|A|a|mm|m|ss|s|SSS|Q/g,
      (m) => tokens[m]!,
    );
  }
  static get now() {
    return Date.now();
  }
  // ---  ---------------------------------------------------------------
  random(end: Date = new Date()): Date {
    const startTime = this.date.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }
  static random(start: Date, end: Date = new Date()): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }
  // ---  ---------------------------------------------------------------
  delta(adjust: DateAdjustments) {
    const newDate = this.date;

    if (adjust.year) {
      newDate.setFullYear(newDate.getFullYear() + adjust.year);
    }

    if (adjust.month) {
      newDate.setMonth(newDate.getMonth() + adjust.month);
    }

    if (adjust.day) {
      newDate.setDate(newDate.getDate() + adjust.day);
    }

    if (adjust.hour) {
      newDate.setHours(newDate.getHours() + adjust.hour);
    }

    if (adjust.minute) {
      newDate.setMinutes(newDate.getMinutes() + adjust.minute);
    }

    if (adjust.second) {
      newDate.setSeconds(newDate.getSeconds() + adjust.second);
    }

    return newDate;
  }
  static delta(adjust: DateAdjustments) {
    return new Time().delta(adjust);
  }
}

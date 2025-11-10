declare const arrFrom: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    <T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    <T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
};

declare const asArray: <X>(a: X) => (X & any[]) | X[];
declare const asNumber: (a: any) => number;
declare const asBool: (a: any) => boolean;

/**
 * A decorator function that creates a singleton class from the provided constructor.
 * The singleton instance is cached and returned on subsequent calls to the constructor.
 * @param constructor - The constructor function of the class to be made a singleton.
 * @returns A new class that extends the provided constructor and implements the singleton pattern.
 */
declare function Singleton<T extends {
    new (...args: any[]): any;
}>(constructor: T): {
    new (...args: any[]): {
        [x: string]: any;
    };
} & T;
/**
 * A decorator function that creates a cached class from the provided constructor.
 * The class instance is cached and returned on subsequent calls to the constructor.
 * This can be useful for expensive object creation or initialization.
 * @param constructor - The constructor function of the class to be cached.
 * @returns A new class that extends the provided constructor and implements caching.
 */
declare function Cached<T extends {
    new (...args: any[]): any;
}>(constructor: T): {
    new (...args: any[]): {
        [x: string]: any;
    };
} & T;
/**
 * Method decorator. Bind this to method when destructured.
 */
declare const bind: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare function memoize(_t: any, _k: string, desc: PropertyDescriptor): PropertyDescriptor;
declare function deprecated(message: string): (_t: any, key: string, desc: PropertyDescriptor) => PropertyDescriptor;

type V = string | number | boolean;
type obj<T> = Record<string, T>;
type dict<K extends keyof any, T> = Record<K, T>;
type maybePromise<T> = Promise<T> | T;
type Partially<T> = {
    [K in keyof T]: T[K] | undefined;
};

/**
 * A custom Map implementation that provides additional utility methods for working with objects and maps.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 */
declare class Mapper<K, V> extends Map<K, V> {
    obj(obj?: object | null): void;
    map(map: Mapper<K, V>): void;
    ass<T>(key: K, obj: T): void;
    lacks(key: K): boolean;
    init(key: K, val: V): V;
}
declare const oVals: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): T[];
    (o: {}): any[];
};
declare const oKeys: {
    (o: object): string[];
    (o: {}): string[];
};
declare const oItems: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
};
declare const oFItems: {
    <T = any>(entries: Iterable<readonly [PropertyKey, T]>): {
        [k: string]: T;
    };
    (entries: Iterable<readonly any[]>): any;
};
declare const oFreeze: {
    <T extends Function>(f: T): T;
    <T extends {
        [idx: string]: U | null | undefined | object;
    }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;
    <T>(o: T): Readonly<T>;
};
declare const oDefine: <T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => T;
declare const oAss: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
declare const oHas: (o: object, v: PropertyKey) => boolean;
declare const oLen: (ob: object) => number;
declare const keyInMap: <T>(id: string, map: Mapper<string, any>) => T;
declare const keyInMapArray: <T>(id: string, map: Mapper<string, any>) => T;
type Changes = {
    added: Record<string, any>;
    removed: Record<string, any>;
    modified: Record<string, {
        old: any;
        new: any;
    }>;
};
declare const compareObjects: <T extends object>(oldObj: T, newObj: T | any) => Changes;
declare function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean;
declare const objectUdpated: (changes: Changes) => boolean;
declare function readOnly<T extends any>(instance: T, OD: Record<string, any>): void;

interface metaViewport {
    width?: string;
    height?: string;
    initialScale?: string;
    minimumScale?: string;
    maximumScale?: string;
    userScalable?: string;
    interactiveWidget?: string;
}
interface httpeQuiv {
    contentSecurityPolicy?: string;
    contentType?: string;
    defaultStyle?: string;
    refresh?: string;
    cacheControl?: string;
    xUaCompatible?: string;
}
interface OG {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    card?: "summary" | "summary_large_image" | "app" | "player";
}
type meta$1<T> = {
    charset?: T;
    content?: T;
    "http-equiv"?: T;
    name?: T;
    property?: T;
    media?: T;
    url?: T;
};
declare class Meta {
    metas: Record<string, string>[];
    constructor(description?: string);
    author(name: string): this;
    charset(val: string): this;
    keywords(...keyword: string[]): this;
    viewport(vport: metaViewport): this;
    httpEquiv(httpeQuiv: httpeQuiv): this;
    robots(...robot: ("index" | "noindex" | "follow" | "nofollow")[]): this;
    themeColor(color: string): this;
    openGraph(og: Omit<OG, "card">): this;
    twitter(og: OG): this;
    push(metas: meta$1<string>[]): void;
    private set meta(value);
}

type meta<T> = {
    charset?: T;
    content?: T;
    "http-equiv"?: T;
    name?: T;
    property?: T;
    media?: T;
    url?: T;
};
type link<T> = {
    href?: T;
    hreflang?: T;
    media?: T;
    referrerpolicy?: T;
    rel?: "stylesheet" | "icon" | "manifest" | T;
    sizes?: T;
    title?: T;
    type?: T;
    as?: T;
    crossorigin?: T;
};
type impmap = {
    imports?: obj<string>;
    scopes?: obj<string>;
    integrity?: obj<string>;
};
type script<T> = {
    async?: T;
    crossorigin?: T;
    defer?: T;
    integrity?: T;
    nomodule?: T;
    referrerpolicy?: T;
    src?: T;
    type?: "text/javascript" | T;
    id?: T;
    importmap?: impmap;
    body?: T;
};
type base<T> = {
    href?: T;
    target?: "_blank" | "_parent" | "_self" | "_top";
};
interface headAttr {
    title?: string;
    base?: base<string>[];
    meta?: meta<string>[] | Meta;
    link?: link<string>[];
    script?: script<string | boolean>[];
    css?: string[] | string;
    js?: string[] | string;
    description?: string;
}
declare abstract class head implements headAttr {
    title?: string;
    description?: string;
    css?: string[] | string;
    js?: string[] | string;
    meta?: meta<string>[] | Meta;
    link?: link<string>[];
    script?: script<string | boolean>[];
}
type CSSinT = {
    [P in keyof CSSStyleDeclaration]?: V;
} & {
    [key: string]: V;
};
type headType = Mapper<keyof headAttr, any>;
interface hHeadCFG {
    initial?: headType;
    mark?: boolean;
    push?: obj<any>;
}
declare class _htmlHead {
    private _head;
    idm?: idm;
    mark: boolean;
    push: obj<any>;
    constructor({ initial, mark, push }?: Partially<hHeadCFG>);
    set head(heads: headAttr);
    get head(): headType;
    set id(id: string);
}
declare const getAttr: (attr: obj<V>) => string;
declare const getHead: (v: headType) => string;
declare class htmlHead {
    lang: string;
    htmlHead: headType;
    head: (heads?: Omit<headAttr, "base">) => void;
    constructor({ mark, push }?: hHeadCFG);
}
declare const CSSJSHead: (_hhead: _htmlHead, head: Partially<headAttr>) => void;
interface cookieSet {
    maxAge?: Date | number;
    expires?: Date | string | number;
    path?: string | null;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: string | null;
    sync_expires?: boolean;
    max_size?: number;
}
declare const setCookie: (key: string, value: string | undefined, { maxAge, expires, path, domain, secure, httpOnly, sameSite }: cookieSet) => string;
declare const cssLoader: (vv: link<string>) => Promise<HTMLLinkElement | undefined>;
declare const metaLoader: (vv: link<string>) => Promise<HTMLMetaElement | undefined>;
declare const scrptLoader: (attrs: obj<string>) => Promise<unknown> | undefined;
declare function addCSS(selector: string, rules?: CSSinT): void;
declare const reClass: (a: obj<any>, classes: string[]) => any[];
declare class idm {
    _c: number;
    _id: string;
    constructor(mid?: string);
    get id(): string;
    get mid(): string;
}

declare const IfClient: <T>(fn: () => T) => T | undefined;

type ModuleLike = {
    [Symbol.toStringTag]: "Module";
    default?: unknown;
    [key: string]: unknown;
};
declare const isFN: (v: any) => v is Function;
declare const isAsync: (v: any) => v is Function;
declare const isPromise: (v: any) => v is Function;
declare const isNumber: (value: any) => boolean;
declare const isObject: (val: any) => val is Record<string, any>;
declare const isPlainObject: (value: any) => boolean;
declare const isModule: (obj: any) => obj is ModuleLike;
declare const isArraybuff: (val: any) => val is string | ArrayBuffer | Uint8Array<ArrayBufferLike>;
declare const isClassOrId: (k: string) => boolean;
declare const isBool: (v: any) => v is boolean;
declare const isStr: (v: any) => v is string;
declare const isArr: (v: any) => v is any[];
declare const isObj: (v: any) => v is object;
declare const isNum: (v: any) => v is number;
declare const isNull: (v: any) => v is null;
declare const isNotNull: <T>(v: T) => v is Exclude<T, null>;
declare const isUndefined: (v: any) => v is undefined;
declare const isDefined: <T>(v: T) => v is Exclude<T, undefined>;
declare const isInt: (str: string) => boolean;
declare const isWindow: boolean;
declare const isNotWindow: boolean;
declare function isClass(value: any): boolean;
declare function isClassTypeOf(baseClass: Function, testClass: Function): boolean;

declare class Logger {
    private name;
    constructor(name: string);
    log: (...args: any[]) => void;
    set i(a: any);
}
declare class log {
    static logger: <T extends abstract new (...args: any) => any>(ctx: InstanceType<T> | string) => Logger;
    static set f(a: any);
    static set i(a: any);
    static set e(a: any);
    static set w(a: any);
    static set d(a: any);
    static get d(): any;
}

declare const pathType: (wrd: string, isFinal?: boolean) => [any, string];
declare const parsePath: (path: string) => {
    parsed: string[];
    args: string[];
};

declare const numSequence: (length: number) => number[];
declare const strip: (str: string, charToStrip: string) => string;
declare const stripOnce: (char: string, tostrip: string) => string;
declare const buffed: (str: string) => Buffer;
declare const ngify: (str: object) => string;
declare const sparse: (str: string) => any;
declare const camel: (str: string) => string;
declare const reCamel: (_case: string) => string;
declare const makeID: (length: number) => string;
declare const rand: (min?: number, max?: number) => number;
declare const randomAZ: () => string | undefined;
declare const strDecode: (str: any) => string;
declare const addBASE: (base: string, str: string) => string;

declare class MinStorage {
    readonly path: string;
    readonly parsed: string[];
    readonly args: string[];
    constructor(path: string);
}

declare const matchPath: (path: string, route: string) => obj<any>;
/** --------------------
 * string | int | float | file | uuid
 * - /path/\<string:hell>
 */
declare class Storage<T extends MinStorage> {
    private _storage;
    private CC;
    constructor();
    set(min: T): void;
    get(path: string): [T | undefined, Record<string, string>];
    keys(): MapIterator<string>;
}
declare class SymStorage<T extends MinStorage> {
    [k: symbol]: Storage<T>;
    constructor(...sym: symbol[]);
    get(sym: symbol): Storage<T>;
}

declare class Cacher<T> {
    private storage;
    constructor();
    cache(key: string, val: () => T): T;
}

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
        registerFormat(token: string, fn: (d: Date, locale?: string | string[]) => string): void;
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
type TokenFn = (d: Date, locale?: string | string[]) => string;
/** Register or override a token globally */
declare function registerToken(token: string, fn: TokenFn): void;
declare function formatDate(date: number | string | Date, pattern?: string, locale?: string | string[]): string;
declare class Time {
    date: Date;
    constructor(dateMS?: number | string | Date);
    timed(time: DateAdjustments, weekStart?: number): Date;
    static timed(time: DateAdjustments, weekStart?: number): Date;
    static local(date: number): string;
    local(): string;
    /** @type {FormatDateFn} */
    format(pattern?: string, locale?: string | string[]): string;
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
    static format(pattern?: string, locale?: string | string[]): string;
    static get now(): number;
    random(end?: Date): Date;
    static random(start: Date, end?: Date): Date;
    delta(adjust: DateAdjustments): Date;
    static delta(adjust: DateAdjustments): Date;
}

export { CSSJSHead, Cached, Cacher, IfClient, Mapper, MinStorage, Singleton, Storage, SymStorage, Time, _htmlHead, addBASE, addCSS, areSetsEqual, arrFrom, asArray, asBool, asNumber, bind, buffed, camel, compareObjects, cssLoader, deprecated, formatDate, getAttr, getHead, head, htmlHead, idm, isArr, isArraybuff, isAsync, isBool, isClass, isClassOrId, isClassTypeOf, isDefined, isFN, isInt, isModule, isNotNull, isNotWindow, isNull, isNum, isNumber, isObj, isObject, isPlainObject, isPromise, isStr, isUndefined, isWindow, keyInMap, keyInMapArray, log, makeID, matchPath, memoize, metaLoader, ngify, numSequence, oAss, oDefine, oFItems, oFreeze, oHas, oItems, oKeys, oLen, oVals, objectUdpated, parsePath, pathType, rand, randomAZ, reCamel, reClass, readOnly, registerToken, scrptLoader, setCookie, sparse, strDecode, strip, stripOnce };
export type { CSSinT, ModuleLike, Partially, V, dict, headAttr, headType, maybePromise, obj };

declare const arrFrom: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    <T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    <T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
};

declare const asArray: <X>(a: X) => (X & unknown[]) | X[];
declare const asNumber: (a: any) => number;
declare const asBool: (a: any) => boolean;

type V = string | number | boolean;
type obj<T> = Record<string, T>;
type dict<K extends keyof any, T> = Record<K, T>;
type maybePromise<T> = Promise<T> | T;
type Class<T = any> = {
    new (...args: any[]): T;
};
type Partially<T> = {
    [K in keyof T]: T[K] | undefined;
};

/**
 * A decorator function that creates a singleton class from the provided constructor.
 * The singleton instance is cached and returned on subsequent calls to the constructor.
 * @param constructor - The constructor function of the class to be made a singleton.
 * @returns A new class that extends the provided constructor and implements the singleton pattern.
 */
declare const Singleton: <T extends Class>(constructor: T) => {
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
declare const Cached: <T extends Class>(constructor: T) => {
    new (...args: any[]): {
        [x: string]: any;
    };
} & T;
/**
 * Method decorator. Bind this to method when destructured.
 */
declare const bind: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const memoize: (_t: any, _k: string, desc: PropertyDescriptor) => PropertyDescriptor;
declare const deprecated: (message: string) => (_t: any, key: string, desc: PropertyDescriptor) => PropertyDescriptor;

declare const updateClass: (a: obj<any>, classes: string[]) => string[];

interface CookieOptions {
    /**
     * Max-Age in seconds, or a Date from which seconds will be derived.
     */
    maxAge?: number | Date;
    /**
     * Expires as Date, timestamp, or preformatted date string.
     */
    expires?: Date | number | string;
    path?: string | null;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None" | null;
    /**
     * Internal only – not serialized; used if you actually measure size.
     */
    maxSize?: number;
    syncExpires?: boolean;
}
declare const setCookie: (key: string, value?: string, options?: CookieOptions) => string;
declare const serializeCookie: (name: string, value?: string, options?: CookieOptions) => string;
declare const setDocumentCookie: (name: string, value?: string, options?: CookieOptions) => void;

type CSSinT = {
    [P in keyof CSSStyleDeclaration]?: V;
} & {
    [key: string]: V;
};
declare const getOrCreateStyleSheet: () => CSSStyleSheet | undefined;
declare const hasExistingRule: (styleSheet: CSSStyleSheet, selector: string) => boolean;
declare const ensureRule: (sheet: CSSStyleSheet, selector: string, body: string) => void;
declare function upsertCSS(selector: string, rules?: CSSinT): void;

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
declare const keyInMap: <T>(key: string, map: Mapper<string, any>) => T;
declare const keyInMapArray: <T>(key: string, map: Mapper<string, any>) => T;
declare const oVals: <T>(obj: T) => Array<T[keyof T]>;
declare const oKeys: <T extends object>(obj: T) => Array<keyof T>;
declare const oItems: <T extends object>(obj: T) => Array<[keyof T, T[keyof T]]>;
declare const oFItems: <K extends PropertyKey, V>(entries: Iterable<readonly [K, V]>) => {
    [P in K]: V;
};
declare const oFreeze: <T>(obj: T) => Readonly<T>;
declare const oDefine: <T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => T;
declare const oAss: <T, U>(target: T, source: U) => T & U;
declare const oHas: (o: object, v: PropertyKey) => boolean;
declare const oLen: (ob: object) => number;
type Changes = {
    added: Record<string, unknown>;
    removed: Record<string, unknown>;
    modified: Record<string, {
        old: unknown;
        new: unknown;
    }>;
};
declare const compareObjects: <T extends object>(oldObj: T, newObj: T) => Changes;
declare const objectUpdated: (changes: Changes) => boolean;
declare function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean;

declare class Idm {
    private counter;
    private readonly baseId;
    constructor(rawId?: string);
    get id(): string;
    get nextId(): string;
}

type MetaTag = {
    charset: string;
} | {
    name: string;
    content: string;
} | {
    property: string;
    content: string;
} | {
    "http-equiv": string;
    content: string;
};
interface MetaViewport {
    width?: string;
    height?: string;
    initialScale?: string;
    minimumScale?: string;
    maximumScale?: string;
    userScalable?: "yes" | "no";
    interactiveWidget?: "resizes-content" | "overlays-content";
}
interface HttpEquiv {
    contentSecurityPolicy?: string;
    contentType?: string;
    defaultStyle?: string;
    refresh?: string | number;
    cacheControl?: string;
    xUaCompatible?: string;
}
interface OpenGraphBase {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}
type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";
interface TwitterMeta extends OpenGraphBase {
    card?: TwitterCardType;
}
declare class MetaBuilder {
    readonly tags: MetaTag[];
    constructor(description?: string);
    author(name: string): this;
    charset(value: string): this;
    keywords(...keywords: string[]): this;
    viewport(vp: MetaViewport): this;
    httpEquiv(values: HttpEquiv): this;
    robots(...directives: ("index" | "noindex" | "follow" | "nofollow")[]): this;
    themeColor(color: string): this;
    openGraph(og: OpenGraphBase): this;
    twitter(meta: TwitterMeta): this;
    extend(tags: MetaTag[]): this;
    toArray(): readonly MetaTag[];
}

type Obj<T> = Record<string, T>;
type MetaAttrs<Value = string> = {
    charset?: Value;
    content?: Value;
    "http-equiv"?: Value;
    name?: Value;
    property?: Value;
    media?: Value;
    url?: Value;
};
type LinkAttrs<Value = string> = {
    href?: Value;
    hreflang?: Value;
    media?: Value;
    referrerpolicy?: Value;
    rel?: "stylesheet" | "icon" | "manifest" | Value;
    sizes?: Value;
    title?: Value;
    type?: Value;
    as?: Value;
    crossorigin?: Value;
};
type ImportMapAttrs<Value = string> = {
    imports?: Obj<Value>;
    scopes?: Obj<Value>;
    integrity?: Obj<Value>;
};
type ScriptAttrs<Value = string | boolean> = {
    async?: Value;
    crossorigin?: Value;
    defer?: Value;
    integrity?: Value;
    nomodule?: Value;
    referrerpolicy?: Value;
    src?: Value;
    type?: "text/javascript" | Value;
    id?: Value;
    importmap?: ImportMapAttrs<Value>;
    body?: Value;
    yid?: string;
};
type BaseAttrs<Value = string> = {
    href?: Value;
    target?: "_blank" | "_parent" | "_self" | "_top";
};
interface HeadAttributes<Value = string> {
    title?: string;
    description?: string;
    base?: BaseAttrs<Value>[];
    meta?: MetaAttrs<Value>[] | MetaBuilder;
    link?: LinkAttrs<Value>[];
    script?: ScriptAttrs<Value>[];
    css?: Value[] | Value;
    js?: Value[] | Value;
}
declare abstract class Head implements HeadAttributes {
    title?: string;
    description?: string;
    css?: string[] | string;
    js?: string[] | string;
    meta?: MetaAttrs<string>[] | MetaBuilder;
    link?: LinkAttrs<string>[];
    script?: ScriptAttrs<string>[];
}
declare function createHead(attrs?: HeadAttributes): HeadAttributes;
type HeadNode<Value = string> = {
    tag: "title";
    content: string;
} | {
    tag: "base";
    attrs: BaseAttrs<Value>;
} | {
    tag: "meta";
    attrs: MetaAttrs<Value>;
} | {
    tag: "link";
    attrs: LinkAttrs<Value>;
} | {
    tag: "script";
    attrs: ScriptAttrs<Value>;
};
type headType = Mapper<keyof HeadAttributes, any>;
interface HeadConfig {
    initial?: headType;
    mark?: boolean;
    push?: obj<any>;
}
declare class HeadCtx {
    private _head;
    idm?: Idm;
    mark: boolean;
    push: obj<any>;
    constructor({ initial, mark, push }?: HeadConfig);
    private handleTitleBase;
    private handleMeta;
    private handleLink;
    private handleScript;
    set head(heads: HeadAttributes);
    get head(): headType;
    set id(id: string);
}
declare const getAttr: (attr: obj<V>) => string;
declare const renderHead: (v: headType) => string;
declare class HtmlHead {
    lang: string;
    htmlHead: headType;
    head: (heads?: Omit<HeadAttributes, "base"> & {
        base?: HeadAttributes["base"];
    }) => void;
    constructor({ mark, push }?: HeadConfig);
}
declare const CSSJSHead: (_hhead: HeadCtx, head: Partially<HeadAttributes>) => void;

declare const isClassOrId: (selector: string) => boolean;

declare const cssLoader: (attrs: LinkAttrs<string>) => Promise<HTMLLinkElement | undefined>;
declare const metaLoader: (attrs: MetaAttrs<string>) => Promise<HTMLMetaElement | undefined>;
declare const scriptLoader: (rawAttrs: obj<any>) => Promise<HTMLScriptElement | undefined>;

declare const addBASE: (base: string, str: string) => string;

declare const IfClient: <T>(fn: () => T) => T | null;

declare const isBoolean: (v: unknown) => v is boolean;
declare const isString: (v: unknown) => v is string;
declare const isNumber: (v: unknown) => v is number;
declare const isBigInt: (v: unknown) => v is bigint;
declare const isSymbol: (v: unknown) => v is symbol;
declare const isFunction: (v: unknown) => v is (...args: any[]) => any;
declare const isNumberLike: (value: unknown) => boolean;
declare const isArray: <T = unknown>(v: unknown) => v is T[];
declare const isReadonlyArray: <T = unknown>(v: unknown) => v is readonly T[];
declare const isArrayBuffer: (v: unknown) => v is ArrayBuffer;
declare const isArrayBufferView: (v: unknown) => v is ArrayBufferView;
declare const isUint8Array: (v: unknown) => v is Uint8Array;
declare const isBinaryLike: (v: unknown) => v is Uint8Array | ArrayBuffer | string;
declare const isObject: (v: unknown) => v is object;
declare const isPlainObject: (v: unknown) => v is Record<PropertyKey, unknown>;
declare const isNonEmptyObject: (v: unknown) => v is Record<PropertyKey, unknown>;
declare const isRecord: <K extends PropertyKey = string, V = unknown>(v: unknown) => v is Record<K, V>;
declare const isIterable: <T = unknown>(v: unknown) => v is Iterable<T>;
declare const isAsyncIterable: <T = unknown>(v: unknown) => v is AsyncIterable<T>;
declare const isMap: <K = unknown, V = unknown>(v: unknown) => v is Map<K, V>;
declare const isSet: <T = unknown>(v: unknown) => v is Set<T>;
declare const isWeakMap: (v: unknown) => v is WeakMap<object, unknown>;
declare const isWeakSet: (v: unknown) => v is WeakSet<object>;
declare const isObjectLike: (v: unknown) => v is object;
declare const isNonFunctionObject: (v: unknown) => v is object;
declare const isNull: (v: unknown) => v is null;
declare const isUndefined: (v: unknown) => v is undefined;
declare const isDefined: <T>(v: T) => v is Exclude<T, undefined>;
declare const isNullish: (v: unknown) => v is null | undefined;
declare const isNotNull: <T>(v: T) => v is Exclude<T, null>;
declare const isNotNullish: <T>(v: T) => v is Exclude<T, null | undefined>;
declare const isEmptyString: (v: unknown) => v is "";
declare const isNonEmptyString: (v: unknown) => v is string;
declare const isWhitespace: (v: unknown) => v is string;
declare const isInteger: (v: unknown) => v is number;
declare const isFiniteNumber: (v: unknown) => v is number;
declare const isPositiveNumber: (v: unknown) => v is number;
declare const isNonNegativeNumber: (v: unknown) => v is number;
declare const isDate: (v: unknown) => v is Date;
declare const isRegExp: (v: unknown) => v is RegExp;
declare const isError: (v: unknown) => v is Error;
declare const isPromise: <T = unknown>(v: unknown) => v is Promise<T>;
declare const isEmpty: (v: unknown) => boolean;
declare const isPrimitive: (v: unknown) => v is string | number | boolean | bigint | symbol | null | undefined;
type ModuleLike = {
    [Symbol.toStringTag]: "Module";
    default?: unknown;
    [key: string]: unknown;
};
declare const isModule: (value: unknown) => value is ModuleLike;
declare const isBrowser: () => boolean;
declare const isNotBrowser: () => boolean;
declare const isAsyncFunction: (fn: unknown) => fn is (...args: any[]) => Promise<unknown>;
declare const isClass: (value: unknown) => value is Function;
declare const isInstanceOf: <T>(value: unknown, ctor: new (...args: any[]) => T) => value is T;
declare const isSubclassOf: (baseClass: Function, testClass: Function) => boolean;

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

declare const numSequence: (length: number) => number[];
declare const ngify: (str: object) => string;
declare const sparse: (str: string) => any;
declare const camel: (str: string) => string;
declare const reCamel: (_case: string) => string;
declare const rand: (min?: number, max?: number) => number;
declare const randomAZ: () => string | undefined;
declare const strip: (str: string, charToStrip: string) => string;
declare const stripOnce: (char: string, tostrip: string) => string;
declare const buffed: (str: string) => Buffer;
declare const strDecode: (str: any) => string;
declare const makeID: (length: number) => string;

declare const pathType: (wrd: string, isFinal?: boolean) => [any, string];
declare const parsePath: (path: string) => {
    parsed: string[];
    args: string[];
};

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

export { CSSJSHead, Cached, Cacher, Head, HeadCtx, HtmlHead, Idm, IfClient, Mapper, MetaBuilder, MinStorage, Singleton, Storage, SymStorage, Time, addBASE, areSetsEqual, arrFrom, asArray, asBool, asNumber, bind, buffed, camel, compareObjects, createHead, cssLoader, deprecated, ensureRule, formatDate, getAttr, getOrCreateStyleSheet, hasExistingRule, isArray, isArrayBuffer, isArrayBufferView, isAsyncFunction, isAsyncIterable, isBigInt, isBinaryLike, isBoolean, isBrowser, isClass, isClassOrId, isDate, isDefined, isEmpty, isEmptyString, isError, isFiniteNumber, isFunction, isInstanceOf, isInteger, isIterable, isMap, isModule, isNonEmptyObject, isNonEmptyString, isNonFunctionObject, isNonNegativeNumber, isNotBrowser, isNotNull, isNotNullish, isNull, isNullish, isNumber, isNumberLike, isObject, isObjectLike, isPlainObject, isPositiveNumber, isPrimitive, isPromise, isReadonlyArray, isRecord, isRegExp, isSet, isString, isSubclassOf, isSymbol, isUint8Array, isUndefined, isWeakMap, isWeakSet, isWhitespace, keyInMap, keyInMapArray, log, makeID, matchPath, memoize, metaLoader, ngify, numSequence, oAss, oDefine, oFItems, oFreeze, oHas, oItems, oKeys, oLen, oVals, objectUpdated, parsePath, pathType, rand, randomAZ, reCamel, registerToken, renderHead, scriptLoader, serializeCookie, setCookie, setDocumentCookie, sparse, strDecode, strip, stripOnce, updateClass, upsertCSS };
export type { BaseAttrs, CSSinT, Class, CookieOptions, HeadAttributes, HeadNode, HttpEquiv, ImportMapAttrs, LinkAttrs, MetaAttrs, MetaTag, MetaViewport, ModuleLike, OpenGraphBase, Partially, ScriptAttrs, TwitterCardType, TwitterMeta, V, dict, headType, maybePromise, obj };

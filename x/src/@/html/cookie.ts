export interface CookieOptions {
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

export const setCookie = (
  key: string,
  value = "",
  options: CookieOptions = {},
): string => {
  const { maxAge, expires, path, domain, secure, httpOnly, sameSite } = options;

  const normalizedMaxAge =
    maxAge instanceof Date
      ? Math.floor(maxAge.getTime() / 1000)
      : typeof maxAge === "number"
        ? maxAge
        : undefined;

  let normalizedExpires: string | undefined;
  if (expires instanceof Date) {
    normalizedExpires = expires.toUTCString();
  } else if (typeof expires === "number") {
    normalizedExpires = new Date(expires).toUTCString();
  } else if (typeof expires === "string") {
    normalizedExpires = expires;
  } else if (expires === 0) {
    normalizedExpires = new Date().toUTCString();
  }
  const directives: string[] = [];

  if (domain) directives.push(`Domain=${domain}`);
  if (normalizedExpires) directives.push(`Expires=${normalizedExpires}`);
  if (normalizedMaxAge !== undefined)
    directives.push(`Max-Age=${normalizedMaxAge}`);
  if (secure) directives.push("Secure");
  if (httpOnly) directives.push("HttpOnly");
  if (path != null) directives.push(`Path=${path}`);
  if (sameSite != null) directives.push(`SameSite=${sameSite}`);

  return [`${key}=${value}`, ...directives].join("; ");
};

export const serializeCookie = (
  name: string,
  value = "",
  options: CookieOptions = {},
): string => setCookie(name, value, options);

export const setDocumentCookie = (
  name: string,
  value = "",
  options: CookieOptions = {},
) => {
  document.cookie = serializeCookie(name, value, options);
};

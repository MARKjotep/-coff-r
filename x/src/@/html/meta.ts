import { oItems } from "../obj";
import { reCamel } from "../str";

// core tag shape
export type MetaTag =
  | { charset: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { "http-equiv": string; content: string };

// factories
const nameTag = (name: string, content: string): MetaTag => ({ name, content });

const propTag = (property: string, content: string): MetaTag => ({
  property,
  content,
});

const equivTag = (value: string, content: string): MetaTag => ({
  "http-equiv": value,
  content,
});

// fine‑grained config types
export interface MetaViewport {
  width?: string;
  height?: string;
  initialScale?: string;
  minimumScale?: string;
  maximumScale?: string;
  userScalable?: "yes" | "no";
  interactiveWidget?: "resizes-content" | "overlays-content";
}

export interface HttpEquiv {
  contentSecurityPolicy?: string;
  contentType?: string;
  defaultStyle?: string;
  refresh?: string | number;
  cacheControl?: string;
  xUaCompatible?: string;
}

export interface OpenGraphBase {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export type TwitterCardType =
  | "summary"
  | "summary_large_image"
  | "app"
  | "player";

export interface TwitterMeta extends OpenGraphBase {
  card?: TwitterCardType;
}

export class MetaBuilder {
  public readonly tags: MetaTag[] = [];

  constructor(description?: string) {
    if (description) {
      this.tags.push(nameTag("description", description));
    }
  }

  author(name: string) {
    this.tags.push(nameTag("author", name));
    return this;
  }

  charset(value: string) {
    this.tags.push({ charset: value });
    return this;
  }

  keywords(...keywords: string[]) {
    if (keywords.length > 0) {
      this.tags.push(nameTag("keywords", keywords.join(", ")));
    }
    return this;
  }

  viewport(vp: MetaViewport) {
    const parts = oItems(vp).map(([k, v]) => `${reCamel(k)}=${String(v)}`);
    if (parts.length) {
      this.tags.push(nameTag("viewport", parts.join(", ")));
    }
    return this;
  }

  httpEquiv(values: HttpEquiv) {
    oItems(values).forEach(([k, v]) => {
      this.tags.push(equivTag(reCamel(k), String(v)));
    });
    return this;
  }

  robots(...directives: ("index" | "noindex" | "follow" | "nofollow")[]) {
    if (directives.length) {
      this.tags.push(nameTag("robots", directives.join(", ")));
    }
    return this;
  }

  themeColor(color: string) {
    this.tags.push(nameTag("theme-color", color));
    return this;
  }

  openGraph(og: OpenGraphBase) {
    oItems(og).forEach(([k, v]) => {
      this.tags.push(propTag(`og:${k}`, String(v)));
    });
    return this;
  }

  twitter(meta: TwitterMeta) {
    oItems(meta).forEach(([k, v]) => {
      // `card` and OG-ish fields map to twitter:* name tags
      this.tags.push(nameTag(`twitter:${k}`, String(v)));
    });
    return this;
  }

  // accept any externally built tags
  extend(tags: MetaTag[]) {
    this.tags.push(...tags);
    return this;
  }

  // expose as readonly to avoid accidental mutation
  toArray(): readonly MetaTag[] {
    return this.tags;
  }
}

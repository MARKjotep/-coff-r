import { oItems } from "../obj";
import { reCamel } from "../str";

const contxt = (prop: string, ctx: string) => {
  return { name: prop, content: ctx };
};
const prop = (prop: string, ctx: string) => {
  return { property: prop, content: ctx };
};
const equiv = (prop: string, ctx: string) => {
  return { "http-equiv": prop, content: ctx };
};

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

type meta<T> = {
  charset?: T;
  content?: T;
  "http-equiv"?: T;
  name?: T;
  property?: T;
  media?: T;
  url?: T;
};

export class Meta {
  metas: Record<string, string>[] = [];
  constructor(description?: string) {
    description && this.metas.push(contxt("description", description));
  }
  author(name: string) {
    this.meta = contxt("author", name);
    return this;
  }
  charset(val: string) {
    this.meta = { charset: val };
    return this;
  }
  keywords(...keyword: string[]) {
    this.meta = contxt("keywords", keyword.join(", "));
    return this;
  }
  viewport(vport: metaViewport) {
    const OT = oItems(vport).map(([k, v]) => [reCamel(k), String(v)].join("="));
    this.meta = contxt("viewport", OT.join(", "));
    return this;
  }
  httpEquiv(httpeQuiv: httpeQuiv) {
    oItems(httpeQuiv).forEach(([k, v]) => {
      this.meta = equiv(reCamel(k), String(v));
    });

    return this;
  }
  robots(...robot: ("index" | "noindex" | "follow" | "nofollow")[]) {
    this.meta = contxt("robots", robot.join(", "));
    return this;
  }
  themeColor(color: string) {
    this.meta = contxt("theme-color", color);
    return this;
  }
  openGraph(og: Omit<OG, "card">) {
    oItems(og).forEach(([k, v]) => {
      this.meta = prop("og:" + k, String(v));
    });
    return this;
  }
  twitter(og: OG) {
    oItems(og).forEach(([k, v]) => {
      this.meta = contxt("twitter:" + k, String(v));
    });
    return this;
  }
  push(metas: meta<string>[]) {
    this.metas.unshift(...metas);
  }
  private set meta(value: Record<string, string>) {
    this.metas.push(value);
  }
}

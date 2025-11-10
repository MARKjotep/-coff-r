import { Mapper } from "../../obj";

export class Cacher<T> {
  private storage: Mapper<string, T>;
  constructor() {
    this.storage = new Mapper();
  }
  cache(key: string, val: () => T): T {
    if (this.storage.lacks(key)) {
      this.storage.set(key, val());
    }
    return this.storage.get(key)!;
  }
}

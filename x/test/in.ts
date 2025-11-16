import { log, isDefined } from "../src";
import { bind } from "../src";

const random = () => Math.random();

class SS {
  hello = 123;
  get random() {
    return random();
  }
  @bind
  binder() {
    log.i = "123";
    return this;
  }
}
const { binder } = new SS();

log.i = binder();

import { Listner } from "./globalAnimation";

export class Trigger {
  listner: Listner = () => {};

  public notify(message?: string) {
    this.listner(message);
  }

  public listen(listner: Listner) {
    this.listner = listner;
  }

  public static build() {
    return new this();
  }
}

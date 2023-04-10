import { Listner } from "./globalAnimation";

export class Trigger {
  listner: Listner | null = null;

  public notify(message?: string) {
    if (this.listner) {
      this.listner(message);
    }
  }

  public listen(listner: Listner) {
    this.listner = listner;
  }

  public static build() {
    return new this();
  }
}

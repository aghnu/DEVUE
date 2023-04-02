import { Listner } from "./globalAnimation";

export class Trigger {
  listner: Listner = () => {};

  public notify() {
    this.listner();
  }

  public listen(listner: Listner) {
    this.listner = listner;
  }
}
